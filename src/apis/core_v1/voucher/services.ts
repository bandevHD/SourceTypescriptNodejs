import VoucherMongo from '../../../model/mongodb/Voucher';
import EventMongo from '../../../model/mongodb/Events';
import dotenv from 'dotenv';
import UserMongo from '../../../model/mongodb/user';
import {
  CreateVoucherType,
  DeleteBaseType,
  PaginationType,
  ReadOneVoucherType,
  SendEmailVoucherBull,
  SendMailContaxt,
  UpdatePutVoucherType,
} from '../../../utils/types';

import { BaseService } from '../../base/base_service';
import { Voucher } from '../../../model/typeorm/mysql/index';
import { agenda } from '../../../config/agenda';
import { Job } from 'agenda';
import { handlerEmail, handlerEmailMjML } from '../../modules/emailService';
import JobAgenda from '../../modules/jobService';
import moment from 'moment';
import mongoose, { ClientSession } from 'mongoose';
import { randomUUID } from 'crypto';
import { sendMailQueue } from '../../../config/bull';
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
} from '../../../utils/constant';

dotenv.config();

const { MONGODB_ATLAS } = process.env;
export const createVoucherMongoose = async (data: object) => {
  let maxiMumQuantity = 1;
  let saveVoucher = null;
  const codeVoucher: string = randomUUID();
  const conn = await mongoose.connect(MONGODB_ATLAS);
  const session: ClientSession = await conn.startSession();
  session.startTransaction({
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  });

  try {
    const voucher = new VoucherMongo({ ...data, code: codeVoucher });
    saveVoucher = await voucher.save({ session });
    const eventFineOne = await EventMongo.findOne(
      {
        typeEvent: 'voucher',
        maxiMumQuantity: { $lte: 10 },
      },
      null,
    );

    if (_.isNull(eventFineOne)) {
      const eventCreare = new EventMongo({ typeEvent: 'voucher', maxiMumQuantity: 1 });
      await eventCreare.save({ session });
    }

    if (_.isNull(eventFineOne) == false && eventFineOne.maxiMumQuantity < 10) {
      maxiMumQuantity = eventFineOne.maxiMumQuantity + 1;

      await EventMongo.updateOne({ typeEvent: 'voucher' }, { maxiMumQuantity }, { session });
    } else if (_.isNull(eventFineOne) == false && eventFineOne.maxiMumQuantity >= 10) {
      throw 'Vượt quá 10 voucher';
    }
    // await EventMongo.findOneAndUpdate(
    //   { typeEvent: 'voucher' },
    //   { maxiMumQuantity },
    //   {
    //     session,
    //     new: true,
    //     upsert: true,
    //   },
    // );

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
      throw new Error(error);
    }
  } finally {
    await session.endSession();
  }
};

export const getListVoucherMongoose = async () => {
  return await VoucherMongo.find();
};

export const getOneVoucherMongoose = async (_id: string) => {
  return await VoucherMongo.findOne({ _id });
};

export const updateOneVoucherMongoose = async (data) => {
  return await VoucherMongo.findOneAndUpdate({ _id: data._id }, data);
};

export const runCronJobAll = async () => {
  await cronJobSendEmailVoucher();
  // await sendMailExample();
};

export const sendMailExample = async () => {
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
};

export const cronJobSendEmailVoucher = async () => {
  const userAll = await UserMongo.find();
  const emailArray = userAll.map((result) => result.email);
  // console.log(emailArray)
  sendMailQueue.process(
    'sendEmailStartSalevoucher',
    25,
    async (job: Bull.Job<SendEmailVoucherBull>, done: DoneCallback) => {
      await sendEmailStartSaleVoucher(job);

      done();
    },
  );
  sendMailQueue.process(
    'sendEmailEndSalevoucher',
    25,
    async (job: Bull.Job<SendEmailVoucherBull>, done: DoneCallback) => {
      await sendEmailEndSaleVoucher(job);

      done();
    },
  );
  await sendMailQueue.add(
    'sendEmailStartSalevoucher',
    { to: `${emailArray.toString()}` },
    {
      repeat: {
        every: 10000,
        limit: 100,
      },
    },
  );
  await sendMailQueue.add(
    'sendEmailEndSalevoucher',
    { to: `${emailArray.toString()}` },
    {
      repeat: {
        every: 10000,
        limit: 100,
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
};

export const sendEmailStartSaleVoucher = async (job: Bull.Job<SendEmailVoucherBull>) => {
  const to: string = job.data.to;
  const nowMoment: string = moment().format('YYYY-MM-DD HH:mm');
  const voucherAll = await VoucherMongo.find({ startTimeAt: { $eq: nowMoment } });
  for (const voucher of voucherAll) {
    await handlerEmailMjML(to, contentStartSaleEmailVoucher(voucher));
  }
};

export const sendEmailEndSaleVoucher = async (job: Bull.Job<SendEmailVoucherBull>) => {
  const to = job.data.to;
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
  for (const voucher of voucherAll) {
    await handlerEmailMjML(to, contentEndSaleEmailVoucher(voucher));
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
    // await this.cronjobSendMailStartSaleVoucher();
    // await this.cronjobSendMailEndSaleVoucher();
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

    agenda.on('start', (job) => {
      console.log('Job %s starting', job.attrs.name);
    });

    agenda.on('complete', (job) => {
      console.log(`Job ${job.attrs.name} finished`);
    });

    agenda.on('success:send email start sale voucher', (job) => {
      console.log(`Sent Email Successfully to ${job.attrs.data.to}`);
    });

    agenda.on('fail:send email start sale voucher', (err) => {
      console.log(`Job failed with error: ${err.message}`);
    });
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

    agenda.on('start', (job) => {
      console.log('Job %s starting', job.attrs.name);
    });

    agenda.on('complete', (job) => {
      console.log(`Job ${job.attrs.name} finished`);
    });

    agenda.on('success:send email end sale voucher', (job) => {
      console.log(`Sent Email Successfully to ${job.attrs.data.to}`);
    });

    agenda.on('fail:send email end sale voucher', (err) => {
      console.log(`Job failed with error: ${err.message}`);
    });
  };
  sendMailStartSaleVoucher = async (job: Job<SendMailContaxt>) => {
    const to = job.attrs.data.to;
    const nowMoment: string = moment().format('YYYY-MM-DD HH:mm');
    const voucherAll = await VoucherMongo.find({ startTimeAt: { $eq: nowMoment } });
    let count = 0;
    while (count < voucherAll.length) {
      await handlerEmail(to, `Bắt đầu khuyến mãi nhanh tay lên nào`);
      count += 1;
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
    let count = 0;
    while (count < voucherAll.length) {
      await handlerEmail(to, `Còn 30 phút nữa hết khuyến mãi`);
      count += 1;
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
