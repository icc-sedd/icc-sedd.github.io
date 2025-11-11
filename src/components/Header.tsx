import React, { useState, useEffect } from 'react';
import SimpleGoogleSheetsService from '../services/simpleGoogleSheetsService';

const Header: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [guestId, setGuestId] = useState('');
  const [error, setError] = useState('');
  const [isOpening, setIsOpening] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Initialize Google Sheets service
  const sheetsService = new SimpleGoogleSheetsService(
    process.env.REACT_APP_GOOGLE_SHEET_ID || '',
    process.env.REACT_APP_GOOGLE_API_KEY || ''
  );

  // Log environment setup (without exposing full keys)
  useEffect(() => {
    console.log('🔑 Environment check:');
    console.log('Sheet ID configured:', !!process.env.REACT_APP_GOOGLE_SHEET_ID);
    console.log('API Key configured:', !!process.env.REACT_APP_GOOGLE_API_KEY);
  }, []);

  // Check if GuestID exists in URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const guestIdFromUrl = urlParams.get('GuestID');
    
    if (guestIdFromUrl) {
      // If GuestID exists in URL, show the open envelope immediately
      setIsOpening(true);
    
    }
  }, []);

  const handleCandleClick = () => {
    // Don't show modal if envelope is already opening
    if (!isOpening) {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setGuestId('');
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    
    // Only allow alphabetic characters and limit to 5 characters
    if (/^[A-Z]*$/.test(value) && value.length <= 5) {
      setGuestId(value);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (guestId.length !== 5) {
      setError('Guest ID must be exactly 5 letters');
      return;
    }
    
    // Validate Guest ID against Google Sheets
    setIsValidating(true);
    setError('');
    
    try {
      console.log('🔍 Validating Guest ID:', guestId);
      const guest = await sheetsService.findGuestById(guestId);
      
      console.log('📋 Guest lookup result:', guest);
      
      if (!guest) {
        console.log('❌ Guest ID not found in sheet');
        setError('Invalid Guest ID. Please check your invitation card.');
        setIsValidating(false);
        return;
      }
      
      // Valid Guest ID found
      console.log('✅ Valid Guest ID found:', guest);
      
      // Close modal and start envelope opening animation
      setShowModal(false);
      setIsValidating(false);
      setIsOpening(true);
      
      console.log('🎬 Starting envelope animation...');
      
      // Wait 5 seconds to show the invitation, then redirect with Guest ID
      setTimeout(() => {
        console.log('� Redirecting to main website with Guest ID...');
        // Add Guest ID to URL and reload to show main website
        window.location.href = `${window.location.origin}${window.location.pathname}?GuestID=${guestId}`;
      }, 5000);
      
    } catch (error) {
      console.error('❌ Error validating Guest ID:', error);
      setError('Unable to validate Guest ID. Please try again.');
      setIsValidating(false);
    }
  };

  return (
    <>
      <header className={`header ${isOpening ? 'header-with-nav' : ''}`}>
        <div className="header-content">
          <h1>SEDD & MARA </h1>
          <p className="header-date">12.13.2025</p>
          
          <div className="envelope-container">
            <img 
              src={require('../images/flower 1.png')} 
              alt="flower" 
              className={`flower-left ${isOpening ? 'fade-out' : ''}`}
            />
            <div className="envelope-wrapper">
              {/* Closed Envelope */}
              <img 
                src={require('../images/envelope-close.png')} 
                alt="envelope closed" 
                className={`envelope envelope-closed ${isOpening ? 'hide' : ''}`}
              />
              {/* Open Envelope */}
              <img 
                src={require('../images/envelope-open.png')} 
                alt="envelope open" 
                className={`envelope envelope-open ${isOpening ? 'show' : ''}`}
              />
              
              {/* Envelope Contents - Only visible when opening */}
              {isOpening && (
                <div className="envelope-contents">
                  <img 
                    src={require('../images/envelope-objects.png')} 
                    alt="envelope contents" 
                    className="envelope-objects"
                  />
                </div>
              )}
              
              {/* Candle Logo */}
              <img 
                src={require('../images/candle-logo.png')} 
                alt="candle logo" 
                className={`candle-logo ${isOpening ? 'fade-out' : ''}`}
                onClick={handleCandleClick}
                style={{ pointerEvents: isOpening ? 'none' : 'auto' }}
              />
            </div>
            <img 
              src={require('../images/flower 2.png')} 
              alt="flower" 
              className={`flower-right ${isOpening ? 'fade-out' : ''}`}
            />
          </div>
        </div>
      </header>

      {/* Modal for Guest ID Input */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            
            <h2 style={{ 
              color: '#8f5e36', 
              fontFamily: 'TAN Angleton, Lora, serif', 
              fontSize: '2.5rem', 
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              Enter Your Guest ID
            </h2>
            
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#4a3728', 
              marginBottom: '2rem',
              textAlign: 'center',
              lineHeight: '1.6'
            }}>
              Please enter your 5-letter Guest ID to access your invitation.
            </p>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <input
                type="text"
                value={guestId}
                onChange={handleInputChange}
                placeholder="ABCDE"
                maxLength={5}
                autoFocus
                style={{ 
                  textAlign: 'center', 
                  fontSize: '2rem', 
                  fontWeight: 'bold',
                  letterSpacing: '0.5rem',
                  textTransform: 'uppercase',
                  padding: '1rem 2rem',
                  border: '2px solid rgba(143, 94, 54, 0.3)',
                  borderRadius: '15px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  boxShadow: 'inset 0 2px 10px rgba(143, 94, 54, 0.1)',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  maxWidth: '300px',
                  margin: '0 auto 1rem',
                  display: 'block'
                }}
              />
              
              <div style={{ 
                fontSize: '0.9rem', 
                color: '#666', 
                marginBottom: '1rem',
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                5 letters only (A-Z)
              </div>

              {error && (
                <div style={{
                  background: '#f8d7da',
                  border: '1px solid #f5c6cb',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  color: '#721c24',
                  textAlign: 'center'
                }}>
                  ❌ {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={guestId.length !== 5 || isValidating}
                style={{ 
                  opacity: (guestId.length !== 5 || isValidating) ? 0.6 : 1,
                  cursor: (guestId.length !== 5 || isValidating) ? 'not-allowed' : 'pointer',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  padding: '1rem 2.5rem',
                  background: (guestId.length === 5 && !isValidating)
                    ? 'linear-gradient(135deg, #8f5e36 0%, #6d4428 100%)' 
                    : '#cccccc',
                  border: 'none',
                  borderRadius: '50px',
                  color: 'white',
                  boxShadow: (guestId.length === 5 && !isValidating)
                    ? '0 8px 25px rgba(143, 94, 54, 0.4)' 
                    : 'none',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  width: '100%',
                  maxWidth: '300px',
                  display: 'block',
                  margin: '0 auto'
                }}
              >
                {isValidating ? 'Validating...' : 'Open Invitation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
