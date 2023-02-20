// import { DefineOptions, Job, JobAttributes, JobAttributesData, Processor } from 'agenda';
// import AgendaClass from '../../config/agenda';

// export default class JobAgenda extends AgendaClass {
//   constructor() {
//     super();
//   }
//   // agenda.now<CreateContact>('CREATE CONTACT', {
//   //   contactDetails: {...} // required attr
//   // })

//   jobDefine = async (
//     contact: JobAttributesData,
//     name: string,
//     callback: () => void,
//     options?: DefineOptions | Processor<JobAttributes>,
//   ) => {
//     this.agenda.define<typeof contact>(`${name}`, options, callback);
//   };

//   createScheduleJob = async (
//     contact: JobAttributesData,
//     name: string,
//     when: string | Date,
//     data: JobAttributesData,
//   ) => {
//     await this.agenda.start();
//     this.agenda.schedule<typeof contact>(when, `${name}`, data);
//   };
// }
