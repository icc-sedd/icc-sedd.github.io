import React, { useState } from 'react';
import Header from './Header';

const LandingPage: React.FC = () => {
  const [guestId, setGuestId] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    
    // Only allow alphabetic characters and limit to 5 characters
    if (/^[A-Z]*$/.test(value) && value.length <= 5) {
      setGuestId(value);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (guestId.length !== 5) {
      setError('Guest ID must be exactly 5 letters');
      return;
    }
    
    // Redirect to the same page with the GuestID parameter
    window.location.href = `${window.location.origin}/?GuestID=${guestId}`;
  };

  return (
    <div className="landing-page" style={{
      background: 'linear-gradient(135deg, rgba(248, 246, 243, 0.8) 0%, rgba(234, 229, 223, 0.9) 100%)',
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Decorative corner elements */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '100px',
        height: '100px',
        border: '2px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '50%',
        opacity: 0.5
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        width: '80px',
        height: '80px',
        border: '2px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '50%',
        opacity: 0.5
      }}></div>
      
      {/* Use the existing header component */}
      <Header />
      
      {/* Guest ID Input Section */}
      <section className="section" style={{ minHeight: 'calc(100vh - 80vh)' }}>
        <div className="container">
          <div style={{ 
            maxWidth: '650px', 
            textAlign: 'center', 
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: '25px',
            padding: 'clamp(1.5rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
            boxShadow: '0 20px 60px rgba(212, 175, 55, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}>
            <h2 style={{ 
              color: '#b8941f', 
              fontFamily: 'Great Vibes, cursive', 
              fontSize: 'clamp(2rem, 8vw, 3.5rem)', 
              marginBottom: '1.5rem',
              textAlign: 'center',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              textShadow: '2px 2px 4px rgba(212, 175, 55, 0.2)'
            }}>
            <span className="material-icons" style={{
              fontSize: 'clamp(2rem, 8vw, 3.5rem)',
              background: 'linear-gradient(135deg, #d4af37, #b8941f)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(2px 2px 4px rgba(212, 175, 55, 0.3))'
            }}>card_membership</span>
            <span>Private Invitation</span>
            </h2>
            
            <p style={{ 
              fontSize: 'clamp(1rem, 4vw, 1.2rem)', 
              color: '#2c2c2c', 
              marginBottom: '2rem',
              lineHeight: '1.6',
              fontWeight: '500'
            }}>
              This wedding website is exclusively for invited guests.
              <br />
              Please enter your 5-letter Guest ID to access your invitation.
            </p>

            <form className="form" onSubmit={handleSubmit} style={{ 
              marginBottom: '2.5rem',
              background: 'rgba(248, 246, 243, 0.5)',
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid rgba(212, 175, 55, 0.2)'
            }}>
              <div className="form-group">
                <label htmlFor="guestId" style={{ 
                  textAlign: 'center', 
                  fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                  color: '#2c2c2c',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  <span className="material-icons" style={{
                    fontSize: '1.5rem',
                    verticalAlign: 'middle',
                    color: '#b8941f'
                  }}>confirmation_number</span>
                  <span>Enter Your Guest ID</span>
                </label>
                <input
                  type="text"
                  id="guestId"
                  name="guestId"
                  value={guestId}
                  onChange={handleInputChange}
                  placeholder="ABCDE"
                  maxLength={5}
                  style={{ 
                    textAlign: 'center', 
                    fontSize: 'clamp(1.5rem, 5vw, 2rem)', 
                    fontWeight: 'bold',
                    letterSpacing: '0.3rem',
                    textTransform: 'uppercase',
                    padding: '1rem',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '15px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: 'inset 0 2px 10px rgba(212, 175, 55, 0.1)',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    maxWidth: '300px',
                    margin: '0 auto',
                    display: 'block'
                  }}
                  autoComplete="off"
                />
                <div style={{ 
                  fontSize: '0.9rem', 
                  color: '#555555', 
                  marginTop: '0.5rem',
                  fontStyle: 'italic',
                  fontWeight: '500'
                }}>
                  5 letters only (A-Z)
                </div>
              </div>

              {error && (
                <div style={{
                  background: '#f8d7da',
                  border: '1px solid #f5c6cb',
                  borderRadius: '10px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  color: '#721c24'
                }}>
                  ❌ {error}
                </div>
              )}

              <button 
                type="submit" 
                className="btn"
                disabled={guestId.length !== 5}
                style={{ 
                  opacity: guestId.length !== 5 ? 0.6 : 1,
                  cursor: guestId.length !== 5 ? 'not-allowed' : 'pointer',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  padding: '1rem 2.5rem',
                  background: guestId.length === 5 
                    ? 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)' 
                    : '#cccccc',
                  border: 'none',
                  borderRadius: '50px',
                  color: 'white',
                  boxShadow: guestId.length === 5 
                    ? '0 8px 25px rgba(212, 175, 55, 0.4)' 
                    : 'none',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                <span className="material-icons" style={{
                  fontSize: '1.2rem',
                  verticalAlign: 'middle',
                  marginRight: '0.5rem'
                }}>celebration</span>
                Access My Invitation
              </button>
            </form>

            <div style={{
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(248, 246, 243, 0.8) 100%)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '20px',
              padding: '2rem',
              fontSize: '1rem',
              color: '#2c2c2c',
              boxShadow: '0 8px 25px rgba(212, 175, 55, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative background element */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '100px',
                height: '100px',
                background: 'rgba(212, 175, 55, 0.1)',
                borderRadius: '50%'
              }}></div>
              
              <h4 style={{ 
                color: '#b8941f', 
                marginBottom: '1rem',
                fontSize: '1.3rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <span className="material-icons" style={{ fontSize: '1.5rem' }}>help_outline</span>
                Need Help?
              </h4>
              <p style={{ 
                margin: 0, 
                lineHeight: '1.6',
                color: '#333333',
                fontWeight: '500',
                position: 'relative',
                zIndex: 1
              }}>
                If you can't find your Guest ID or believe you should have received an invitation, 
                please contact the couple directly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
