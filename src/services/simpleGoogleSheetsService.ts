// Simple Google Sheets API service for public sheets
export interface GuestReservation {
  name: string;
  seats: number;
  kidsSeats: number;
  guestId: string;
}

class SimpleGoogleSheetsService {
  private spreadsheetId: string;
  private apiKey: string;

  constructor(spreadsheetId: string, apiKey: string) {
    this.spreadsheetId = spreadsheetId;
    this.apiKey = apiKey;
  }

  async getSheetNames(): Promise<string[]> {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}?key=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const sheetNames = data.sheets.map((sheet: any) => sheet.properties.title);
      console.log('Available sheets:', sheetNames);
      return sheetNames;
    } catch (error) {
      console.error('Error fetching sheet names:', error);
      return [];
    }
  }

  async getGuestData(): Promise<GuestReservation[]> {
    try {
      // First, check what sheets are available
      const sheetNames = await this.getSheetNames();
      
      // Try to find a sheet with "Guest" in the name (case-insensitive)
      let sheetName = 'Guests'; // default
      const guestSheet = sheetNames.find(name => name.toLowerCase().includes('guest'));
      if (guestSheet) {
        sheetName = guestSheet;
      }
      
      console.log('Using sheet:', sheetName);
      
      // For public sheets, we can use the Google Sheets API without OAuth
      const range = encodeURIComponent(`'${sheetName}'!A:D`); // Columns A-D: Name, Seats, Kids Seat, Guest ID
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${range}?key=${this.apiKey}`;
      
      console.log('Fetching guest data from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Google Sheets API error response:', response.status, errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.values || data.values.length === 0) {
        console.warn('No data found in sheet:', sheetName);
        return [];
      }
      
      // Skip header row and convert to GuestReservation objects
      const guests: GuestReservation[] = data.values.slice(1)
        .filter((row: any[]) => row[0]) // Filter out empty rows
        .map((row: any[]) => ({
          name: row[0] || '',
          seats: parseInt(row[1]) || 0,
          kidsSeats: parseInt(row[2]) || 0,
          guestId: row[3] || ''
        }));
      
      console.log('Successfully loaded guests:', guests.length);
      return guests;
    } catch (error) {
      console.error('Error fetching guest data:', error);
      throw error;
    }
  }

  async findGuestByName(name: string): Promise<GuestReservation | null> {
    try {
      const guests = await this.getGuestData();
      const foundGuest = guests.find(guest => 
        guest.name.toLowerCase().includes(name.toLowerCase())
      );
      return foundGuest || null;
    } catch (error) {
      console.error('Error searching for guest:', error);
      throw error;
    }
  }

  async findGuestById(guestId: string): Promise<GuestReservation | null> {
    try {
      const guests = await this.getGuestData();
      const foundGuest = guests.find(guest => 
        guest.guestId === guestId
      );
      return foundGuest || null;
    } catch (error) {
      console.error('Error searching for guest by ID:', error);
      throw error;
    }
  }
}

export default SimpleGoogleSheetsService;
