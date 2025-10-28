import React, { useEffect, useRef, useState } from 'react';

// Interface for photo objects
interface Photo {
  id: number;
  src: string;
  alt: string;
}

// Load gallery images for slideshow background
const loadGalleryImages = async (): Promise<Photo[]> => {
  try {
    // Try to fetch a gallery manifest file first
    const response = await fetch('/gallery/manifest.json');
    if (response.ok) {
      const manifest = await response.json();
      return manifest.images.map((filename: string, index: number) => ({
        id: index + 1,
        src: `/gallery/${filename}`,
        alt: `Background Photo ${index + 1}`
      }));
    }
  } catch (error) {
    console.log('No manifest.json found for slideshow background');
  }

  // Fallback to current gallery images
  return [
    { id: 1, src: '/gallery/MAT05257.jpg', alt: 'Background Photo 1' },
    { id: 2, src: '/gallery/MAT05441.jpg', alt: 'Background Photo 2' },
    { id: 3, src: '/gallery/MAT05504.jpg', alt: 'Background Photo 3' },
    { id: 4, src: '/gallery/MAT05592.jpg', alt: 'Background Photo 4' },
    { id: 5, src: '/gallery/MAT05660.jpg', alt: 'Background Photo 5' },
    { id: 6, src: '/gallery/MAT05895.jpg', alt: 'Background Photo 6' },
    { id: 7, src: '/gallery/MAT05979.jpg', alt: 'Background Photo 7' },
    { id: 8, src: '/gallery/MAT06071.jpg', alt: 'Background Photo 8' },
    { id: 9, src: '/gallery/MAT06227.jpg', alt: 'Background Photo 9' },
    { id: 10, src: '/gallery/MAT06244.jpg', alt: 'Background Photo 10' }
  ];
};

const About: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [backgroundPhotos, setBackgroundPhotos] = useState<Photo[]>([]);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);

  // Load background photos
  useEffect(() => {
    const loadPhotos = async () => {
      setIsLoadingPhotos(true);
      try {
        const galleryImages = await loadGalleryImages();
        setBackgroundPhotos(galleryImages);
        console.log(`Loaded ${galleryImages.length} images for Our Story background`);
      } catch (error) {
        console.error('Failed to load background images:', error);
        setBackgroundPhotos([]);
      }
      setIsLoadingPhotos(false);
    };

    loadPhotos();
  }, []);

  // Background slideshow - change image every 7 seconds
  useEffect(() => {
    if (backgroundPhotos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBackgroundIndex(prev => (prev + 1) % backgroundPhotos.length);
    }, 7000); // 7 seconds

    return () => clearInterval(interval);
  }, [backgroundPhotos.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isAnimated) {
              entry.target.classList.add('animate-slide-up');
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
    <section id="about" className="section about-with-slideshow">
      {/* Background slideshow */}
      <div className="about-slideshow-background">
        {backgroundPhotos.length > 0 && (
          <>
            {backgroundPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className={`slideshow-image ${index === currentBackgroundIndex ? 'active' : ''}`}
                style={{
                  backgroundImage: `url(${photo.src})`,
                }}
              />
            ))}
            <div className="slideshow-overlay" />
          </>
        )}
      </div>
      
      {/* Content container */}
      <div className="container about-content about-content-left" ref={contentRef}>
        <h2>Our Story</h2>
        <div className="card about-card-left">
          <p>
            Mara and Sedd both came from humble beginnings, where every dollar counted and dreams 
            seemed distant. Mara grew up in a small apartment with her single mother, working part-time 
            jobs since she was sixteen to help pay the bills. Sedd was raised by his grandparents 
            after his parents passed away when he was young, learning the value of hard work and 
            perseverance from an early age.
          </p>
          <p>
            They met at the local community college where they both worked night shifts at the library 
            to pay for their education. Late nights organizing books turned into shared conversations 
            about their dreams and aspirations. Despite having little money for dates, they found joy 
            in simple moments - sharing a sandwich from the campus café, studying together under the 
            old oak tree, and supporting each other through every challenge.
          </p>
          <p>
            Through years of dedication and mutual support, they both graduated and built successful 
            careers. But more importantly, they built a love that was forged through shared struggles 
            and strengthened by their commitment to lifting each other up. Sedd proposed with a ring 
            he had been saving for two years, in the same library where they first fell in love.
          </p>
          <p>
            Today, they've learned that true wealth isn't measured in dollars, but in the love they 
            share and the dreams they've built together. We're excited to celebrate this beautiful 
            journey with all of you!
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
