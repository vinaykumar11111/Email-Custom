import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface ScheduledEmail {
  id: string;
  recipient: string;
  subject: string;
  content: string;
  scheduled_time: string;
  status: 'pending' | 'sent' | 'failed';
  created_at: string;
}

export async function createScheduledEmail(email: Omit<ScheduledEmail, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('scheduled_emails')
    .insert([email])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getScheduledEmails() {
  const { data, error } = await supabase
    .from('scheduled_emails')
    .select('*')
    .order('scheduled_time', { ascending: true });

  if (error) throw error;
  return data as ScheduledEmail[];
}

export async function updateEmailStatus(id: string, status: ScheduledEmail['status']) {
  const { error } = await supabase
    .from('scheduled_emails')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}