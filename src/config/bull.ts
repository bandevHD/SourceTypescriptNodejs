import Queue from 'bull';

export const sendMailQueue: Queue.Queue<any> = new Queue('send-mail-queue', {
  limiter: {
    max: 1000,
    duration: 5000,
  },
});

export async function gracefulBull() {
  await sendMailQueue.close();
  process.exit(0);
}

export const processBull = async (queue) => {
  queue.on('waiting', (job) => {
    console.log(`Job waiting with jod id ${job.id}`);
  });

  queue.on('active', (job) => {
    console.log(`Job active with jod id ${job.id}`);
  });

  queue.on('completed', (job, result) => {
    console.log(`Job completed with jod id ${job.id} result ${result}`);
  });

  queue.on('failed', (job, error) => {
    console.log(`Job faild with jod id ${job.id} and ${error}`);
  });
};
