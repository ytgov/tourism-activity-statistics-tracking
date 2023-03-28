import moment from "moment";
import { RecurrenceRule, scheduleJob } from "node-schedule";
import { ReminderService } from "../services";

import { sqldb } from "../data";

export class Scheduler {
  readonly cronSchedule = "*/30 * * * *";

  constructor() {
    const schedule = new RecurrenceRule();
    schedule.minute;

    //let s = scheduleJob("*/5 12-18/1 * * *", this.runJob);
    scheduleJob(this.cronSchedule, this.runJob);
    console.log(`** Starting Scheduler to run at '${this.cronSchedule}'`);
  }

  async runJob() {
    let nowTime = roundTo(moment(), "minutes", 30, "down", false).format("HH:mm");
    let nowDate = moment().format("YYYY-MM-DD");
    console.log("RUNNING THE JOB", nowDate, nowTime);

    // check if job has already ran
    let hasHappened = await sqldb("scheduler_log")
      .where({ event_target_date: nowDate, event_target_time: nowTime })
      .count("id as counter")
      .first();

    if (hasHappened && hasHappened.counter > 0) {
      return;
    }

    let reminderService = new ReminderService();

    await sqldb("scheduler_log").insert({
      event_description: `Scheduler job starting`,
      event_target_time: nowTime,
      event_target_date: moment().format("YYYY-MM-DD"),
    });

    let centres = await sqldb("visitor_centre")
      .where({ is_active: true })
      .whereNotNull("reminders_at")
      .whereNotNull("reminders_when");

    for (let centre of centres) {
      let times = centre.reminders_at.split(",");

      if (times.indexOf(nowTime) >= 0) {
        if (centre.reminders_when == "If no data entered in day") {
          let dayData = await sqldb("visitor_count")
            .where({ day: nowDate, visitor_centre_id: centre.id })
            .count("id as counter")
            .first();

          if (dayData && dayData.counter > 0) {
            await sqldb("scheduler_log").insert({
              event_description: `${centre.name} has data for today. Not sending reminders.`,
              event_target_time: nowTime,
              event_target_date: moment().format("YYYY-MM-DD"),
            });
          } else {
            let reminderList = await reminderService.sendDataEntryReminders(centre);

            await sqldb("scheduler_log").insert({
              event_description: `${centre.name} has no data for today. Sent reminders to ${reminderList.length} people`,
              event_target_time: nowTime,
              event_target_date: moment().format("YYYY-MM-DD"),
            });

            for (let user of reminderList) {
              await sqldb("scheduler_log").insert({
                event_description: `Sent data entry reminder for ${centre.name} to ${user.email}`,
                event_target_time: nowTime,
                event_target_date: moment().format("YYYY-MM-DD"),
              });
            }
          }
        } else if (centre.reminders_when == "If no data entered in last 4 hours") {
          let fourHoursAgo = moment().add(-4, "hours").format("YYYY-MM-DD HH:mm:ss");

          let dayData = await sqldb("visitor_count")
            .where({ day: nowDate, visitor_centre_id: centre.id })
            .whereRaw(`[date] > '${fourHoursAgo}'`)
            .count("id as counter")
            .first();

          if (dayData && dayData.counter > 0) {
            await sqldb("scheduler_log").insert({
              event_description: `${centre.name} has data after ${fourHoursAgo}. Not sending reminders.`,
              event_target_time: nowTime,
              event_target_date: moment().format("YYYY-MM-DD"),
            });
          } else {
            let reminderList = await reminderService.sendDataEntryReminders(centre);

            await sqldb("scheduler_log").insert({
              event_description: `${centre.name} has no data after ${fourHoursAgo}. Sent reminders to ${reminderList.length} people`,
              event_target_time: nowTime,
              event_target_date: moment().format("YYYY-MM-DD"),
            });

            for (let user of reminderList) {
              await sqldb("scheduler_log").insert({
                event_description: `Sent data entry reminder for ${centre.name} to ${user.email}`,
                event_target_time: nowTime,
                event_target_date: moment().format("YYYY-MM-DD"),
              });
            }
          }
        } else if (centre.reminders_when == "If no data entered in last 1 hour") {
          let oneHoursAgo = moment().add(-1, "hours").format("YYYY-MM-DD HH:mm:ss");

          let dayData = await sqldb("visitor_count")
            .where({ day: nowDate, visitor_centre_id: centre.id })
            .whereRaw(`[date] > '${oneHoursAgo}'`)
            .count("id as counter")
            .first();

          if (dayData && dayData.counter > 0) {
            await sqldb("scheduler_log").insert({
              event_description: `${centre.name} has data after ${oneHoursAgo}. Not sending reminders.`,
              event_target_time: nowTime,
              event_target_date: moment().format("YYYY-MM-DD"),
            });
          } else {
            let reminderList = await reminderService.sendDataEntryReminders(centre);

            await sqldb("scheduler_log").insert({
              event_description: `${centre.name} has no data after ${oneHoursAgo}. Sent reminders to ${reminderList.length} people`,
              event_target_time: nowTime,
              event_target_date: moment().format("YYYY-MM-DD"),
            });

            for (let user of reminderList) {
              await sqldb("scheduler_log").insert({
                event_description: `Sent data entry reminder for ${centre.name} to ${user.email}`,
                event_target_time: nowTime,
                event_target_date: moment().format("YYYY-MM-DD"),
              });
            }
          }
        }
      }
    }

    await sqldb("scheduler_log").insert({
      event_description: `Scheduler job complete`,
      event_target_time: nowTime,
      event_target_date: moment().format("YYYY-MM-DD"),
    });
  }
}

function roundTo(m: any, unit: any, offset: number, midpoint: string, clone: boolean) {
  unit = moment.normalizeUnits(unit);

  if (unit.toLowerCase() == "day") unit = "date";

  offset = offset || 1;
  var value = m.get(unit);

  switch (midpoint) {
    case "up":
      value = Math.ceil(value / offset);
      break;
    case "down":
      value = Math.floor(value / offset);
      break;
    case "nearest":
    default:
      value = Math.round(value / offset);
      break;
  }
  var ret = clone ? m.clone() : m;
  ret = ret.set(unit, value * offset);

  switch (unit) {
    case "year":
      ret.month(0);
    /* falls through */
    case "month":
      ret.date(1);
    /* falls through */
    case "date":
      ret.hours(0);
    /* falls through */
    case "hour":
      ret.minutes(0);
    /* falls through */
    case "minute":
      ret.seconds(0);
    /* falls through */
    case "second":
      ret.milliseconds(0);
    /* falls through */
  }
  return ret;
}
