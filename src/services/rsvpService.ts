// RSVP Submission Service for Google Sheets using Google Sheets API with proper auth
declare global {
  interface Window {
    google: any;
  }
}

export interface RSVPResponse {
  guestId: string;
  guestName: string;
  attendeeNames: string[]; // Array of attendee names (one for each seat)
  timestamp?: string;
}

class RSVPService {
  private spreadsheetId: string;
  private apiKey: string;
  private clientId: string;
  private accessToken: string = '';

  constructor(spreadsheetId: string, clientId: string, apiKey: string) {
    this.spreadsheetId = spreadsheetId;
    this.clientId = clientId;
    this.apiKey = apiKey;
  }

  async initialize(): Promise<void> {
    // Try to get token from session storage first
    const savedToken = sessionStorage.getItem('gapi_access_token');
    if (savedToken) {
      this.accessToken = savedToken;
      return;
    }

    // Request new token
    return new Promise((resolve, reject) => {
      // Check if Google library already exists
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        this.requestNewToken(resolve, reject);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        try {
          if (!window.google) {
            throw new Error('Google Sign-In library not loaded');
          }
          this.requestNewToken(resolve, reject);
        } catch (error) {
          console.error('Google Sign-In initialization error:', error);
          reject(error);
        }
      };

      script.onerror = () => {
        reject(new Error('Failed to load Google Sign-In library'));
      };

      document.head.appendChild(script);
    });
  }

  private requestNewToken(resolve: any, reject: any): void {
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        callback: (response: any) => {
          if (response.access_token) {
            this.accessToken = response.access_token;
            sessionStorage.setItem('gapi_access_token', response.access_token);
            resolve();
          } else if (response.error) {
            reject(new Error(`OAuth error: ${response.error}`));
          }
        }
      });

      // Request access token with prompt to force user to choose account
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (error) {
      console.error('Token request error:', error);
      reject(error);
    }
  }

  async submitRSVPResponse(sheetName: string, response: RSVPResponse): Promise<boolean> {
    try {
      if (!this.accessToken) {
        await this.initialize();
      }

      if (!this.accessToken) {
        throw new Error('Unable to obtain access token');
      }

      const timestamp = new Date().toLocaleString();
      const attendeeNamesStr = response.attendeeNames.join(' | ');

      const rowData = [
        response.guestId,
        response.guestName,
        attendeeNamesStr,
        timestamp
      ];

      // Append to sheet using Google Sheets API
      const result = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/'${sheetName}'!A:D:append?valueInputOption=USER_ENTERED&key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: [rowData]
          })
        }
      );

      const data = await result.json();

      if (!result.ok) {
        console.error('API Error:', data);
        throw new Error(`HTTP error! status: ${result.status}, message: ${data.error?.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error submitting RSVP response:', error);
      throw error;
    }
  }

  async checkExistingResponse(sheetName: string, guestId: string): Promise<RSVPResponse | null> {
    try {
      if (!this.accessToken) {
        await this.initialize();
      }

      const result = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/'${sheetName}'!A:D?key=${this.apiKey}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      const data = await result.json();

      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }

      const values = data.values;

      if (!values || values.length === 0) {
        return null;
      }

      // Find the row with matching guest ID (skip header at index 0)
      for (let i = 1; i < values.length; i++) {
        if (values[i][0] === guestId) {
          return {
            guestId: values[i][0],
            guestName: values[i][1],
            attendeeNames: values[i][2]?.split(' | ') || []
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error checking existing response:', error);
      return null;
    }
  }

  async updateRSVPResponse(sheetName: string, response: RSVPResponse, rowIndex: number): Promise<boolean> {
    try {
      if (!this.accessToken) {
        await this.initialize();
      }

      const timestamp = new Date().toLocaleString();
      const attendeeNamesStr = response.attendeeNames.join(' | ');

      const rowData = [
        response.guestId,
        response.guestName,
        attendeeNamesStr,
        timestamp
      ];

      // Update the specific row
      const range = `'${sheetName}'!A${rowIndex + 1}:D${rowIndex + 1}`;

      const result = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED&key=${this.apiKey}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: [rowData]
          })
        }
      );

      const data = await result.json();

      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error updating RSVP response:', error);
      throw error;
    }
  }

  clearToken(): void {
    this.accessToken = '';
    sessionStorage.removeItem('gapi_access_token');
  }
}

export default RSVPService;
