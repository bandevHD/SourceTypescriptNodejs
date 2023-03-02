import Agenda from 'agenda';

export const agenda = new Agenda({
  db: { address: process.env.MONGODB_ATLAS },
  processEvery: '30 seconds',
});

export const processAgenda = (agenda, name: string) => {
  agenda.on('start', (job) => {
    console.log('Job %s starting', job.attrs.name);
  });

  agenda.on('complete', (job) => {
    console.log(`Job ${job.attrs.name} finished`);
  });

  agenda.on(`success:${name}`, (job) => {
    console.log(`Sent Email Successfully to ${job.attrs.data.to}`);
  });

  agenda.on(`fail:${name}`, (err) => {
    console.log(`Job failed with error: ${err.message}`);
  });
};

// export async function graceful() {
//   await agenda.drain();
//   process.exit(0);
// }

export async function graceful() {
  await agenda.stop();
  process.exit(0);
}
