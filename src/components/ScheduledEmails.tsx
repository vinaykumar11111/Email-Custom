import React from 'react';
import { Clock, Mail, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { getScheduledEmails } from '../lib/gmail';

export default function ScheduledEmails() {
  const scheduledEmails = getScheduledEmails();

  if (scheduledEmails.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Scheduled Emails</h2>
      <div className="space-y-2">
        {scheduledEmails.map((email, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{email.recipient}</p>
                <p className="text-sm text-gray-500">{email.subject}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {format(email.scheduledTime, 'MMM d, yyyy h:mm a')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}