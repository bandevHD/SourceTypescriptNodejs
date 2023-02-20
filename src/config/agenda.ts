import Agenda, { Job, JobAttributesData } from 'agenda';
import VoucherService from '../apis/core_v1/voucher/services';
import dotenv from 'dotenv';
import { handlerEmail } from '../apis/modules/emailService';

dotenv.config();
const { MONGGODB_URI } = process.env;
const agenda = new Agenda({
  db: { address: MONGGODB_URI },
  processEvery: '30 seconds',
  maxConcurrency: 20,
});

agenda.define(`send email voucher`, async (job) => {
  const { to } = job.attrs.data;

  await handlerEmail(to, `Đây là email đăng ký`);
});
export const startSchedule = () => {
  agenda.start();
  agenda.schedule('in 1 minitues', 'send email voucher', {
    to: `trannhatban34@gmail.com`,
  });
};

export const jobQueueEventsAgenda = () => {
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

jobQueueEventsAgenda();

//Stop job
export const agendaStop = async () => {
  await agenda.stop();
  process.exit(0);
};

//Stop waiting joib complete
export const agendaDrain = async () => {
  await agenda.drain();
  process.exit(0);
};
// const voucherService: VoucherService = new VoucherService();

// agenda.define(`user register`, { priority: 20, concurrency: 10 }, async (job) => {
//   const { to } = job.attrs.data;
//   await handlerEmail(to, `Đây là email đăng ký`);
// });

// export const startjob = async () => {
//   await agenda.start();
//   await agenda.schedule('in 1 minutes', 'user register', {
//     to: `trannhatban34@gmail.com`,
//   });
// };

// startjob();
