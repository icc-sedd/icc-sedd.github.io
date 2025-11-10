import React from 'react';
import churchIcon from '../images/church-gold.png';
import heartIcon from '../images/heart-drawing.png';
import flowerRow from '../images/flower-row.png';
import bridegroomImage from '../images/gallery/MAT06071.jpg';

const Home: React.FC = () => {
  return (
    <section id="home" className="home-section">
      <div id="home-anchor" className="home-anchor"></div>
      <div className="home-content">
        <img src={bridegroomImage} alt="Bride and Groom" className="bridegroom-divider-image" />
        <div className="invitation-cards-wrapper">
          <div className="invitation-card">
            <img src={churchIcon} alt="Church" className="church-icon" />
            <p className="invitation-header">Together with our families</p>
            <h1 className="groom-name">SEDRIC</h1>
            <p className="and-text">and</p>
            <h1 className="bride-name">MARA</h1>
            <p className="invitation-request">
              Request the pleasure of your<br />
              company at our wedding celebration!
            </p>
          </div>
          <div className="invitation-card save-date-card">
              <h1 className="std-header">Save the Date</h1>
              <img src={heartIcon} alt="Heart" className="heart-icon" />
              <h2 className="std-month">December</h2>
              <div className="std-datetime">
                <span className="std-day">Saturday</span>
                <span className="std-date">13</span>
                <span className="std-time">2:00 PM</span>
              </div>
              <h2 className="std-year">2025</h2>
              <p className="std-ceremony">Ceremony at</p>
              <p className="std-location">Our Lady of Sorrows Parish Church</p>
              <p className="std-reception">reception to follow at</p>
              <p className="std-venue">Admiral Baysuites - East Wing</p>
          </div>
        </div>
      </div>
      <img src={flowerRow} alt="Flowers" className="flower-row-decoration" />
    </section>
  );
};

export default Home;
