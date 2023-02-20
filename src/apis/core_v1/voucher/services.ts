import VoucherMongo from '../../../model/mongodb/Voucher';
import dotenv from 'dotenv';
import UserMongo from '../../../model/mongodb/user';
import {
  CreateVoucherType,
  DeleteBaseType,
  ReadOneVoucherType,
  SendMailContaxt,
  UpdatePutVoucherType,
} from '../../../utils/types';

import { BaseService } from '../../base/base_service';
import Voucher from '../../../model/mongodb/Voucher';
import Agenda, { Job } from 'agenda';
import { handlerEmail } from '../../modules/emailService';
// import JobAgenda from '../../modules/jobService';
// import AgendaClass from '../../../config/agenda';

dotenv.config();
export const createVoucherMongooseService = async (data: object) => {
  try {
    const voucher = new VoucherMongo(data);

    const saveVoucher = await voucher.save();

    return saveVoucher;
  } catch (error) {
    throw new Error(error);
  }
};

export default class VoucherService extends BaseService<typeof Voucher> {
  jobService;
  constructor() {
    super(Voucher);
    // this.jobService = new AgendaClass();
    this.cronjobSendMailVoucher();
  }
  cronjobSendMailVoucher = async () => {
    const userAll = await UserMongo.find();
    const voucherAll = await VoucherMongo.find();
    const emailArray = userAll.map((result) => result.email);
    console.log(emailArray);
    const agenda = new Agenda({
      db: { address: process.env.MONGGODB_URI },
      maxConcurrency: 20,
    });

    agenda.define(`send email voucher`, async (job) => {
      const { to } = job.attrs.data;

      await handlerEmail(to, `Đây là email đăng ký`);
    });

    await agenda.start();
    await agenda.schedule('in 1 minitues', 'send email voucher', {
      to: `trannhatban34@gmail.com`,
    });

    // for (const voucher of voucherAll) {
    //   const when: Date = new Date(voucher.startTimeAt);
    //   const now: Date = new Date();
    //   if (when.valueOf() == now.valueOf()) {
    //     console.log('when == now gửi mail');
    //   }
    // }
    agenda.on('start', (job) => {
      console.log('Job %s starting', job.attrs.name);
    });

    agenda.on('complete', (job) => {
      console.log(`Job ${job.attrs.name} finished`);
    });

    agenda.on('success:user register', (job) => {
      console.log(`Sent Email Successfully to ${job.attrs.data.to}`);
    });

    agenda.on('fail:user register', (err, job) => {
      console.log(`Job failed with error: ${err.message}`);
    });
  };
  sendMailVoucher = async (job: Job<SendMailContaxt>) => {
    const { to } = job.attrs.data;
  };
  //Restful APIs
  createVoucher = async (createVoucherType: CreateVoucherType) =>
    await this.createService(createVoucherType);

  readListVoucher = async () => await this.readListService();

  readOneVoucher = async (readOneVoucherType: ReadOneVoucherType) => {
    readOneVoucherType.isDelete = false;
    return await this.readOneService(readOneVoucherType);
  };

  updatePutVoucher = async (id: string | number, updatePutVoucherType: UpdatePutVoucherType) =>
    await this.updatePutService(id, updatePutVoucherType);

  deleteVoucher = async (id: string | number, deleteVoucherType: DeleteBaseType) =>
    await this.deleteService(id, deleteVoucherType);
}
