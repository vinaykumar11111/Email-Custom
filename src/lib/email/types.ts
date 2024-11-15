export interface EmailJob {
  id: string;
  recipient: string;
  subject: string;
  content: string;
  scheduledTime: Date;
  attempts: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  lastError?: string;
  lastAttempt?: Date;
}

export interface EmailStats {
  status: 'success' | 'failed';
  timestamp: string;
  recipient: string;
  error?: string;
}

export interface EmailQueue {
  add(job: Omit<EmailJob, 'id' | 'attempts' | 'status'>): Promise<EmailJob>;
  retry(jobId: string): Promise<void>;
  remove(jobId: string): Promise<void>;
  getAll(): EmailJob[];
  getPending(): EmailJob[];
  getFailed(): EmailJob[];
}