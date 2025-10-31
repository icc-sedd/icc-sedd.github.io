import React, { useEffect, useRef, useState } from 'react';
import Map from './Map';
import Countdown from './Countdown';
import SimpleGuestLookup from './SimpleGuestLookup';

const Details: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isAnimated) {
              // Add animation classes with staggered delays
              const elements = entry.target.querySelectorAll('.details-animate-item');
              elements.forEach((element, index) => {
                setTimeout(() => {
                  element.classList.add('animate-slide-up');
                }, index * 200); // 200ms delay between each element
              });
              setIsAnimated(true);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px 0px 0px'
        }
      );

      if (contentRef.current) {
        observer.observe(contentRef.current);
      }

      return () => {
        if (contentRef.current) {
          observer.unobserve(contentRef.current);
        }
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [isAnimated]);

  return (
    <section id="details" className="section">
      <div className="container details-content" ref={contentRef}>
        <h2>Wedding Details</h2>
        
        <div className="details-animate-item">
          <Countdown />
        </div>
        
        <div className="guest-lookup-container details-animate-item">
          <h3>Guest Seating Details</h3>
          <SimpleGuestLookup />
        </div>
        
        <div className="wedding-venues-section details-animate-item">
          <div className="venues-grid">
            {/* Ceremony Card */}
            <div className="venue-card ceremony-card">
              <div className="venue-header">
                <div className="venue-icon">⛪</div>
                <div className="venue-title">
                  <h3>Ceremony</h3>
                  <span className="venue-type">Sacred Vows</span>
                </div>
              </div>
              
              <div className="venue-content">
                <div className="venue-info">
                  <div className="info-item">
                    <div className="info-icon">📍</div>
                    <div className="info-text">
                      <strong>Our Lady of Sorrows Parish Church</strong>
                      <p>2130 F.B. Harrison St, Pasay City, Metro Manila</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-icon">📅</div>
                    <div className="info-text">
                      <strong>Friday, December 13, 2025</strong>
                      <p>2:00 PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="venue-map">
                  <Map 
                    googleMapsUrl="https://maps.app.goo.gl/ksbcdo1fJZp9PRMX6"
                    title="Church Location"
                  />
                  <div className="map-overlay">
                    <a 
                      href="https://maps.app.goo.gl/ksbcdo1fJZp9PRMX6" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="map-button"
                    >
                      �️ Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Reception Card */}
            <div className="venue-card reception-card">
              <div className="venue-header">
                <div className="venue-icon">🥂</div>
                <div className="venue-title">
                  <h3>Reception</h3>
                  <span className="venue-type">Celebration</span>
                </div>
              </div>
              
              <div className="venue-content">
                <div className="venue-info">
                  <div className="info-item">
                    <div className="info-icon">📍</div>
                    <div className="info-text">
                      <strong>Admiral Baysuites (East Wing)</strong>
                      <p>2138 Aldecoa St, Malate, Manila, Metro Manila</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-icon">📅</div>
                    <div className="info-text">
                      <strong>Friday, December 13, 2025</strong>
                      <p>4:30 PM - 10:00 PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="venue-map">
                  <Map 
                    googleMapsUrl="https://maps.app.goo.gl/oecVip2xPSMtoNtj9"
                    title="Reception Venue Location"
                  />
                  <div className="map-overlay">
                    <a 
                      href="https://maps.app.goo.gl/oecVip2xPSMtoNtj9" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="map-button"
                    >
                      �️ Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Details;