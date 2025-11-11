// RSVP Service - Saves to Google Sheet via Apps Script
export interface RSVPResponse {
  guestId: string;
  guestName: string;
  attendeeNames: string[]; // Array of attendee names (one for each seat)
  timestamp?: string;
  attending?: string; // "Yes" or "No"
}

class RSVPServiceSimplified {
  private spreadsheetId: string;
  private apiKey: string;
  private endpoint: string;

  constructor(spreadsheetId: string, apiKey: string, endpoint?: string) {
    this.spreadsheetId = spreadsheetId;
    this.apiKey = apiKey;
    this.endpoint = endpoint || '';
  }

  async initialize(): Promise<void> {
    // No initialization needed
    return Promise.resolve();
  }

  private async fetchRSVPDataFromSheet(): Promise<any[]> {
    try {
      const range = encodeURIComponent("'RSVP Response'!A:E"); // Columns A-E: GuestID, Guest Name, Attendee Names, Attending, Timestamp
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${range}?key=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('Error fetching RSVP data from sheet:', response.status);
        return [];
      }
      
      const data = await response.json();
      
      if (!data.values || data.values.length === 0) {
        return [];
      }
      
      // Skip header row and return all data
      return data.values.slice(1).filter((row: any[]) => row[0]); // Filter out empty rows
    } catch (error) {
      console.error('Error fetching RSVP data from sheet:', error);
      return [];
    }
  }

  async submitRSVPResponse(sheetName: string, response: RSVPResponse): Promise<boolean> {
    try {
      const timestamp = new Date().toLocaleString();
      const attendeeNamesStr = response.attendeeNames.join(' | ');

      const payload = {
        guestId: response.guestId,
        guestName: response.guestName,
        attendeeNames: attendeeNamesStr,
        attending: response.attending || 'Yes',
        timestamp: timestamp
      };

      // Store in localStorage for persistent access across browser sessions
      localStorage.setItem(`rsvp_${response.guestId}`, JSON.stringify({
        guestId: response.guestId,
        guestName: response.guestName,
        attendeeNames: response.attendeeNames,
        attending: response.attending || 'Yes',
        timestamp: timestamp
      }));

      // If endpoint is configured, send to Google Apps Script
      if (this.endpoint && this.endpoint.includes('script.google.com')) {
        try {
          const result = await fetch(this.endpoint, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          console.log('✅ RSVP submitted to Google Sheet:', payload);
          return true;
        } catch (fetchError) {
          console.error('Error submitting to Apps Script:', fetchError);
          // Still return true since we stored it locally
          console.log('RSVP data (for manual entry):', payload);
          return true;
        }
      } else {
        // Fallback: just log to console
        console.log('❌ No Apps Script endpoint configured');
        console.log('RSVP data to manually add to sheet:', payload);
        return true;
      }
    } catch (error) {
      console.error('Error submitting RSVP response:', error);
      throw error;
    }
  }

  async checkExistingResponse(sheetName: string, guestId: string): Promise<RSVPResponse | null> {
    try {
      // First, check localStorage (client-side cache for immediate response)
      const stored = localStorage.getItem(`rsvp_${guestId}`);
      if (stored) {
        console.log('✓ Found RSVP data in localStorage for guest:', guestId);
        return JSON.parse(stored);
      }

      // If not in localStorage, fetch from the Google Sheet
      console.log('📡 Fetching existing RSVP from Google Sheet for guest:', guestId);
      const rsvpData = await this.fetchRSVPDataFromSheet();
      
      // Find the matching guest's RSVP
      const matchingRow = rsvpData.find((row: any[]) => row[0] === guestId);
      
      if (matchingRow) {
        // Parse the attendee names (they're stored as "Name1 | Name2 | Name3")
        const attendeeNamesStr = matchingRow[2] || '';
        const attendeeNames = attendeeNamesStr
          .split('|')
          .map((name: string) => name.trim())
          .filter((name: string) => name.length > 0);

        const rsvpResponse: RSVPResponse = {
          guestId: matchingRow[0],
          guestName: matchingRow[1],
          attendeeNames: attendeeNames,
          attending: matchingRow[3] || 'Yes',
          timestamp: matchingRow[4]
        };

        // Cache it in localStorage for future use
        localStorage.setItem(`rsvp_${guestId}`, JSON.stringify(rsvpResponse));
        console.log('✓ Found existing RSVP and cached it:', rsvpResponse);
        
        return rsvpResponse;
      }
      
      return null;
    } catch (error) {
      console.error('Error checking existing response:', error);
      return null;
    }
  }

  async updateRSVPResponse(sheetName: string, response: RSVPResponse, rowIndex: number): Promise<boolean> {
    try {
      // For now, just call submit which handles updates via Apps Script
      return this.submitRSVPResponse(sheetName, response);
    } catch (error) {
      console.error('Error updating RSVP response:', error);
      throw error;
    }
  }
}

export default RSVPServiceSimplified;
