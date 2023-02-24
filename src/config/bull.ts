import Queue from 'bull';

export const sendMailQueue = new Queue('send-mail-queue', {
  limiter: {
    max: 1000,
    duration: 5000,
  },
});

export const processBull = async (queue) => {
  queue.on('waiting', (job, result) => {
    console.log(`Job waiting with jod id ${job.id} result ${result}`);
  });

  queue.on('active', (job, result) => {
    console.log(`Job active with jod id ${job.id} result ${result}`);
  });

  queue.on('completed', (job, result) => {
    console.log(`Job completed with jod id ${job.id} result ${result}`);
  });
};
