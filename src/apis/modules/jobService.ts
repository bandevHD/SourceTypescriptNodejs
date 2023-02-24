import Agenda, { Job, JobAttributesData } from 'agenda';
import VoucherMongo from '../../model/mongodb/Voucher';
import { agenda } from '../../config/agenda';
import dotenv from 'dotenv';
import moment from 'moment';
import { handlerEmail } from './emailService';

dotenv.config();

export default class JobAgenda {
  jobDefine = function (
    this: Agenda,
    // name: string,
    // // options: DefineOptions | Processor<JobAttributes>,
    // processor?: Processor<JobAttributes>,
  ): void {
    agenda.define('send email sale', async (job) => {
      const { to } = job.attrs.data;
      const nowMoment: string = moment().format('YYYY-MM-DD HH:mm');
      const voucherAll = await VoucherMongo.find({ startTimeAt: { $eq: nowMoment } });
      let count = 0;
      while (count < voucherAll.length) {
        await handlerEmail(to, `Đây là email đăng ký`);
        count += 1;
      }
    });
  };

  createScheduleJob = async (
    contact: JobAttributesData,
    name: string,
    when: string | Date,
    data: JobAttributesData,
  ) => {
    await agenda.start();
    agenda.schedule<typeof contact>(when, `${name}`, data);
  };
  scheduleJob = async (
    contact: Job<JobAttributesData>,
    time: string | Date,
  ): Promise<Job<JobAttributesData>> => {
    return contact.schedule(time);
  };
  start = async () => await agenda.start();
  nowScheduleJob = async (
    contact: JobAttributesData,
    name: string,
    data: JobAttributesData,
  ): Promise<Job<JobAttributesData>> => {
    return agenda.now<typeof contact>(`${name}`, data);
  };
  createJob = async (
    contact: JobAttributesData,
    name: string,
    data: JobAttributesData,
  ): Promise<Job<JobAttributesData>> => {
    return agenda.create<typeof contact>(`${name}`, data);
  };

  jobQueueEventsAgenda = (name: string) => {
    agenda.on('start', (job) => {
      console.log('Job %s starting', job.attrs.name);
    });
    agenda.on('complete', (job) => {
      console.log(`Job ${job.attrs.name} finished`);
    });

    agenda.on(`success:${name}`, (job) => {
      console.log(`Sent Email Successfully to ${job.attrs.data.to}`);
    });

    agenda.on(`fail:${name}`, (err, job) => {
      console.log(`Job failed with error: ${err.message}`);
    });
  };
}
