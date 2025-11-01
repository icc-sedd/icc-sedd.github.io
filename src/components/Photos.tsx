import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ImagePreloader from './ImagePreloader';

// Interface for photo objects
interface Photo {
  id: number;
  src: string;
  alt: string;
}

// Dynamic image loading function
const loadGalleryImages = async (): Promise<Photo[]> => {
  console.log('🔍 Starting to load gallery images...');

  try {
    // Try to fetch a gallery manifest file first (if it exists)
    console.log('📋 Attempting to fetch manifest.json...');
    const response = await fetch(`${process.env.PUBLIC_URL || ''}/gallery/manifest.json`);
    if (response.ok) {
      const manifest = await response.json();
      console.log('✅ Manifest loaded successfully:', manifest);
      const manifestImages = manifest.images.map((filename: string, index: number) => ({
        id: index + 1,
        src: `${process.env.PUBLIC_URL || ''}/gallery/${filename}`,
        alt: `Wedding Photo ${index + 1}`
      }));
      console.log('📸 Images from manifest:', manifestImages);
      return manifestImages;
    }
  } catch (error) {
    console.log('⚠️ No manifest.json found, using predefined image list...', error);
  }

  // Updated list of all images in the gallery folder
  const galleryImageFilenames = [
    'MAT05252.jpg',
    'MAT05257.jpg',
    'MAT05343.jpg',
    'MAT05441.jpg',
    'MAT05504.jpg',
    'MAT05592.jpg',
    'MAT05614.jpg',
    'MAT05660.jpg',
    'MAT05797.jpg',
    'MAT05798.jpg',
    'MAT05895.jpg',
    'MAT05979.jpg',
    'MAT06063.jpg',
    'MAT06071.jpg',
    'MAT06172.jpg',
    'MAT06227.jpg',
    'MAT06244.jpg'
  ];

  // Use the predefined list of gallery images
  const galleryImages = galleryImageFilenames.map((filename, index) => ({
    id: index + 1,
    src: `${process.env.PUBLIC_URL || ''}/gallery/${filename}`,
    alt: `Wedding Photo ${index + 1}`
  }));

  console.log(`📂 Loaded ${galleryImages.length} images from predefined list:`, galleryImages);
  return galleryImages;
};

// Lightbox Component
const Lightbox: React.FC<{
  images: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}> = ({ images, currentIndex, isOpen, onClose, onNext, onPrev }) => {
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrev();
          break;
        case 'ArrowRight':
          onNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen) return null;

  return createPortal(
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-container">
        <button 
          className="lightbox-close" 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }} 
          aria-label="Close"
        >
          ×
        </button>
        
        <button 
          className="lightbox-prev" 
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }} 
          aria-label="Previous"
        >
          ‹
        </button>
        
        <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
          <img
            src={images[currentIndex]?.src}
            alt={images[currentIndex]?.alt}
            className="lightbox-image"
          />
          <div className="lightbox-counter">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
        
        <button 
          className="lightbox-next" 
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }} 
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>,
    document.body
  );
};

// Individual Gallery Item Component
const GalleryItem: React.FC<{
  photo: Photo;
  onClick: () => void;
}> = ({ photo, onClick }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    console.log(`✅ Image loaded successfully: ${photo.src}`);
  };

  const handleImageError = () => {
    setImageError(true);
    console.error(`❌ Failed to load image: ${photo.src}`);
  };

  // Add animation class when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && itemRef.current) {
            itemRef.current.classList.add('animate-slide-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="gallery-item" onClick={onClick} ref={itemRef}>
      <div className="gallery-item-inner">
        {!imageLoaded && !imageError && (
          <div className="gallery-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
        {imageError && (
          <div className="gallery-error">
            <span>❌</span>
            <p>Failed to load image</p>
          </div>
        )}
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          className="gallery-image"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        <div className="gallery-overlay">
          <div className="gallery-overlay-content">
            <span className="gallery-icon">🔍</span>
            <span className="gallery-text">View Photo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Photos: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState({ loaded: 0, total: 0 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Load photos list on component mount
  useEffect(() => {
    const loadPhotos = async () => {
      setIsLoadingPhotos(true);
      try {
        const galleryImages = await loadGalleryImages();
        setPhotos(galleryImages);
        console.log(`📊 Gallery images loaded:`, galleryImages);
      } catch (error) {
        console.error('💥 Failed to load gallery images:', error);
        setPhotos([]);
      }
      setIsLoadingPhotos(false);
    };

    loadPhotos();
  }, []);

  // Handle preload completion
  const handlePreloadComplete = () => {
    setImagesPreloaded(true);
    console.log('🎉 All gallery images preloaded!');
  };

  // Handle preload progress
  const handlePreloadProgress = (loaded: number, total: number) => {
    setPreloadProgress({ loaded, total });
    console.log(`📊 Preload progress: ${loaded}/${total}`);
  };

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % photos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  // Loading/Preloading state
  if (isLoadingPhotos || !imagesPreloaded) {
    const progressPercent = preloadProgress.total > 0 
      ? Math.round((preloadProgress.loaded / preloadProgress.total) * 100) 
      : 0;

    return (
      <section id="photos" className="section">
        <div className="container">
          <div className="gallery-header">
            <h2>Our Memories</h2>
            <p>
              {isLoadingPhotos 
                ? 'Loading our beautiful moments...' 
                : `Preloading images... ${preloadProgress.loaded}/${preloadProgress.total} (${progressPercent}%)`
              }
            </p>
          </div>
          <div className="gallery-loading">
            <div className="loading-spinner"></div>
          </div>
        </div>
        {/* Image Preloader */}
        {!isLoadingPhotos && photos.length > 0 && (
          <ImagePreloader
            imageSrcs={photos.map(photo => photo.src)}
            onAllImagesLoaded={handlePreloadComplete}
            onProgressUpdate={handlePreloadProgress}
          />
        )}
      </section>
    );
  }

  // No photos state
  if (photos.length === 0) {
    return (
      <section id="photos" className="section">
        <div className="container">
          <div className="gallery-header">
            <h2>Our Memories</h2>
            <p>No photos found. Please add images to the gallery folder.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="photos" className="section">
      <div className="container" ref={contentRef}>
        <div className="gallery-header">
          <h2>Our Memories</h2>
          <p>A glimpse into our beautiful journey together</p>
        </div>
        
        <div className="gallery-grid">
          {photos.map((photo, index) => (
            <GalleryItem
              key={photo.id}
              photo={photo}
              onClick={() => openLightbox(index)}
            />
          ))}
        </div>
        
        <Lightbox
          images={photos}
          currentIndex={currentImageIndex}
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      </div>
    </section>
  );
};

export default Photos;
