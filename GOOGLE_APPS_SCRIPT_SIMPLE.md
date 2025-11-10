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
    const ss = SpreadsheetApp.openById(SHEET_ID);
    
    // Get or create RSVP Response sheet
    let sheet = ss.getSheetByName('RSVP Response');
    if (!sheet) {
      sheet = ss.insertSheet('RSVP Response');
      sheet.appendRow(['GuestID', 'Guest Name', 'Attendee Names', 'Timestamp']);
    }
    
    // Check if guest already responded
    const values = sheet.getDataRange().getValues();
    let found = false;
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == data.guestId) {
        // Update existing row
        sheet.getRange(i + 1, 1, 1, 4).setValues([[
          data.guestId,
          data.guestName,
          data.attendeeNames,
          data.timestamp
        ]]);
        found = true;
        break;
      }
    }
    
    if (!found) {
      // Add new row
      sheet.appendRow([data.guestId, data.guestName, data.attendeeNames, data.timestamp]);
    }
    
    return ContentService.createTextOutput('Success').setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    return ContentService.createTextOutput('Error: ' + error).setMimeType(ContentService.MimeType.TEXT);
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
