# Google Apps Script - Quick Deploy Guide

This is a minimal Google Apps Script that will save RSVP responses directly to your Google Sheet.

## Step 1: Create New Apps Script Project

1. Go to https://script.google.com
2. Click **+ New Project**
3. Name it: **"Wedding RSVP"**

## Step 2: Replace Code

Delete everything and paste THIS code:

```javascript
const SHEET_ID = '1yIJwEqmAn3msdTWLqPS_6fjXaKoH5o9_ub3EZzxwNnI';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    Logger.log('Received data:', JSON.stringify(data));
    
    const ss = SpreadsheetApp.openById(SHEET_ID);
    
    // Get or create RSVP Response sheet
    let sheet = ss.getSheetByName('RSVP Response');
    if (!sheet) {
      sheet = ss.insertSheet('RSVP Response');
      sheet.appendRow(['GuestID', 'Guest Name', 'Attendee Names', 'Attending', 'Timestamp']);
    }
    
    // Ensure sheet has proper headers
    const headers = sheet.getRange(1, 1, 1, 5).getValues()[0];
    if (headers[3] !== 'Attending') {
      // Add Attending column if it doesn't exist
      sheet.getRange(1, 4).setValue('Attending');
    }
    
    // Check if guest already responded
    const values = sheet.getDataRange().getValues();
    let found = false;
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == data.guestId) {
        // Update existing row
        Logger.log('Updating row ' + (i + 1) + ' for guest ' + data.guestId);
        sheet.getRange(i + 1, 1, 1, 5).setValues([[
          data.guestId,
          data.guestName,
          data.attendeeNames || '',
          data.attending || 'Yes',
          data.timestamp
        ]]);
        found = true;
        break;
      }
    }
    
    if (!found) {
      // Add new row
      Logger.log('Adding new row for guest ' + data.guestId);
      sheet.appendRow([
        data.guestId,
        data.guestName,
        data.attendeeNames || '',
        data.attending || 'Yes',
        data.timestamp
      ]);
    }
    
    Logger.log('RSVP saved successfully');
    return ContentService.createTextOutput(JSON.stringify({status: 'Success', data: data})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error: ' + error);
    return ContentService.createTextOutput(JSON.stringify({status: 'Error', error: error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Step 3: Deploy

1. Click **Deploy** button (top right)
2. Click **New Deployment**
3. Choose type: **Web app**
4. Execute as: **Your email**
5. Access: **Anyone** (important!)
6. Click **Deploy**
7. Click **Authorize access** and sign in
8. Copy the deployment URL (looks like `https://script.google.com/macros/s/SCRIPT_ID/usercache/do`)

## Step 4: Save the URL

Copy your deployment URL and add to `.env` file:

```
REACT_APP_RSVP_ENDPOINT=https://script.google.com/macros/s/YOUR_SCRIPT_ID/usercache/do
```

That's it! Now RSVP responses will save to your Google Sheet automatically.

## New Features

### Attending Status

The RSVP Response sheet now includes an **"Attending"** column that tracks whether guests are coming:

- **"Yes"** - Guest submitted names for attendees (accepting invitation)
- **"No"** - Guest clicked "No, I cannot make it" (declining invitation)

### Sheet Structure

Your **RSVP Response** sheet should have these columns:

| Column | Name | Description |
|--------|------|-------------|
| A | GuestID | Guest ID from invitation |
| B | Guest Name | Name of primary guest |
| C | Attendee Names | Names of all attendees (pipe-separated, empty if declining) |
| D | Attending | "Yes" or "No" status |
| E | Timestamp | When the RSVP was submitted |

### Guest Responses

- **Fill RSVP Form** - Guest enters names of attendees, sets `Attending: "Yes"`
- **No, I cannot make it** - Guest declines, sets `Attending: "No"` with empty attendee names
- **Update RSVP** - Guest can update their existing response

All responses are automatically saved to the sheet with timestamps.

````
