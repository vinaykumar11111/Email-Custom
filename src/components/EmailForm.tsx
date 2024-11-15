import React, { useState } from 'react';
import { Send, Wand2 } from 'lucide-react';
import { generateEmailContent } from '../lib/ai';
import { sendEmail } from '../lib/email';
import toast from 'react-hot-toast';
import EmailStats from './EmailStats';
import ContactList from './ContactList';
import EmailScheduler from './EmailScheduler';

interface Contact {
  email: string;
  name: string;
  [key: string]: string;
}

interface EmailFormProps {
  contacts: Contact[];
}

export default function EmailForm({ contacts }: EmailFormProps) {
  const [recipient, setRecipient] = useState('');
  const [context, setContext] = useState('');
  const [prompt, setPrompt] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showContacts, setShowContacts] = useState(false);

  const handleSelectContact = (contact: Contact) => {
    setRecipient(contact.email);
    // Create personalization context from contact data
    const contextData = Object.entries(contact)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    setContext(contextData);
    setShowContacts(false);
  };

  const handleGenerate = async () => {
    if (!context || !prompt) {
      toast.error('Please provide both context and prompt');
      return;
    }

    setLoading(true);
    try {
      const generated = await generateEmailContent(prompt, context);
      setSubject(generated.subject);
      setContent(generated.body);
      toast.success('Email content generated!');
    } catch (error) {
      toast.error('Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!recipient || !subject || !content) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await sendEmail(recipient, subject, content);
      toast.success('Email sent successfully!');
      setRecipient('');
      setContext('');
      setPrompt('');
      setSubject('');
      setContent('');
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Content Generation</h2>
            <button
              onClick={() => setShowContacts(!showContacts)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showContacts ? 'Hide Contacts' : 'Show Contacts'}
            </button>
          </div>

          {showContacts ? (
            <ContactList contacts={contacts} onSelectContact={handleSelectContact} />
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Context</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Provide context for the email..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prompt</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Additional instructions for AI..."
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Content
              </button>
            </>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Email Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Recipient</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="recipient@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Email content..."
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleSend}
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Now
            </button>
            <EmailScheduler
              recipient={recipient}
              subject={subject}
              content={content}
              onScheduled={() => {
                setRecipient('');
                setSubject('');
                setContent('');
                toast.success('Email scheduled successfully!');
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Email Status</h2>
        <EmailStats />
      </div>
    </div>
  );
}