import VoucherMongo from '../../../model/mongodb/Voucher';
import EventMongo from '../../../model/mongodb/Events';
import dotenv from 'dotenv';
import UserMongo from '../../../model/mongodb/user';
import {
  CreateVoucherType,
  DeleteBaseType,
  PaginationType,
  queue,
  ReadOneVoucherType,
  SendEmailVoucherBull,
  SendMailContaxt,
  UpdatePutVoucherType,
} from '../../../utils/types';

import { BaseService } from '../../base/base_service';
import { Voucher } from '../../../model/typeorm/mysql/index';
import { agenda, processAgenda } from '../../../config/agenda';
import { Job } from 'agenda';
import { handlerEmailMjML } from '../../modules/emailService';
import JobAgenda from '../../modules/jobService';
import moment from 'moment';
import mongoose, { ClientSession } from 'mongoose';
import { randomUUID } from 'crypto';
import { processBull, sendMailQueue } from '../../../config/bull';
import Bull, { DoneCallback } from 'bull';
import { myDataSource } from '../../../config/conenctTypeORM';
import { Event } from '../../../model/typeorm/mysql/Event';
import { Response } from 'express';
import { RESPONSES } from '../../../utils/HttpStatusResponseCode';
import * as _ from 'lodash';
import {
  contentEmailVoucher,
  contentEndSaleEmailVoucher,
  contentStartSaleEmailVoucher,
  findVoucherAll,
  nameJob,
  optionJob,
  optionRepeatJob,
  priorityNumber,
  typeEvent,
} from '../../../utils/constant';

dotenv.config();

const { MONGODB_ATLAS } = process.env;

const runTransactionWithRetry = async (txnFunc, session: ClientSession, data: object) => {
  while (true) {
    try {
      await txnFunc(data, session);
      break;
    } catch (error) {
      if (
        error.hasOwnProperty('errorLabels') &&
        error.errorLabels.includes('TransientTransactionError')
      ) {
        console.info('TransientTransactionError, retrying transaction ...');
        continue;
      } else {
        throw error;
      }
    }
  }
};

const commitWithRetry = async (session: ClientSession) => {
  while (true) {
    try {
      await session.commitTransaction();
      console.log('Transaction committed.');
      break;
    } catch (error) {
      // Can retry commit
      if (
        error.hasOwnProperty('errorLabels') &&
        error.errorLabels.includes('UnknownTransactionCommitResult')
      ) {
        console.log('UnknownTransactionCommitResult, retrying commit operation ...');
        continue;
      } else {
        console.log('Error during commit ...');
        throw error;
      }
    }
  }
};

export const createVoucher = async (data: object, session?: ClientSession) => {
  const codeVoucher: string = randomUUID();
  session.startTransaction({
    readConcern: { level: 'snapshot' },
    writeConcern: { w: 'majority' },
  });

  try {
    const result = await EventMongo.findOne({
      typeEvent: typeEvent.voucher,
      maxiMumQuantity: { $gte: 10 },
    });
    if (result) throw RESPONSES.BAD_REQUEST.MORE_THAN_ONE_10_VOUCHER;
    const voucher = new VoucherMongo({ ...data, code: codeVoucher });
    await voucher.save({ session });
    await EventMongo.findOneAndUpdate(
      { typeEvent: 'voucher' },
      { $inc: { maxiMumQuantity: 1 } },
      {
        session,
        new: true,
        upsert: true,
      },
    );
    // return saveVoucher;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }
  await commitWithRetry(session);
};
export const createVoucherMongooseWithTransaction = async (data: object) => {
  const conn: typeof mongoose = await mongoose.connect(MONGODB_ATLAS);
  const session: ClientSession = await conn.startSession();
  try {
    await runTransactionWithRetry(createVoucher, session, data);
  } catch (error) {
    throw new Error(error);
  } finally {
    await session.endSession();
  }
};

export const createVoucherMongoose = async (data: object) => {
  const codeVoucher: string = randomUUID();
  const conn: typeof mongoose = await mongoose.connect(MONGODB_ATLAS);
  const session: ClientSession = await conn.startSession();
  session.startTransaction({
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  });

  try {
    const voucher = new VoucherMongo({ ...data, code: codeVoucher });
    const saveVoucher = await voucher.save({ session });
    await EventMongo.findOneAndUpdate(
      { typeEvent: 'voucher' },
      { $inc: { maxiMumQuantity: 1 } },
      {
        session,
        new: true,
        upsert: true,
      },
    );

    await session.commitTransaction();
    return saveVoucher;
  } catch (error) {
    if (
      error.hasOwnProperty('errorLabels') &&
      error.errorLabels.includes('UnknownTransactionCommitResult')
    ) {
      console.log('UnknownTransactionCommitResult, retrying commit operation ...');
      await createVoucherMongoose(data);
    } else {
      await session.abortTransaction();
      throw new Error(RESPONSES.BAD_REQUEST.MORE_THAN_ONE_10_VOUCHER);
    }
  } finally {
    await session.endSession();
  }
};

export const createVoucherTest = async (data: object) => {
  const codeVoucher: string = randomUUID();
  try {
    const voucher = new VoucherMongo({ ...data, code: codeVoucher });
    const saveVoucher = await voucher.save();
    await EventMongo.findOneAndUpdate(
      { typeEvent: 'voucher' },
      { $inc: { maxiMumQuantity: 1 } },
      {
        new: true,
        upsert: true,
      },
    );
    return saveVoucher;
  } catch (error) {
    throw new Error(error);
  }
};

export const getListVoucherMongoose = async () => {
  return await VoucherMongo.find();
};

export const getOneVoucherMongoose = async (_id: string) => {
  try {
    return await VoucherMongo.findById({ _id });
  } catch (error) {
    throw new Error(error);
  }
};

export const updateOneVoucherMongoose = async (data) => {
  return await VoucherMongo.findByIdAndUpdate(data._id, data);
};

export const updatePatchVoucherMongoose = async (data) => {
  return await VoucherMongo.findOneAndUpdate({ _id: data._id }, data);
};

export const deleteVoucherMongoose = async (id: string) => {
  return await VoucherMongo.findByIdAndUpdate(id, { isDelete: true });
};

export const runCronJobAll = async () => {
  await cronJobSendEmailVoucher();
  // await sendMailExample();
};

export const sendMailExample = async () => {
  try {
    const voucherOne = await VoucherMongo.findOne();
    sendMailQueue.process(
      'sendEmail',
      25,
      async (job: Bull.Job<SendEmailVoucherBull>, done: DoneCallback) => {
        await handlerEmailMjML(job.data.to, contentEmailVoucher(voucherOne));

        done();
      },
    );

    await sendMailQueue.add(
      'sendEmail',
      { to: `bant835@gmail.com` },
      {
        repeat: {
          every: 10000,
          limit: 10,
        },
      },
    );

    sendMailQueue.on('waiting', (job, result) => {
      console.log(`Job waiting with jod id ${job.id} result ${result}`);
    });

    sendMailQueue.on('active', (job, result) => {
      console.log(`Job active with jod id ${job.id} result ${result}`);
    });

    sendMailQueue.on('completed', (job, result) => {
      console.log(`Job completed with jod id ${job.id} result ${result}`);
    });

    await sendMailQueue.clean(5000);
  } catch (error) {
    throw new Error(error);
  }
};

export const cronJobSendEmailVoucher = async () => {
  try {
    const userAll = await UserMongo.find();
    const emailArray = userAll.map((result) => result.email);
    // sendMailQueue.process(
    //   nameJob.sendEmailStartSalevoucher,
    //   priorityNumber.priority25,
    //   async (job: Bull.Job<SendEmailVoucherBull>, done: DoneCallback) => {
    //     console.log(`Processing Job-${job.id} Attempt: ${job.attemptsMade}`);
    //     await sendEmailStartSaleVoucher(job, async (error) => {
    //       console.log('error', error);
    //       if (error) {
    //         console.log('error', error);
    //         await repeatJobSendEmailStartSaleVoucher(sendMailQueue, job, done);
    //       } else done();
    //     });
    //   },
    // );
    sendMailQueue.process(
      nameJob.sendEmailEndSalevoucher,
      priorityNumber.priority25,
      async (job: Bull.Job<SendEmailVoucherBull>, done: DoneCallback) => {
        try {
          await sendEmailEndSaleVoucher(job, async (error) => {
            if (error) await repeatJobSendEmailEndSaleVoucher(sendMailQueue, job, done);
            else done();
          });
        } catch (error) {
          throw error;
        }
      },
    );
    // await sendMailQueue.add(
    //   'sendEmailStartSalevoucher',
    //   { to: `${emailArray.toString()}` },
    //   {
    //     repeat: {
    //       every: 10000,
    //       limit: 100,
    //     },
    //   },
    // );
    await sendMailQueue.add(
      nameJob.sendEmailEndSalevoucher,
      { to: `${emailArray.toString()}` },
      optionJob,
    );
    processBull(sendMailQueue);
  } catch (error) {
    throw new Error(error);
  }
};

export const repeatJobSendEmailStartSaleVoucher = async (
  queue: queue,
  job: Bull.Job<SendEmailVoucherBull>,
  done: DoneCallback,
) => {
  const newJob = await queue.add(nameJob.sendEmailStartSalevoucher, job.data, optionRepeatJob);
  console.log(`Job-${job.id} failed. Creating new Job-${newJob.id} with highest priority`);
  done();
};

export const repeatJobSendEmailEndSaleVoucher = async (
  queue: queue,
  job: Bull.Job<SendEmailVoucherBull>,
  done: DoneCallback,
) => {
  const newJob = await queue.add(nameJob.sendEmailEndSalevoucher, job.data, optionRepeatJob);
  console.log(`Job-${job.id} failed. Creating new Job-${newJob.id} with highest priority`);
  done();
};

export const sendEmailStartSaleVoucher = async (
  job: Bull.Job<SendEmailVoucherBull>,
  done: DoneCallback,
) => {
  try {
    const to: string = job.data.to;
    const nowMoment: string = moment().format('YYYY-MM-DD HH:mm');
    const voucherAll = await VoucherMongo.find({ startTimeAt: { $eq: nowMoment } });
    for (const voucher of voucherAll) {
      await handlerEmailMjML(to, contentStartSaleEmailVoucher(voucher));
    }
  } catch (error) {
    done(error);
    throw new Error(error);
  }
};

export const sendEmailEndSaleVoucher = async (
  job: Bull.Job<SendEmailVoucherBull>,
  done: DoneCallback,
) => {
  try {
    const to = job.data.to;
    const voucherAll = await VoucherMongo.aggregate(findVoucherAll());
    for (const voucher of voucherAll) {
      await handlerEmailMjML(to, contentEndSaleEmailVoucher(voucher));
    }
    // done({ name: 'true', message: 'testloi' });
  } catch (error) {
    done({ name: 'true', message: error });
    throw new Error(error);
  }
};

export default class VoucherService extends BaseService<typeof Voucher> {
  jobService;
  contact: SendMailContaxt;
  constructor() {
    super(Voucher);
    this.jobService = new JobAgenda();
  }
  runAllJob = async () => {
    await this.cronjobSendMailStartSaleVoucher();
    await this.cronjobSendMailEndSaleVoucher();
  };
  cronjobSendMailStartSaleVoucher = async () => {
    const userAll = await UserMongo.find();
    const emailArray = userAll.map((result) => result.email);

    agenda.define('send email start sale voucher', async (job: Job<SendMailContaxt>, done) => {
      await this.sendMailStartSaleVoucher(job);
      done();
    });
    const job: Job<SendMailContaxt> = await this.jobService.createJob(
      this.contact,
      'send email start sale voucher',
      {
        to: `${emailArray.toString()}`,
      },
    );
    job.repeatEvery('1 seconds', {
      skipImmediate: true,
    });
    await job.save();
    await agenda.start();

    processAgenda(agenda, 'send email start sale voucher');
  };
  cronjobSendMailEndSaleVoucher = async () => {
    const userAll = await UserMongo.find();
    const emailArray = userAll.map((result) => result.email);

    agenda.define('send email end sale voucher', async (job: Job<SendMailContaxt>, done) => {
      await this.sendMailEndSaleVoucher(job);
      done();
    });
    const job: Job<SendMailContaxt> = await this.jobService.createJob(
      this.contact,
      'send email end sale voucher',
      {
        to: `${emailArray.toString()}`,
      },
    );
    job.repeatEvery('1 seconds', {
      skipImmediate: true,
    });
    await job.save();
    await agenda.start();

    processAgenda(agenda, 'send email end sale voucher');
  };
  sendMailStartSaleVoucher = async (job: Job<SendMailContaxt>) => {
    const to = job.attrs.data.to;
    const nowMoment: string = moment().format('YYYY-MM-DD HH:mm');
    const voucherAll = await VoucherMongo.find({ startTimeAt: { $eq: nowMoment } });

    for (const voucherItem of voucherAll) {
      await handlerEmailMjML(to, voucherItem);
    }
  };
  sendMailEndSaleVoucher = async (job: Job<SendMailContaxt>) => {
    const to = job.attrs.data.to;
    const voucherAll = await VoucherMongo.aggregate([
      { $match: { timediff: { $eq: 30 } } },
      {
        $project: {
          timediff: {
            $dateDiff: {
              startDate: { $toDate: '$startTimeAt' },
              endDate: new Date(),
              unit: 'minute',
            },
          },
        },
      },
    ]);
    for (const voucherItem of voucherAll) {
      await handlerEmailMjML(to, voucherItem);
    }
  };
  //Restful APIs
  createVoucher = async (createVoucherType: CreateVoucherType) =>
    await this.createService(createVoucherType);

  readListVoucher = async (paginationType: PaginationType) =>
    await this.readListService(paginationType);

  readOneVoucher = async (readOneVoucherType: ReadOneVoucherType) => {
    readOneVoucherType.isDelete = false;
    return await this.readOneService(readOneVoucherType);
  };

  updatePutVoucher = async (id: string | number, updatePutVoucherType: UpdatePutVoucherType) =>
    await this.updatePutService(id, updatePutVoucherType);

  deleteVoucher = async (id: string | number, deleteVoucherType: DeleteBaseType) =>
    await this.deleteService(id, deleteVoucherType);

  editVoucherByMe = async (res: Response, data) => {
    const queryRunner = myDataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const event = await queryRunner.manager.findOneBy(Event, {
        typeEvent: 'voucher',
        eventId: data.eventId,
        userId: data.userId,
        isPermission: true,
      });

      if (!event) return res.status(RESPONSES.CONFLICT.CODE);

      const eventCreate = await queryRunner.manager.create(Event, data);

      await queryRunner.manager.save(Event, eventCreate);

      await queryRunner.commitTransaction();

      return res.status(RESPONSES.OK.CODE);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  };
}
