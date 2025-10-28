import React, { useEffect, useRef, useState } from 'react';

const Entourage: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [backgroundOffset, setBackgroundOffset] = useState(0);

  // Parallax scroll effect for background image
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5; // Adjust this value to control parallax speed
        
        // Only apply parallax when section is in viewport
        if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
          setBackgroundOffset(rate);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isAnimated) {
              // Add animation classes with staggered delays
              const cards = entry.target.querySelectorAll('.entourage-group');
              cards.forEach((card, index) => {
                setTimeout(() => {
                  card.classList.add('animate-slide-up');
                }, index * 200); // 200ms delay between each card
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
    <section 
      id="entourage" 
      className="section"
      ref={sectionRef}
      style={{
        background: `linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.5) 100%), url('/gallery/MAT05257.jpg') center/cover`,
        backgroundAttachment: 'scroll',
        backgroundPosition: `center ${backgroundOffset}px`,
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="container entourage-content" ref={contentRef}>
        <h2>Our Entourage</h2>
        
        <div className="entourage-group">
          <h3>Principal Sponsors</h3>
          <div className="principal-sponsors-card">
            <div className="sponsors-list">
              <div className="sponsor-pair">
                <span>Mrs. Lourdes Fababier</span>
                <span>Mr. Onofre Fababier</span>
              </div>
              <div className="sponsor-pair">
                <span>Ms. Janette Rosario</span>
                <span>Mr. Ernesto Macarubo</span>
              </div>
              <div className="sponsor-pair">
                <span>Ms. Joje Fababier</span>
                <span>Mr. Romeo Barles</span>
              </div>
              <div className="sponsor-pair">
                <span>Mrs. Aillen Ariola Caguiwa</span>
                <span>Mr. Arnel Celis</span>
              </div>
              <div className="sponsor-pair">
                <span>Ms. Marilou Dela Gracia</span>
                <span>Mr. Wenzy Fababier</span>
              </div>
              <div className="sponsor-pair">
                <span>Mrs. Margie Bermas</span>
                <span>Mr. Noel Bermas</span>
              </div>
              <div className="sponsor-pair">
                <span>Mrs. Rowena Pascua</span>
                <span>Mr. Noel Pascua</span>
              </div>
              <div className="sponsor-pair">
                <span>Mrs. Beth Nicolas</span>
                <span>Mr. Morris Perdon</span>
              </div>
              <div className="sponsor-pair">
                <span>Mrs. Penny Perido</span>
                <span>Mr. Dennis Perido</span>
              </div>
              <div className="sponsor-pair">
                <span>Mrs. Grace Dizon</span>
                <span>Mr. Jonas Cerdan</span>
              </div>
              <div className="sponsor-pair">
                <span>Mrs. Faye Marie Zapatero</span>
                <span>Mr. Jeffrey Zapatero</span>
              </div>
              <div className="sponsor-pair">
                <span>Mrs. Julibee Nicolas Tinamisan</span>
                <span>Mr. Jesus Zapatero Jr.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="entourage-group">
          <h3>Special Roles</h3>
          <div className="special-roles-custom-layout">
            <div className="role-row single">
              <div className="role">
                <h4>Ring Bearer</h4>
                <p>Jio Aedrious R. Ramos</p>
              </div>
            </div>
            <div className="role-row double">
              <div className="role">
                <h4>Bible Bearer</h4>
                <p>Zachary Mikhael D. Gonzaga</p>
              </div>
              <div className="role">
                <h4>Coin Bearer</h4>
                <p>Juan Crisson Bautista</p>
              </div>
            </div>
            <div className="role-row single">
              <div className="role">
                <h4>Flower Girls</h4>
                <p>Leticia Ambrose C. Francia</p>
                <p>Shazeah Kylie Sanchez</p>
              </div>
            </div>
          </div>
        </div>

        <div className="entourage-group">
          <h3>Bridal Party</h3>
          <div className="honor-party-card">
            <div className="honor-party-content">
              <div className="honor-section">
                <h4>Matron of Honor</h4>
                <p>👑 Danica Rose C. Francia</p>
              </div>
              
              <div className="honor-section">
                <h4>Best Man</h4>
                <p>🤵 Aljohn Ramos</p>
              </div>

              <div className="honor-section">
                <h4>Maid of Honor</h4>
                <p>👠 Janine Fababier</p>
              </div>
              

            </div>
          </div>
          
          <div className="bridesmaids-groomsmen-card">
            <div className="bridesmaids-groomsmen-content">
              <div className="bridesmaids-section">
                <h4>Bridesmaids</h4>
                <ul>
                  <li>Mikee Mae De Leon</li>
                  <li>Faye Valle</li>
                  <li>Monica Solas</li>
                  <li>Rosemarie M. Cortado</li>
                  <li>Prances Ann F. Roxas</li>
                  <li>Nor-Anne Marie F. Fiel</li>
                  <li>Joselle R. Ramos</li>
                  <li>Janelle Z. Ramos</li>
                </ul>
              </div>
              
              <div className="groomsmen-section">
                <h4>Groomsmen</h4>
                <ul>
                  <li>Bryan Roger P. Bernardo</li>
                  <li>Gerald Rafael B. Francia</li>
                  <li>Ritz Alonzo</li>
                  <li>Carlo Tienzo</li>
                  <li>Christian Kurt Agao</li>
                  <li>Maverick Lewis K. Fiel</li>
                  <li>Adrian Ramos</li>
                  <li>Kyle Camua</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Entourage;
