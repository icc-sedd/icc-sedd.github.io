# Fix Google Sheets API 400 Error

The 400 error occurs when your Google Sheet is not publicly accessible or the API key doesn't have permission to read it.

## Solution: Make Your Sheet Public

### Step 1: Open Your Google Sheet
1. Go to your Google Sheet: https://docs.google.com/spreadsheets/d/1yIJwEqmAn3msdTWLqPS_6fjXaKoH5o9_ub3EZzxwNnI
2. In the top right, click the **"Share"** button

### Step 2: Configure Sharing
1. Click **"Share"**
2. Change from **"Restricted"** to **"Anyone with the link"** or **"Public"**
   - Select **"Viewer"** as the permission level
3. Click **"Share"**

This allows the API key to read the sheet data.

## Step 3: Verify Sheet Structure

Make sure your sheet has:
- **First Sheet Name**: Should contain "Guest" in the name (e.g., "Guests", "Guest List", "Wedding Guests")
- **Columns A-D**:
  - Column A: Guest Name
  - Column B: Adult Seats
  - Column C: Children Seats  
  - Column D: Guest ID

Example:
```
Name          | Seats | KidsSeats | GuestID
John Smith    | 2     | 1         | AAAAA
Jane Doe      | 1     | 0         | BBBBB
```

## Step 4: Test

1. Restart your React app: `npm start`
2. Navigate to RSVP with a valid GuestID: `http://localhost:3000?GuestID=AAAAA`
3. Check browser console for debug messages
4. You should see: "Successfully loaded guests: X"

## Troubleshooting

### Still getting 400 error?
- Make sure the sheet is **publicly shared**
- Check that column headers match your data
- Verify the GuestID exists in your sheet

### Can't find the sheet?
- The code now auto-detects sheets with "Guest" in the name
- If that fails, check the console for available sheets and update the code

### Check Available Sheets
Open browser console and look for: "Available sheets: [...]"
This will show what sheets the API can see.
