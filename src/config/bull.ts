import Queue from 'bull';

export const sendMailQueue = new Queue('send-mail-queue', {
  limiter: {
    max: 1000,
    duration: 5000,
  },
});
