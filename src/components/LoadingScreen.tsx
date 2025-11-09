import React from 'react';

interface LoadingScreenProps {
  progress: number;
  total: number;
  isVisible: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, total, isVisible }) => {
  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0;

  // Temporarily disabled - always return null
  console.log('⚠️ LoadingScreen: Functionality temporarily disabled');
  return null;

  /* ORIGINAL CODE - TEMPORARILY DISABLED
  if (!isVisible) return null;

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <img src="/images/wedding-logo.png" alt="Wedding Logo" />
        </div>
        <h2>Loading Our Memories...</h2>
        <div className="loading-bar-container">
          <div className="loading-bar">
            <div 
              className="loading-bar-fill" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="loading-text">{percentage}% ({progress}/{total} images)</p>
        </div>
        <div className="loading-hearts">
          <span className="heart">💕</span>
          <span className="heart">💕</span>
          <span className="heart">💕</span>
        </div>
      </div>
    </div>
  );
  */
};

export default LoadingScreen;
