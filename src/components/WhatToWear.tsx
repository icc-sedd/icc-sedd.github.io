import React, { useEffect, useRef, useState } from 'react';

const WhatToWear: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isAnimated) {
              // Add animation classes with staggered delays
              const sections = entry.target.querySelectorAll('.wear-animate-item');
              sections.forEach((section, index) => {
                setTimeout(() => {
                  section.classList.add('animate-slide-up');
                }, index * 300); // 300ms delay between each section
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
      <div className="container wear-content" ref={contentRef}>
        <h2>What to Wear</h2>
        <div className="card">
          <div className="dress-code-section">
            <div className="wear-animate-item">
              <h4>For VIPs (Ninong and Ninang)</h4>
              <div className="vip-dress-code">
                <div className="dress-code-row">
                  <div className="dress-code-item">
                    <p><strong>Ninong:</strong> Barong Tagalog</p>
                    <div className="dress-code-image">
                      <img 
                        src="/images/ninong-barong.jpg" 
                        alt="Barong Tagalog for Ninong"
                        className="attire-image"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='280' viewBox='0 0 220 280'%3E%3Cdefs%3E%3ClinearGradient id='barongBg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f8f6f3;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23eae5df;stop-opacity:1' /%3E%3C/linearGradient%3E%3ClinearGradient id='barongColor' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ffffff;stop-opacity:0.95' /%3E%3Cstop offset='100%25' style='stop-color:%23f8f9fa;stop-opacity:0.95' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='220' height='280' fill='url(%23barongBg)'/%3E%3Crect x='10' y='10' width='200' height='260' fill='none' stroke='%23d4af37' stroke-width='2' rx='15' opacity='0.4'/%3E%3Cpath d='M 60 80 L 160 80 L 170 100 L 170 200 L 50 200 L 50 100 Z' fill='url(%23barongColor)' stroke='%23d4af37' stroke-width='2' opacity='0.9'/%3E%3Cpath d='M 85 85 L 135 85 Q 140 90 135 95 L 85 95 Q 80 90 85 85' fill='none' stroke='%23d4af37' stroke-width='1.5'/%3E%3Cline x1='95' y1='100' x2='95' y2='180' stroke='%23d4af37' stroke-width='1' opacity='0.7'/%3E%3Cline x1='110' y1='100' x2='110' y2='180' stroke='%23d4af37' stroke-width='1' opacity='0.7'/%3E%3Cline x1='125' y1='100' x2='125' y2='180' stroke='%23d4af37' stroke-width='1' opacity='0.7'/%3E%3Ccircle cx='110' cy='110' r='2' fill='%23d4af37'/%3E%3Ccircle cx='110' cy='130' r='2' fill='%23d4af37'/%3E%3Ccircle cx='110' cy='150' r='2' fill='%23d4af37'/%3E%3Ctext x='110' y='40' text-anchor='middle' font-family='serif' font-size='16' font-weight='bold' fill='%23b8941f'%3EBarong Tagalog%3C/text%3E%3Ctext x='110' y='60' text-anchor='middle' font-family='serif' font-size='12' fill='%234a3728'%3ETraditional Filipino Formal%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  </div>
                <div className="dress-code-item">
                  <p><strong>Ninang:</strong> Filipiñana dress</p>
                  <div className="dress-code-image">
                    <img 
                      src="/images/ninang-dress.jpg" 
                      alt="Filipiñana dress for Ninang"
                      className="attire-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='280' viewBox='0 0 220 280'%3E%3Cdefs%3E%3ClinearGradient id='filipinianaBg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f8f6f3;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23eae5df;stop-opacity:1' /%3E%3C/linearGradient%3E%3ClinearGradient id='filipinianaColor' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23d4af37;stop-opacity:0.9' /%3E%3Cstop offset='100%25' style='stop-color:%23b8941f;stop-opacity:0.9' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='220' height='280' fill='url(%23filipinianaBg)'/%3E%3Crect x='10' y='10' width='200' height='260' fill='none' stroke='%23d4af37' stroke-width='2' rx='15' opacity='0.4'/%3E%3Cpath d='M 70 80 L 150 80 L 160 100 L 160 160 L 60 160 L 60 100 Z' fill='%23ffffff' stroke='%23d4af37' stroke-width='2' opacity='0.9'/%3E%3Cpath d='M 60 160 L 160 160 L 180 200 L 185 240 L 35 240 L 40 200 Z' fill='url(%23filipinianaColor)' stroke='%23b8941f' stroke-width='2'/%3E%3Cpath d='M 85 85 L 135 85 Q 140 90 135 95 L 85 95 Q 80 90 85 85' fill='none' stroke='%23d4af37' stroke-width='1.5'/%3E%3Cpath d='M 90 100 Q 110 90 130 100' fill='none' stroke='%23d4af37' stroke-width='1.5'/%3E%3Ccircle cx='110' cy='110' r='2' fill='%23d4af37'/%3E%3Ccircle cx='110' cy='130' r='2' fill='%23d4af37'/%3E%3Cpath d='M 75 170 Q 85 165 95 170' fill='none' stroke='%23b8941f' stroke-width='1' opacity='0.7'/%3E%3Cpath d='M 110 170 Q 120 165 130 170' fill='none' stroke='%23b8941f' stroke-width='1' opacity='0.7'/%3E%3Cpath d='M 125 180 Q 135 175 145 180' fill='none' stroke='%23b8941f' stroke-width='1' opacity='0.7'/%3E%3Ctext x='110' y='40' text-anchor='middle' font-family='serif' font-size='16' font-weight='bold' fill='%23b8941f'%3EFilipiñana Dress%3C/text%3E%3Ctext x='110' y='60' text-anchor='middle' font-family='serif' font-size='12' fill='%234a3728'%3ETraditional Champagne Gold%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            </div>
            
            <div className="wear-animate-item">
              <h4>For All Other Guests</h4>
              <div className="general-dress-code">
                <p><strong>Recommended:</strong> Semi-formal / Cocktail attire</p>
                <p><strong>Colors to Consider:</strong> Elegant colors that complement our theme</p>
                <p><strong>Note:</strong> Please avoid wearing white or champagne gold (reserved for the couple and VIPs)</p>
                
                <div className="dress-code-row">
                  <div className="dress-code-item">
                    <p><strong>Men:</strong> Suit or dress shirt with slacks</p>
                    <div className="dress-code-image">
                      <img 
                        src="/images/mens-semi-formal.svg" 
                        alt="Semi-formal attire for men"
                        className="attire-image"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='280' viewBox='0 0 220 280'%3E%3Cdefs%3E%3ClinearGradient id='elegantBg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f8f6f3;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23eae5df;stop-opacity:1' /%3E%3C/linearGradient%3E%3ClinearGradient id='suitColor' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%232c3e50;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2334495e;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='220' height='280' fill='url(%23elegantBg)'/%3E%3Crect x='10' y='10' width='200' height='260' fill='none' stroke='%23d4af37' stroke-width='2' rx='15' opacity='0.3'/%3E%3Crect x='60' y='80' width='100' height='120' fill='url(%23suitColor)' rx='8'/%3E%3Crect x='80' y='90' width='60' height='80' fill='white' rx='4'/%3E%3Crect x='100' y='100' width='20' height='60' fill='%23d4af37' rx='2'/%3E%3Ctext x='110' y='40' text-anchor='middle' font-family='serif' font-size='16' font-weight='bold' fill='%23b8941f'%3ESemi-Formal%3C/text%3E%3Ctext x='110' y='60' text-anchor='middle' font-family='serif' font-size='12' fill='%234a3728'%3ESuit or Dress Shirt%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  </div>
                  <div className="dress-code-item">
                    <p><strong>Women:</strong>Elegant blouse with skirt</p>
                    <div className="dress-code-image">
                      <img 
                        src="/images/womens-cocktail.svg" 
                        alt="Cocktail dress for women"
                        className="attire-image"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='280' viewBox='0 0 220 280'%3E%3Cdefs%3E%3ClinearGradient id='elegantBgW' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f8f6f3;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23eae5df;stop-opacity:1' /%3E%3C/linearGradient%3E%3ClinearGradient id='dressColor' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%238e44ad;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%236a1b9a;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='220' height='280' fill='url(%23elegantBgW)'/%3E%3Crect x='10' y='10' width='200' height='260' fill='none' stroke='%23d4af37' stroke-width='2' rx='15' opacity='0.3'/%3E%3Crect x='70' y='80' width='80' height='60' fill='%2334495e' rx='8'/%3E%3Cpath d='M 60 140 L 160 140 L 180 200 L 40 200 Z' fill='url(%23dressColor)'/%3E%3Crect x='60' y='135' width='100' height='10' fill='%23d4af37' rx='5'/%3E%3Ctext x='110' y='40' text-anchor='middle' font-family='serif' font-size='16' font-weight='bold' fill='%23b8941f'%3ECocktail Attire%3C/text%3E%3Ctext x='110' y='60' text-anchor='middle' font-family='serif' font-size='12' fill='%234a3728'%3EElegant Blouse %26 Skirt%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
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

export default WhatToWear;
