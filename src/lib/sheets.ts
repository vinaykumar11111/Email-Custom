interface ContactData {
  email: string;
  name: string;
  customFields: Record<string, string>;
}

export async function readGoogleSheet(spreadsheetId: string, range: string): Promise<ContactData[]> {
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = response.result.values;
  if (!rows || rows.length === 0) {
    return [];
  }

  const headers = rows[0];
  return rows.slice(1).map(row => {
    const contact: ContactData = {
      email: '',
      name: '',
      customFields: {}
    };

    headers.forEach((header: string, index: number) => {
      const value = row[index] || '';
      if (header.toLowerCase() === 'email') {
        contact.email = value;
      } else if (header.toLowerCase() === 'name') {
        contact.name = value;
      } else {
        contact.customFields[header] = value;
      }
    });

    return contact;
  });
}