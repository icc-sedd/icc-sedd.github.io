import React from 'react';
import church from '../images/church.png';
import reception from '../images/reception.png';

const Details: React.FC = () => {
  const handleChurchClick = () => {
    window.open('https://maps.app.goo.gl/7pFkJvnBewBo2Aws9', '_blank');
  };

  const handleReceptionClick = () => {
    window.open('https://maps.app.goo.gl/tHNVykwcrmsXUuVV6', '_blank');
  };

  return (
    <section id="details" className="section">
      <div className="container details-content">
        <h1 className="attire-main-title">DETAILS</h1>
        
        <div className="details-wrapper">
          {/* Ceremony Section */}
          <div className="details-card ceremony-card">
            <div className="details-label">ceremony at</div>
            
            <div className="details-image-container" onClick={handleChurchClick} style={{cursor: 'pointer'}}>
              <img src={church} alt="Church" className="details-image" />
            </div>
            
            <div className="details-info">
              <p className="venue-address">click image to see directions</p>
              <h2 className="venue-name">Our Lady of Sorrows Parish Church</h2>
              <p className="venue-address">2130 F.B. Harrison St, Pasay City, Metro Manila</p>
              <p className="venue-time">2:00 PM</p>              
            </div>
          </div>

          {/* Reception Section */}
          <div className="details-card reception-card">
            <div className="details-label">reception to follow at</div>
            
            <div className="details-image-container" onClick={handleReceptionClick} style={{cursor: 'pointer'}}>
              <img src={reception} alt="Reception" className="details-image" />
            </div>
            
            <div className="details-info">
              <p className="venue-address">click image to see directions</p>
              <h2 className="venue-name">Admiral Baysuites - East Wing</h2>
              <p className="venue-address">2138 Aldecoa St, Malate, Manila City, Metro Manila</p>
              <p className="venue-time">4:30 PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Details;