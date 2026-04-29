export interface ElectionDeadlines {
  election_date: string;
  voter_reg_deadline: string;
  mail_in_request_deadline: string;
  mail_in_return_deadline: string;
}

export interface Reminder {
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  daysRemaining: number;
  actionUrl: string;
}

export class DeadlineEngine {
  /**
   * Generates real-time reminders based on proximity to deadlines.
   */
  static generateReminders(deadlines: ElectionDeadlines, currentDate: Date = new Date()): Reminder[] {
    const reminders: Reminder[] = [];
    
    this.checkDeadline(reminders, deadlines.voter_reg_deadline, currentDate, 'Voter Registration', '/dashboard/register');
    this.checkDeadline(reminders, deadlines.mail_in_request_deadline, currentDate, 'Mail-in Ballot Request', '/dashboard/mail-in');
    this.checkDeadline(reminders, deadlines.election_date, currentDate, 'Election Day', '/dashboard/booth');

    // Sort by urgency (least days first)
    return reminders.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }

  private static checkDeadline(reminders: Reminder[], targetDateStr: string, currentDate: Date, eventName: string, actionUrl: string) {
    const targetDate = new Date(targetDateStr);
    const diffTime = targetDate.getTime() - currentDate.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (days < 0) return; // Deadline passed

    if (days <= 3) {
      reminders.push({ type: 'CRITICAL', message: `${eventName} closes in ${days} days!`, daysRemaining: days, actionUrl });
    } else if (days <= 14) {
      reminders.push({ type: 'WARNING', message: `${eventName} is approaching.`, daysRemaining: days, actionUrl });
    } else if (days <= 30) {
      reminders.push({ type: 'INFO', message: `Upcoming: ${eventName}`, daysRemaining: days, actionUrl });
    }
  }
}
