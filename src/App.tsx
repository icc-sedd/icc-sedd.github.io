import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Options from './components/Options';
import Details from './components/Details';
import Entourage from './components/Entourage';
import WeddingAttire from './components/WeddingAttire';
import GiftGuide from './components/GiftGuide';
import Photos from './components/Photos';
import RSVP from './components/RSVP';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import ImagePreloader from './components/ImagePreloader';
import LoadingScreen from './components/LoadingScreen';
import SpotifyWidget from './components/SpotifyWidget';

function App() {
  const [hasGuestId, setHasGuestId] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [totalImages, setTotalImages] = useState<number>(0);

  // All images to preload
  const imagesToPreload = [
    '/images/1.jpg',
    '/images/2.JPG',
    '/images/3.JPG',
    '/images/4.JPG',
    '/images/5.JPG',
    '/images/6.jpg',
    '/images/7.jpg',
    '/images/8.jpg',
    '/images/9.jpg',
    '/images/10.jpg',
    '/images/wedding-logo.png',
    '/images/bg.png',
    '/images/ninang-dress.jpg',
    '/images/ninong-barong.jpg'
  ];

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
    
    // Check for GuestID parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestId = urlParams.get('GuestID');
    
    console.log('🔍 App: Checking for GuestID parameter...');
    console.log('🎫 GuestID found:', guestId ? guestId : 'None');
    
    if (guestId && guestId.trim() !== '') {
      // Validate Guest ID format: exactly 5 alphabetic characters
      const isValidFormat = /^[A-Za-z]{5}$/.test(guestId.trim());
      
      if (isValidFormat) {
        setHasGuestId(true);
        console.log('✅ App: Valid GuestID format found, showing full website');
      } else {
        console.log('❌ App: Invalid GuestID format, redirecting to landing page');
        // Invalid format - redirect to landing page immediately
        const baseUrl = process.env.PUBLIC_URL || window.location.origin;
        window.location.href = baseUrl;
        return;
      }
    } else {
      setHasGuestId(false);
      console.log('❌ App: No GuestID parameter, showing landing page');
    }
    
    setIsLoading(false);
  }, []);

  const handleAllImagesLoaded = () => {
    console.log('🖼️ All images preloaded successfully');
    setImagesLoaded(true);
  };

  const handleProgressUpdate = (loaded: number, total: number) => {
    setLoadingProgress(loaded);
    setTotalImages(total);
    console.log(`📊 Image loading progress: ${loaded}/${total}`);
  };

  // Show loading state briefly while checking URL parameters
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.2rem'
      }}>
      </div>
    );
  }

  // Show landing page if no valid GuestID parameter
  if (!hasGuestId) {
    return <LandingPage />;
  }

  // Show full wedding website if valid GuestID parameter exists
  return (
    <div className="App">
      {/* Image Preloader */}
      <ImagePreloader
        imageSrcs={imagesToPreload}
        onAllImagesLoaded={handleAllImagesLoaded}
        onProgressUpdate={handleProgressUpdate}
      />
      
      {/* Loading Screen */}
      <LoadingScreen
        progress={loadingProgress}
        total={totalImages}
        isVisible={!imagesLoaded}
      />
      
      {/* Main Content - Only show when images are loaded */}
      <div style={{ opacity: imagesLoaded ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <Navbar />
        <Header />
        <Home />
        <Options />
        <Entourage />
        <Details />
        <WeddingAttire />
        <GiftGuide />
        <RSVP />
        <Photos />
        <Footer />
        <SpotifyWidget />
      </div>
    </div>
  );
}

export default App;
