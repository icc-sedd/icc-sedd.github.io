# Google Apps Script Setup for RSVP Backend

This guide will help you set up a Google Apps Script that acts as a backend for RSVP submissions, avoiding OAuth verification issues.

## Step 1: Create a New Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Click **+ New Project**
3. Name the project: "Wedding RSVP Backend"
4. Delete the default `myFunction()` and replace with the code below

## Step 2: Add the Apps Script Code

Copy and paste this code into your Apps Script project:

```javascript
// Configuration
const SPREADSHEET_ID = '1yIJwEqmAn3msdTWLqPS_6fjXaKoH5o9_ub3EZzxwNnI'; // Replace with your sheet ID

// Main function to handle requests
function doPost(e) {
  Logger.log('Received request: ' + e.postData.contents);
  
  try {
    let payload;
    
    // Parse the payload
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else {
      throw new Error('No post data received');
    }

    const action = payload.action;
    Logger.log('Action: ' + action);

    if (action === 'addRSVP') {
      return addRSVPResponse(payload);
    } else if (action === 'updateRSVP') {
      return updateRSVPResponse(payload);
    } else if (action === 'checkRSVP') {
      return checkRSVPResponse(payload);
    }

    return sendResponse(false, 'Unknown action: ' + action);

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    return sendResponse(false, error.toString());
  }
}

// Helper function to send JSON response
function sendResponse(success, message, data = {}) {
  const response = {
    success: success,
    message: message,
    ...data
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Add new RSVP response
function addRSVPResponse(payload) {
  try {
    Logger.log('Adding RSVP for guest: ' + payload.guestId);
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    Logger.log('Spreadsheet opened');
    
    let sheet = ss.getSheetByName(payload.sheetName);
    
    // If sheet doesn't exist, create it
    if (!sheet) {
      Logger.log('Sheet not found, creating: ' + payload.sheetName);
      sheet = ss.insertSheet(payload.sheetName);
      
      // Add headers
      sheet.appendRow(['GuestID', 'Guest Name', 'Attendee Names', 'Timestamp']);
    }

    Logger.log('Sheet found/created: ' + sheet.getName());

    // Check if guest already has an RSVP
    const data = sheet.getDataRange().getValues();
    let rowToUpdate = -1;

    Logger.log('Checking ' + data.length + ' rows for existing RSVP');

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(payload.guestId).trim()) {
        rowToUpdate = i + 1; // +1 because getRange is 1-indexed
        Logger.log('Found existing RSVP at row: ' + rowToUpdate);
        break;
      }
    }

    if (rowToUpdate > 0) {
      // Update existing row
      Logger.log('Updating row ' + rowToUpdate);
      const range = sheet.getRange(rowToUpdate, 1, 1, 4);
      range.setValues([[
        payload.guestId,
        payload.guestName,
        payload.attendeeNames,
        payload.timestamp
      ]]);
    } else {
      // Add new row
      Logger.log('Adding new row');
      sheet.appendRow([
        payload.guestId,
        payload.guestName,
        payload.attendeeNames,
        payload.timestamp
      ]);
    }

    return sendResponse(true, 'RSVP submitted successfully');

  } catch (error) {
    Logger.log('Error in addRSVPResponse: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    return sendResponse(false, error.toString());
  }
}

// Update existing RSVP response
function updateRSVPResponse(payload) {
  try {
    Logger.log('Updating RSVP for row: ' + payload.rowIndex);
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(payload.sheetName);

    if (!sheet) {
      return sendResponse(false, 'Sheet not found: ' + payload.sheetName);
    }

    const rowIndex = payload.rowIndex + 1; // Convert from 0-indexed to 1-indexed
    const range = sheet.getRange(rowIndex, 1, 1, 4);
    
    range.setValues([[
      payload.guestId,
      payload.guestName,
      payload.attendeeNames,
      payload.timestamp
    ]]);

    return sendResponse(true, 'RSVP updated successfully');

  } catch (error) {
    Logger.log('Error in updateRSVPResponse: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    return sendResponse(false, error.toString());
  }
}

// Check existing RSVP
function checkRSVPResponse(payload) {
  try {
    Logger.log('Checking RSVP for guest: ' + payload.guestId);
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(payload.sheetName);

    if (!sheet) {
      return sendResponse(false, 'Sheet not found: ' + payload.sheetName);
    }

    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(payload.guestId).trim()) {
        return sendResponse(true, 'RSVP found', {
          exists: true,
          data: {
            guestId: data[i][0],
            guestName: data[i][1],
            attendeeNames: data[i][2],
            timestamp: data[i][3]
          }
        });
      }
    }

    return sendResponse(true, 'No RSVP found', { exists: false });

  } catch (error) {
    Logger.log('Error in checkRSVPResponse: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    return sendResponse(false, error.toString());
  }
}
```

## Step 3: Deploy as Web App

1. Click **Deploy** → **New Deployment**
2. Select type: **Web app**
3. Configure:
   - **Execute as**: Your Google Account
   - **Who has access**: **Anyone**
4. Click **Deploy**
5. Click **Authorize access** when prompted
6. Copy the deployment URL (it will look like: `https://script.google.com/macros/s/SCRIPT_ID/usercache/do`)

## Step 4: Add Environment Variable

1. Open your `.env` file in the project root
2. Add the Apps Script URL:
   ```
   REACT_APP_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/usercache/do
   ```

Replace `YOUR_SCRIPT_ID` with the ID from your Apps Script deployment URL.

## Step 5: Make Sure Your Sheet Has "RSVP Response" Sheet

1. Open your Google Sheet
2. Create a new sheet named **"RSVP Response"** if it doesn't exist
3. Add headers in the first row:
   - Column A: `GuestID`
   - Column B: `Guest Name`
   - Column C: `Attendee Names`
   - Column D: `Timestamp`

## Step 6: Test

1. Start your React app: `npm start`
2. Navigate to the RSVP section with a valid GuestID in the URL
3. Fill out the form and submit
4. Check your Google Sheet to see if the data was added

## Troubleshooting

- **Script not running**: Check the Execution log in Apps Script (View → Execution log)
- **Permission denied**: Make sure the sheet is accessible and the script has proper permissions
- **CORS errors**: This setup uses `mode: 'no-cors'` to avoid CORS issues

That's it! Your RSVP system is now set up without requiring OAuth verification.
