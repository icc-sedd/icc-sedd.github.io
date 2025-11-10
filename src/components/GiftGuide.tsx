import React from 'react';
import goldBow from '../images/gold-bow.png';

const GiftGuide: React.FC = () => {
  return (
    <section id="gift-guide" className="section gift-guide-section">
      <div className="container gift-guide-container">
        <div className="gift-guide-wrapper">
          <div className="gift-guide-image">
            <img src={goldBow} alt="Gold Bow" className="gold-bow-icon" />
          </div>
          <div className="gift-guide-content">
            <h1 className="gift-guide-title">GIFT GUIDE</h1>
            <div className="gift-guide-message">
              <p>Your presence is the greatest gift! With all that we have, we have been truly blessed. Your presence and prayers are all that we request. But if you desire to give nonetheless, <span className="gift-guide-highlight">monetary gift</span> is the one we suggest.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftGuide;
