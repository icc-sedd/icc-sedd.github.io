import React from 'react';
import couple1 from '../images/couple-polaroid-1.png';
import couple2 from '../images/couple-polaroid-2.png';
import pair from '../images/flower-pair.png';
import goldFlower from '../images/leaves-minimalist-gold.png';
import arrow from '../images/gold-arrow.png';


const Options: React.FC = () => {
  return (
    <section id="options" className="section options-section">
      <div className="container options-container">
         <div className="options-row-1">            
            <img src={pair} alt="pair" className="flower-pair" />
            <img src={pair} alt="pair" className="flower-pair2" />
            <img src={pair} alt="pair" className="flower-pair3" />
            <img src={goldFlower} alt="pair" className="gold-flower" />
            <div className="wedding-entourage-card">                
               <h3 className="entourage-title-wedding">Wedding</h3>
               <h3 className="entourage-title-entourage">Entourage</h3>
            </div>
            <img src={couple2} alt="couple2" className="couple2" />
            <div className="wedding-details-card">
               <h3 className="wedding-details-click">Click for the</h3>
               <h3 className="wedding-details-detail">Wedding Details</h3>
            </div>
         </div>
         <div className="options-row-2">
            <img src={couple1} alt="couple1" className="couple1" />
            <div className="RSVP-card">
               <h3 className="RSVP-title-1">Kindly</h3>
               <h3 className="RSVP-title-2">RSVP</h3>
               <h3 className="RSVP-title-1">Here</h3>
               <img src={arrow} alt="arrow" className="gold-arrow" />
            </div>
         </div>
      </div>
    </section>
  );
};

export default Options;
