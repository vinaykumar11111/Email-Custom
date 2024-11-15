import React, { useEffect, useState } from 'react';
import { BarChart3, Clock, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { getEmailStats } from '../lib/email';
import { getScheduledEmails } from '../lib/supabase';
//import type { ScheduledEmail } from '../lib/supabase';

interface EmailMetrics {
  totalSent: number;
  pending: number;
  scheduled: number;
  failed: number;
  responseRate: number;
}

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<EmailMetrics>({
    totalSent: 0,
    pending: 0,
    scheduled: 0,
    failed: 0,
    responseRate: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const stats = getEmailStats();
        const scheduledEmails = await getScheduledEmails();

        const totalSent = stats.filter(s => s.status === 'success').length;
        const failed = stats.filter(s => s.status === 'failed').length;
        const pending = scheduledEmails.filter(e => e.status === 'pending').length;
        const scheduled = scheduledEmails.length;
        
        // Calculate response rate (example: based on successful vs total)
        const responseRate = totalSent > 0 
          ? ((totalSent - failed) / totalSent) * 100 
          : 0;

        setMetrics({
          totalSent,
          pending,
          scheduled,
          failed,
          responseRate,
        });
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color 
  }: { 
    title: string; 
    value: number; 
    icon: React.ElementType; 
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {title === 'Response Rate' ? `${value.toFixed(1)}%` : value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="mb-6 flex items-center">
        <BarChart3 className="w-6 h-6 text-gray-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Email Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <MetricCard
          title="Total Sent"
          value={metrics.totalSent}
          icon={Mail}
          color="bg-blue-500"
        />
        <MetricCard
          title="Pending"
          value={metrics.pending}
          icon={Clock}
          color="bg-yellow-500"
        />
        <MetricCard
          title="Scheduled"
          value={metrics.scheduled}
          icon={Clock}
          color="bg-purple-500"
        />
        <MetricCard
          title="Failed"
          value={metrics.failed}
          icon={AlertCircle}
          color="bg-red-500"
        />
        <MetricCard
          title="Response Rate"
          value={metrics.responseRate}
          icon={CheckCircle}
          color="bg-green-500"
        />
      </div>
    </div>
  );
}

