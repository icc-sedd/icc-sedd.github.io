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
      backgroundImage: 'url(/images/background-silk.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden'
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
      
  
    </div>
  );
};

export default LandingPage;
