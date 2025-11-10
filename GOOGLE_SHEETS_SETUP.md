# Google Sheets API Integration Setup (OAuth2)

## Step 1: Create Google Cloud Project and Enable API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one (you already have "dpsi-email-handler")
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

## Step 2: Configure OAuth2 Credentials (Already Done!)

Your OAuth2 credentials are already configured in `googleAPI.json`:
- **Client ID**: 483999987912-qbpap77epp1bapvdcqoab4ljnqt94e79.apps.googleusercontent.com
- **Project ID**: dpsi-email-handler

### Add Authorized Origins (Important!)
1. Go to "APIs & Services" > "Credentials"
2. Click on your OAuth 2.0 Client ID
3. Add these to "Authorized JavaScript origins":
   - `http://localhost:3000` (for development)
   - `http://localhost:3001` (for development)
   - Your production domain when you deploy

## Step 3: Optional - Create API Key for Public Sheets

If your Google Sheet is public, you can also create an API key:
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Restrict the key to "Google Sheets API"

## Step 3: Prepare Your Google Sheet

1. Create a Google Sheet with your guest data
2. Structure it with these columns (A-D):
   - Column A: Name
   - Column B: Seats (Adult seats)
   - Column C: Kids Seat
   - Column D: Guest ID

Example:
```
Name          | Seats | Kids Seat | Guest ID
John Smith    | 2     | 1         | JS001
Jane Doe      | 1     | 0         | JD002
Mike Johnson  | 2     | 2         | MJ003
Sarah Wilson  | 1     | 1         | SW004
```

3. Make the sheet publicly viewable:
   - Click "Share" button
   - Change "Restricted" to "Anyone with the link"
   - Set permission to "Viewer"
   - Copy the sheet ID from the URL

## Step 4: Configure Environment Variables

The `.env` file has been updated with your OAuth2 credentials:

```env
REACT_APP_GOOGLE_CLIENT_ID=483999987912-qbpap77epp1bapvdcqoab4ljnqt94e79.apps.googleusercontent.com
REACT_APP_GOOGLE_API_KEY=your_api_key_if_needed
REACT_APP_GOOGLE_SHEET_ID=your_sheet_id_from_url
```

You only need to add your **Google Sheet ID**.

### How to get Sheet ID:
From a Google Sheets URL like:
`https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`

The Sheet ID is: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## Step 5: Test the Integration

1. Start your development server: `npm start`
2. Navigate to the Wedding Details section
3. Try searching for guest names from your sheet
4. Verify the data displays correctly

## Features Included

- **Real-time Guest Lookup**: Search for guests by name or Guest ID
- **Seat Information**: Shows adult seats and kids seats separately
- **Guest ID System**: Unique identifier for each guest/family
- **Comprehensive Statistics**: Shows total guests, adult seats, kids seats, and total seats
- **Responsive Design**: Works on mobile and desktop
- **Error Handling**: User-friendly error messages

## Troubleshooting

### Common Issues:

1. **"No reservation found"**: Check guest name spelling in the sheet
2. **"Failed to load guest list"**: Verify API key and sheet permissions
3. **API errors**: Ensure Google Sheets API is enabled in Google Cloud Console

### Security Notes:

- The `.env` file is already added to `.gitignore`
- API key is restricted to Google Sheets API only
- Sheet is read-only for the website

## Customization

You can modify the search range in `Details.tsx`:
```typescript
// Change 'Guests!A:D' to match your sheet name and range
<GuestLookup spreadsheetId={spreadsheetId} range="Guests!A:D" />
```
