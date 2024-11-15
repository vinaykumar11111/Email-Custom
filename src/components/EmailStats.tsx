import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { getEmailStats } from '../lib/email';

export default function EmailStats() {
  const stats = getEmailStats();

  if (stats.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No emails sent yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
        >
          <div className="flex items-center space-x-3">
            {stat.status === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm font-medium text-gray-900">
              {stat.recipient}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(stat.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
}