import React from 'react';
import { Mail } from 'lucide-react';
import { initializeGoogleAPI } from '../lib/gmail';

export default function GmailConnect() {
  const [isConnected, setIsConnected] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await initializeGoogleAPI();
      const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
      
      if (!isSignedIn) {
        await gapi.auth2.getAuthInstance().signIn();
      }
      
      setIsConnected(true);
    } catch (error) {
      console.error('Gmail connection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    gapi.auth2.getAuthInstance().signOut();
    setIsConnected(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Mail className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-gray-900">Gmail Connection</span>
        </div>
        
        {isConnected ? (
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
          >
            {isLoading ? 'Connecting...' : 'Connect Gmail'}
          </button>
        )}
      </div>
      
      {isConnected && (
        <p className="mt-2 text-sm text-green-600">
          ✓ Connected to Gmail
        </p>
      )}
    </div>
  );
}