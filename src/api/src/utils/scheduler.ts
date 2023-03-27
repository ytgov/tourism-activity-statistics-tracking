import { RecurrenceRule, scheduleJob } from "node-schedule";

export class Scheduler {
  readonly cronSchedule = "*/15 * * * *";

  constructor() {
    const schedule = new RecurrenceRule();
    schedule.minute;

    //let s = scheduleJob("*/5 12-18/1 * * *", this.runJob);
    scheduleJob(this.cronSchedule, this.runJob);
    console.log(`** Starting Scheduler to run at '${this.cronSchedule}'`);
  }

  runJob() {
    console.log("RUNNING THE JOB", new Date());
  }
}
