import { authStore } from '../auth/store';

export async function sendGmailEmail(recipient: string, subject: string, content: string): Promise<void> {
  const authState = authStore.getState();
  if (!authState.isAuthenticated) {
    throw new Error('User not signed in to Gmail');
  }

  try {
    const encodedMessage = btoa(
      `To: ${recipient}\r\n` +
      `Subject: ${subject}\r\n` +
      `Content-Type: text/plain; charset=utf-8\r\n\r\n` +
      `${content}`
    ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    await gapi.client.gmail.users.messages.send({
      userId: 'me',
      resource: { raw: encodedMessage }
    });
  } catch (error) {
    console.error('Gmail send failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}