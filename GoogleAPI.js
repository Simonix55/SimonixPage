const googleClient = new GoogleApiClient({
  apiKey: 'AIzaSyD_YAAgFqgtc4_zEh5PzyJsD7ZrdZyD2YM'
});

// Beispiel: Daten aus einem Google Sheet abfragen
async function fetchSheetData(spreadsheetId, range) {
  try {
    const data = await googleClient.get(`/v4/spreadsheets/${spreadsheetId}/values/${range}`);
    console.log('Sheet Daten:', data.values);
  } catch (err) {
    console.error('Fehler beim Abrufen des Sheets:', err);
  }
}