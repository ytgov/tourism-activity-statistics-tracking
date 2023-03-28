import { User, VisitorCentre } from "../data/models";
import { sqldb } from "../data";
import { EmailService } from "./email-service";

const emailService = new EmailService();

export class ReminderService {
  async sendDataEntryReminders(centre: VisitorCentre): Promise<User[]> {
    console.log("SEINDING ERMAIL REMINDERS For ", centre.name);

    let emails = await sqldb("permissions")
      .where({ name: `VIC.INPUT_${centre.id}` })
      .select("email");

    let users = await sqldb<User>("users")
      .where({ status: "Active" })
      .whereIn(
        "email",
        emails.map((e) => e.email)
      );

    await emailService.sendReminderEmail(users, centre);

    return users;
  }
}
