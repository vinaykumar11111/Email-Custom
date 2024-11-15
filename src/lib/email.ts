import emailjs from '@emailjs/browser';

const SERVICE_ID = 'ID';
const TEMPLATE_ID = 'template_ID';
const PUBLIC_KEY = 'API';

interface EmailStats {
  status: 'success' | 'failed';
  timestamp: string;
  recipient: string;
}

let emailStats: EmailStats[] = [];

export function getEmailStats() {
  return emailStats;
}

export async function sendEmail(to: string, subject: string, content: string) {
  const templateParams = {
    to_email: to,
    subject,
    message: content,
  };

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    
    emailStats.unshift({
      status: 'success',
      timestamp: new Date().toISOString(),
      recipient: to
    });
    
    if (emailStats.length > 10) emailStats.pop();
    return response;
  } catch (error) {
    emailStats.unshift({
      status: 'failed',
      timestamp: new Date().toISOString(),
      recipient: to
    });
    
    if (emailStats.length > 10) emailStats.pop();
    console.error('Email sending failed:', error);
    throw error;
  }
}