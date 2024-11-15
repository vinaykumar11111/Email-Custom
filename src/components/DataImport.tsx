import React, { useCallback } from 'react';
import { FileSpreadsheet, Upload } from 'lucide-react';
import Papa from 'papaparse';
import { readGoogleSheet } from '../lib/sheets';

interface Contact {
  email: string;
  name: string;
  [key: string]: string;
}

interface DataImportProps {
  onDataImported: (contacts: Contact[]) => void;
}

export default function DataImport({ onDataImported }: DataImportProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        onDataImported(results.data as Contact[]);
        setIsLoading(false);
      },
      error: (error) => {
        console.error('CSV parsing failed:', error);
        setIsLoading(false);
      }
    });
  }, [onDataImported]);

  const handleSheetImport = useCallback(async () => {
    setIsLoading(true);
    try {
      const spreadsheetId = prompt('Enter Google Sheet ID:');
      if (!spreadsheetId) return;

      const contacts = await readGoogleSheet(spreadsheetId, 'A1:Z1000');
      onDataImported(contacts);
    } catch (error) {
      console.error('Sheet import failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onDataImported]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Import Contacts</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload CSV
          </label>
          <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
            <div className="flex flex-col items-center space-y-2">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-500">
                Click to upload CSV file
              </span>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isLoading}
            />
          </label>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <button
          onClick={handleSheetImport}
          disabled={isLoading}
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Import from Google Sheet
        </button>
      </div>
    </div>
  );
}