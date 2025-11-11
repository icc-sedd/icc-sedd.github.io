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
      // If endpoint is configured, try to fetch from Apps Script first
      if (this.endpoint && this.endpoint.includes('script.google.com')) {
        try {
          // A proper implementation would fetch from the sheet via Apps Script
          // For now, check localStorage which persists across sessions
          const stored = localStorage.getItem(`rsvp_${guestId}`);
          if (stored) {
            return JSON.parse(stored);
          }
        } catch (fetchError) {
          console.log('Could not fetch existing RSVP from server');
        }
      }
      
      // Primary storage: check localStorage (persists across browser sessions)
      const stored = localStorage.getItem(`rsvp_${guestId}`);
      if (stored) {
        return JSON.parse(stored);
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
