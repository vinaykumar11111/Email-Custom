import { v4 as uuidv4 } from 'uuid';
import { createScheduledEmail, updateEmailStatus } from './supabase';
import { sendEmail } from './email/resend';

interface ScheduleEmailParams {
  recipient: string;
  subject: string;
  content: string;
  scheduledTime: Date;
}

export async function scheduleEmail({
  recipient,
  subject,
  content,
  scheduledTime
}: ScheduleEmailParams) {
  // Create a record in Supabase
  const email = await createScheduledEmail({
    recipient,
    subject,
    content,
    scheduled_time: scheduledTime.toISOString(),
    status: 'pending'
  });

  // Calculate delay until scheduled time
  const now = new Date();
  const delay = scheduledTime.getTime() - now.getTime();

  if (delay <= 0) {
    // Send immediately if scheduled time is in the past
    await sendScheduledEmail(email.id, recipient, subject, content);
  } else {
    // Schedule for future
    setTimeout(async () => {
      await sendScheduledEmail(email.id, recipient, subject, content);
    }, delay);
  }

  return email;
}

async function sendScheduledEmail(
  id: string,
  recipient: string,
  subject: string,
  content: string
) {
  try {
    await sendEmail(recipient, subject, content);
    await updateEmailStatus(id, 'sent');
  } catch (error) {
    console.error('Failed to send scheduled email:', error);
    await updateEmailStatus(id, 'failed');
  }
}