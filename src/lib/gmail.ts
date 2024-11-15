import { format } from 'date-fns';

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/spreadsheets.readonly'
];

const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
  'https://sheets.googleapis.com/$discovery/rest?version=v4'
];

interface ScheduledEmail {
  recipient: string;
  subject: string;
  content: string;
  scheduledTime: Date;
}

let scheduledEmails: ScheduledEmail[] = [];
let isInitialized = false;

export async function initializeGoogleAPI() {
  if (isInitialized) return;

  await new Promise<void>((resolve, reject) => {
    gapi.load('client:auth2', async () => {
      try {
        await gapi.client.init({
          apiKey: 'Api_key',
          clientId: 'ID',
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES.join(' ')
        });
        isInitialized = true;
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

export async function scheduleEmail(recipient: string, subject: string, content: string, scheduledTime: Date): Promise<void> {
  scheduledEmails.push({ recipient, subject, content, scheduledTime });
  
  // Schedule the email
  const delay = scheduledTime.getTime() - Date.now();
  if (delay > 0) {
    setTimeout(async () => {
      try {
        await sendScheduledEmail({ recipient, subject, content, scheduledTime });
      } catch (error) {
        console.error('Failed to send scheduled email:', error);
      }
    }, delay);
  }
}

async function sendScheduledEmail(email: ScheduledEmail): Promise<void> {
  const auth = gapi.auth2.getAuthInstance();
  if (!auth.isSignedIn.get()) {
    throw new Error('User not signed in');
  }

  const message = {
    to: email.recipient,
    subject: email.subject,
    text: email.content,
  };

  try {
    await gapi.client.gmail.users.messages.send({
      userId: 'me',
      resource: {
        raw: btoa(
          `To: ${message.to}\r\n` +
          `Subject: ${message.subject}\r\n` +
          `Content-Type: text/plain; charset=utf-8\r\n\r\n` +
          `${message.text}`
        ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      }
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export function getScheduledEmails(): ScheduledEmail[] {
  return scheduledEmails.filter(email => email.scheduledTime.getTime() > Date.now());
}

export function cancelScheduledEmail(index: number): void {
  if (index >= 0 && index < scheduledEmails.length) {
    scheduledEmails.splice(index, 1);
  }
}