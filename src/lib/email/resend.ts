import { Resend } from 'resend';

const resend = new Resend('APi_key');

export async function sendEmail(to: string, subject: string, content: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      text: content,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}