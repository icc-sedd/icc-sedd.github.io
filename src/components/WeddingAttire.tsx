import React, { useEffect, useRef, useState } from 'react';
import principalSponsors from '../images/principal-sponsors.png';
import principalTones from '../images/principal-tones.png';
import entourage from '../images/entourage.png';
import guestTones from '../images/guest-tones.png';
import guest from '../images/guests.png';

const WeddingAttire: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isAnimated) {
              const sections = entry.target.querySelectorAll('.attire-section');
              sections.forEach((section, index) => {
                setTimeout(() => {
                  section.classList.add('animate-slide-up');
                }, index * 150);
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
    <section id="what-to-wear" className="section">
      <div className="container wedding-attire-content" ref={contentRef}>
        <h1 className="attire-main-title">WEDDING ATTIRE</h1>
        <div className="attire-sections-wrapper">
          {/* Principal Sponsors Section */}
          <div className="attire-section">
            <h2 className="attire-section-title">Principal Sponsors</h2>
            <div className="attire-card">
              <div className="attire-image-container">
                <img src={principalSponsors} alt="Principal Sponsors Attire" className="attire-showcase-image" />
              </div>
              <div className="attire-tones">
                <img src={principalTones} alt="Principal Sponsors Color Tones" className="tones-image" />
              </div>
            </div>
          </div>

          {/* Entourage Section */}
          <div className="attire-section">
            <h2 className="attire-section-title">Entourage</h2>
            <div className="attire-card">
              <div className="attire-image-container">
                <img src={entourage} alt="Entourage Attire" className="attire-showcase-image" />
              </div>
            </div>
          </div>
        </div>

        {/* Message and Guests Section */}
        <div className="attire-guests-full-wrapper">
          <div className="attire-message">
            <p>Dear Guests,</p>
            <p>We're so excited to celebrate our special day with you! To help you plan your outfit and feel comfortable, we kindly ask that you follow our dress code:</p>
          </div>

          {/* Guests Section with Image */}
          <div className="attire-section guests-section">
            <h2 className="attire-section-title">Guests</h2>
            <div className="attire-card">
              <div className="attire-image-container">
                <img src={guest} alt="Guests Attire" className="attire-showcase-image" />
              </div>
              <div className="attire-tones">
                <img src={guestTones} alt="Guests Color Tones" className="guest-tones-image" />
              </div>
            </div>
          </div>

          {/* Closing Message */}
          <div className="attire-message">
            <p>The ceremony requires the guests to wear a semi-formal attire so please dress accordingly.</p>
            <p>Feel free to incorporate and wear your best outfit with a touch of our wedding colors!</p>
            <p>We can't wait to see you all looking your best!</p>
            <p>With love,<br />Sedd & Mara</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeddingAttire;
