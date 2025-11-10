// Google Sheets API configuration
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY === 'your_google_api_key_here' ? undefined : process.env.REACT_APP_GOOGLE_API_KEY;
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

// Declare gapi as global
declare global {
  interface Window {
    gapi: any;
  }
}

export interface GuestReservation {
  name: string;
  seats: number;
  kidsSeats: number;
  guestId: string;
}

class GoogleSheetsService {
  private isInitialized = false;
  private isSignedIn = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      return new Promise((resolve, reject) => {
        if (!window.gapi) {
          reject(new Error('Google API not loaded. Please ensure the Google API script is loaded first.'));
          return;
        }

        window.gapi.load('client:auth2', async () => {
          try {
            const initConfig: any = {
              clientId: CLIENT_ID,
              discoveryDocs: [DISCOVERY_DOC],
              scope: SCOPES
            };

            // Only add API key if it's available and valid
            if (API_KEY) {
              initConfig.apiKey = API_KEY;
            }

            await window.gapi.client.init(initConfig);
            this.isInitialized = true;
            
            // Check if user is already signed in
            const authInstance = window.gapi.auth2.getAuthInstance();
            this.isSignedIn = authInstance.isSignedIn.get();
            
            resolve();
          } catch (error) {
            console.error('GAPI client init error:', error);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Error initializing Google Sheets API:', error);
      throw error;
    }
  }

  async signIn(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const authInstance = window.gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
      await authInstance.signIn();
      this.isSignedIn = true;
    }
  }

  async signOut(): Promise<void> {
    if (this.isInitialized) {
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      this.isSignedIn = false;
    }
  }

  getSignInStatus(): boolean {
    return this.isSignedIn;
  }

  async getGuestReservations(
    spreadsheetId: string, 
    range: string = 'Guests!A:D'
  ): Promise<GuestReservation[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // If no API key is available, we must authenticate
      if (!API_KEY && !this.isSignedIn) {
        console.log('No API key available, authentication required...');
        await this.signIn();
      }

      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const values = response.result.values;
      if (!values || values.length === 0) {
        return [];
      }

      // Assuming first row is headers: Name, Seats, Kids Seat, Guest ID
      const [headers, ...rows] = values;
      
      return rows.map((row: any[]): GuestReservation => ({
        name: row[0] || '',
        seats: parseInt(row[1]) || 0,
        kidsSeats: parseInt(row[2]) || 0,
        guestId: row[3] || '',
      }));
    } catch (error: any) {
      console.error('Error fetching guest reservations:', error);
      
      // If access denied and we haven't tried auth yet, suggest authentication
      if ((error.status === 403 || error.status === 401) && !this.isSignedIn) {
        throw new Error('Authentication required to access this Google Sheet');
      }
      
      throw error;
    }
  }

  async findGuestByName(
    spreadsheetId: string, 
    searchTerm: string,
    range: string = 'Guests!A:D'
  ): Promise<GuestReservation | null> {
    try {
      const reservations = await this.getGuestReservations(spreadsheetId, range);
      return reservations.find(guest => 
        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.guestId.toLowerCase().includes(searchTerm.toLowerCase())
      ) || null;
    } catch (error) {
      console.error('Error finding guest:', error);
      return null;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
