import React, { useState, useEffect } from 'react';
import SimpleGoogleSheetsService, { GuestReservation } from '../services/simpleGoogleSheetsService';

const SimpleGuestLookup: React.FC = () => {
  const [guest, setGuest] = useState<GuestReservation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configStatus, setConfigStatus] = useState<string>('');
  const [guestIdFromUrl, setGuestIdFromUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Check configuration and URL parameters on component mount
  useEffect(() => {
    console.log('🔄 SimpleGuestLookup component mounted successfully!');
    
    // Extract GuestID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const guestId = urlParams.get('GuestID');
    
    if (!guestId) {  
      console.log('ℹ️ No Guest ID in URL, showing search interface');
    }
    
    const sheetId = process.env.REACT_APP_GOOGLE_SHEET_ID;
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    
    console.log('🔧 Environment check:', { 
      sheetId: sheetId ? 'Present' : 'Missing', 
      apiKey: apiKey ? 'Present' : 'Missing' 
    });
    
    if (!sheetId) {
      setError('❌ Google Sheet ID not configured in environment variables');
      return;
    }
    
    if (!apiKey) {
      setError('❌ Google API Key not configured in environment variables');
      return;
    }
    
    // If guest ID is in URL, automatically lookup the guest
    if (guestId) {
      lookupGuestById(guestId);
    }
  }, []);

  const startCountdownAndRedirect = (seconds: number, message: string) => {
    setError(`${message} Redirecting in ${seconds} seconds...`);
    setCountdown(seconds);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          window.location.href = window.location.origin;
          return null;
        }
        const newCount = prev - 1;
        setError(`${message} Redirecting in ${newCount} seconds...`);
        return newCount;
      });
    }, 1000);
  };

  const lookupGuestById = async (guestId: string) => {
    setIsLoading(true);
    setError(null);
    setGuest(null);

    try {
      const sheetId = process.env.REACT_APP_GOOGLE_SHEET_ID || '';
      const apiKey = process.env.REACT_APP_GOOGLE_API_KEY || '';
      
      if (!sheetId || !apiKey) {
        throw new Error('Google API configuration missing');
      }

      const service = new SimpleGoogleSheetsService(sheetId, apiKey);
      const foundGuest = await service.findGuestById(guestId);
      
      if (foundGuest) {
        setGuest(foundGuest);
        console.log('✅ Guest found:', foundGuest);
      } else {
        console.log('❌ Guest not found, redirecting to landing page');
        startCountdownAndRedirect(3, `❌ Guest not found with ID: ${guestId}.`);
      }
    } catch (err) {
      console.error('Guest lookup error:', err);
      
      let errorMessage = 'An error occurred while looking up guest information';
      if (err instanceof Error) {
        errorMessage = err.message;
        
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = 'Network Error: Cannot connect to Google Sheets API. Check your internet connection.';
        } else if (err.message.includes('403')) {
          errorMessage = 'Permission Error (403): API key does not have access to Google Sheets API.';
        } else if (err.message.includes('404')) {
          errorMessage = 'Sheet Not Found (404): The Google Sheet ID may be incorrect.';
        } else if (err.message.includes('400')) {
          errorMessage = 'Bad Request (400): Invalid API key or request format.';
        }
      }
      
      // For API errors, also redirect to landing page after showing error
      startCountdownAndRedirect(5, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="simple-guest-lookup">
      {guestIdFromUrl }
      
      {/* Configuration Status - only show if no guest ID in URL */}
      {configStatus && !guestIdFromUrl && (
        <div style={{ 
          background: configStatus.includes('✅') ? '#d4edda' : '#f8d7da',
          border: configStatus.includes('✅') ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
          borderRadius: '5px',
          padding: '0.5rem',
          margin: '1rem 0',
          fontSize: '0.9rem'
        }}>
          <p style={{ margin: 0, color: configStatus.includes('✅') ? '#155724' : '#721c24' }}>
            {configStatus}
          </p>
        </div>
      )}

      {/* Show guest ID info when found in URL */}
      {guestIdFromUrl && (
        <div style={{
          background: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '5px',
          padding: '1rem',
          margin: '1rem 0',
          fontSize: '0.9rem'
        }}>
          <p style={{ margin: 0, color: '#0066cc' }}>
            📧 Guest ID: <strong>{guestIdFromUrl}</strong>
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '5px',
          padding: '1rem',
          margin: '1rem 0',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#856404' }}>
            🔄 Loading your invitation details...
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="error-message">
          <div style={{
            background: countdown !== null ? '#fff3cd' : '#f8d7da',
            border: countdown !== null ? '1px solid #ffeaa7' : '1px solid #f5c6cb',
            borderRadius: '10px',
            padding: '1.5rem',
            margin: '1rem 0',
            textAlign: 'center'
          }}>
            <p style={{ 
              color: countdown !== null ? '#856404' : '#721c24', 
              fontSize: '1rem', 
              lineHeight: '1.4', 
              margin: countdown !== null ? '0 0 1rem 0' : 0,
              fontWeight: countdown !== null ? 'bold' : 'normal'
            }}>
              {error}
            </p>
            {countdown !== null && (
              <div style={{
                background: 'rgba(255, 193, 7, 0.2)',
                border: '1px solid rgba(255, 193, 7, 0.4)',
                borderRadius: '50px',
                padding: '0.8rem',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#856404'
              }}>
                🕒 Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Guest information display */}
      {guest && (
        <div className="guest-info" style={{
          background: 'rgba(212, 175, 55, 0.08)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '15px',
          padding: '2rem',
          margin: '2rem 0',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#4a3728', marginTop: 0, fontSize: '1.8rem', marginBottom: '1.5rem' }}>Welcome! 🎊</h3>
          <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#4a3728' }}>
            <p style={{ marginBottom: '1rem' }}>
              <strong style={{ color: '#4a3728' }}>Guest Name:</strong> <span style={{ color: '#b8941f', fontSize: '1.15rem', fontWeight: '600' }}>{guest.name}</span>
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong style={{ color: '#4a3728' }}>Adult Seats:</strong> <span style={{ color: '#b8941f', fontSize: '1.15rem', fontWeight: '600' }}>{guest.seats}</span>
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              <strong style={{ color: '#4a3728' }}>Children Seats:</strong> <span style={{ color: '#b8941f', fontSize: '1.15rem', fontWeight: '600' }}>{guest.kidsSeats}</span>
            </p>
            <p style={{ marginBottom: 0, fontSize: '0.95rem', color: '#8b4513', fontStyle: 'italic' }}>
              Please refrain from exceeding the allotted seats
            </p>
          </div>
        </div>
      )}

      {/* Show fallback message if no guest ID in URL and no guest found */}
      {!guestIdFromUrl && !guest && !isLoading && !error && (
        <div style={{
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '5px',
          padding: '1.5rem',
          margin: '1rem 0',
          textAlign: 'center'
        }}>
          <h4 style={{ color: '#495057', marginTop: 0 }}>📧 Looking for your invitation?</h4>
          <p style={{ color: '#6c757d', lineHeight: '1.5', margin: 0 }}>
            If you received a direct link to this page, please use that link to see your personalized invitation details.
            <br />
            <br />
            Your invitation link should look like:
            <br />
            <code style={{ background: '#e9ecef', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>
              {window.location.origin}/?GuestID=00001
            </code>
          </p>
        </div>
      )}
    </div>
  );
};

export default SimpleGuestLookup;
