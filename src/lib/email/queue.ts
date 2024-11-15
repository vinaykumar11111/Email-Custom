import { v4 as uuidv4 } from 'uuid';
import { EmailJob, EmailQueue } from './types';

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000 * 60, 1000 * 60 * 5, 1000 * 60 * 15]; // 1min, 5min, 15min

class MemoryEmailQueue implements EmailQueue {
  private jobs: Map<string, EmailJob> = new Map();
  private adminEmail: string = 'admin@example.com'; // Configure as needed

  async add(jobData: Omit<EmailJob, 'id' | 'attempts' | 'status'>): Promise<EmailJob> {
    const job: EmailJob = {
      id: uuidv4(),
      ...jobData,
      attempts: 0,
      status: 'pending'
    };

    this.jobs.set(job.id, job);
    this.scheduleJob(job);
    return job;
  }

  async retry(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'failed') return;

    job.status = 'pending';
    job.lastError = undefined;
    this.scheduleJob(job);
  }

  async remove(jobId: string): Promise<void> {
    this.jobs.delete(jobId);
  }

  getAll(): EmailJob[] {
    return Array.from(this.jobs.values());
  }

  getPending(): EmailJob[] {
    return this.getAll().filter(job => job.status === 'pending');
  }

  getFailed(): EmailJob[] {
    return this.getAll().filter(job => job.status === 'failed');
  }

  private scheduleJob(job: EmailJob): void {
    const now = new Date();
    const delay = job.scheduledTime.getTime() - now.getTime();

    if (delay <= 0) {
      this.processJob(job);
    } else {
      setTimeout(() => this.processJob(job), delay);
    }
  }

  private async processJob(job: EmailJob): Promise<void> {
    if (job.status !== 'pending') return;

    job.status = 'processing';
    job.attempts++;
    job.lastAttempt = new Date();

    try {
      await this.sendEmail(job);
      job.status = 'completed';
    } catch (error) {
      console.error(`Email job ${job.id} failed:`, error);
      
      if (job.attempts < MAX_RETRIES) {
        job.status = 'pending';
        job.lastError = error.message;
        
        // Schedule retry with exponential backoff
        const retryDelay = RETRY_DELAYS[job.attempts - 1] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
        setTimeout(() => this.processJob(job), retryDelay);
        
        // Notify admin of retry
        this.notifyAdmin(job, error);
      } else {
        job.status = 'failed';
        job.lastError = error.message;
        // Notify admin of final failure
        this.notifyAdmin(job, error, true);
      }
    }
  }

  private async sendEmail(job: EmailJob): Promise<void> {
    // Implementation will be in gmail.ts
    const result = await window.emailService.send(job);
    return result;
  }

  private async notifyAdmin(job: EmailJob, error: Error, isFinal: boolean = false): Promise<void> {
    const subject = `Email Job ${isFinal ? 'Failed' : 'Retry'}: ${job.id}`;
    const content = `
      Email Job Details:
      - ID: ${job.id}
      - Recipient: ${job.recipient}
      - Subject: ${job.subject}
      - Attempts: ${job.attempts}/${MAX_RETRIES}
      - Error: ${error.message}
      ${isFinal ? '\nThis was the final attempt.' : `\nWill retry in ${RETRY_DELAYS[job.attempts - 1] / 1000} seconds.`}
    `;

    try {
      await window.emailService.send({
        recipient: this.adminEmail,
        subject,
        content,
        scheduledTime: new Date()
      });
    } catch (adminNotifyError) {
      console.error('Failed to notify admin:', adminNotifyError);
    }
  }
}

export const emailQueue = new MemoryEmailQueue();