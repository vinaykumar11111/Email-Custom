import { TriggerClient } from '@trigger.dev/sdk';

export const client = new TriggerClient({
  id: 'ai-email-dashboard',
  apiKey: 'tr_dev_9lWEiEfvXgas9Ku3GQG1',
});

export async function scheduleEmail(
  recipient: string,
  subject: string,
  content: string,
  scheduledTime: Date
) {
  return await client.sendEvent({
    name: 'email.schedule',
    payload: {
      recipient,
      subject,
      content,
      scheduledTime: scheduledTime.toISOString(),
    },
  });
}