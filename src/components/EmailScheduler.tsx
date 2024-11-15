import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { scheduleEmail } from '../lib/gmail';

interface EmailSchedulerProps {
  recipient: string;
  subject: string;
  content: string;
  onScheduled: () => void;
}

export default function EmailScheduler({ recipient, subject, content, onScheduled }: EmailSchedulerProps) {
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const handleSchedule = async () => {
    if (!recipient || !subject || !content || !scheduledDate || !scheduledTime) {
      alert('Please fill in all fields');
      return;
    }

    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    if (scheduledDateTime <= new Date()) {
      alert('Please select a future date and time');
      return;
    }

    try {
      await scheduleEmail(recipient, subject, content, scheduledDateTime);
      setShowScheduler(false);
      setScheduledDate('');
      setScheduledTime('');
      onScheduled();
    } catch (error) {
      console.error('Failed to schedule email:', error);
      alert('Failed to schedule email. Please try again.');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowScheduler(!showScheduler)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Calendar className="w-4 h-4 mr-2" />
        Schedule
      </button>

      {showScheduler && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowScheduler(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}