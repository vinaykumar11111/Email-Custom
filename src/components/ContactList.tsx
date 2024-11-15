import React from 'react';
import { User, Mail as MailIcon } from 'lucide-react';

interface Contact {
  email: string;
  name: string;
  [key: string]: string;
}

interface ContactListProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
}

export default function ContactList({ contacts, onSelectContact }: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <MailIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts</h3>
        <p className="mt-1 text-sm text-gray-500">Import contacts to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {contacts.map((contact, index) => (
          <li key={index}>
            <button
              onClick={() => onSelectContact(contact)}
              className="w-full block hover:bg-gray-50"
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{contact.name || 'Unnamed Contact'}</div>
                    <div className="text-sm text-gray-500">{contact.email}</div>
                  </div>
                </div>
                {Object.entries(contact)
                  .filter(([key]) => !['name', 'email'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="mt-2 text-sm text-gray-500">
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}