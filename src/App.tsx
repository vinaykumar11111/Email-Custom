import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import EmailForm from './components/EmailForm';
import GmailConnect from './components/GmailConnect';
import DataImport from './components/DataImport';
import ScheduledEmails from './components/ScheduledEmails';
import AnalyticsDashboard from './components/AnalyticsDashbooard';

interface Contact {
  email: string;
  name: string;
  [key: string]: string;
}

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const handleDataImported = (importedContacts: Contact[]) => {
    setContacts(importedContacts);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Mail className="w-6 h-6 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">AI Email Dashboard</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Analytics Dashboard */}
          <div className="mb-6">
            <AnalyticsDashboard />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="px-4 py-5 sm:p-6">
                  <EmailForm contacts={contacts} />
                </div>
              </div>
              <ScheduledEmails />
            </div>
            
            <div className="space-y-6">
              <GmailConnect />
              <DataImport onDataImported={handleDataImported} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;