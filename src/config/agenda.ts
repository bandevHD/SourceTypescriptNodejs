import Agenda from 'agenda';

export const agenda = new Agenda({
  db: { address: process.env.MONGGODB_URI },
  processEvery: '30 seconds',
});

// export async function graceful() {
//   await agenda.drain();
//   process.exit(0);
// }

export async function graceful() {
  await agenda.stop();
  process.exit(0);
}
