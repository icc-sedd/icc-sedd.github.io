import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Interface for photo objects
interface Photo {
  id: number;
  src: string;
  alt: string;
}

// Function to shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Dynamic image loading function with specified gallery images
const loadGalleryImages = async (): Promise<Photo[]> => {
  // Predefined list of all images in the gallery folder
  const galleryImageFilenames = [
    'MAT05257.jpg',
    'MAT05441.jpg',
    'MAT05504.jpg',
    'MAT05592.jpg',
    'MAT05660.jpg',
    'MAT05895.jpg',
    'MAT05979.jpg',
    'MAT06071.jpg',
    'MAT06227.jpg',
    'MAT06244.jpg'
  ];

  try {
    // Try to fetch a gallery manifest file first (if it exists)
    const response = await fetch('/gallery/manifest.json');
    if (response.ok) {
      const manifest = await response.json();
      const manifestImages = manifest.images.map((filename: string, index: number) => ({
        id: index + 1,
        src: `/gallery/${filename}`,
        alt: `Wedding Photo ${index + 1}`
      }));
      // Randomize the manifest images
      return shuffleArray(manifestImages);
    }
  } catch (error) {
    console.log('No manifest.json found, using predefined image list...');
  }

  // Use the predefined list of gallery images
  const galleryImages = galleryImageFilenames.map((filename, index) => ({
    id: index + 1,
    src: `/gallery/${filename}`,
    alt: `Wedding Photo ${index + 1}`
  }));

  // Randomize the image order and return
  const shuffledImages = shuffleArray(galleryImages);
  console.log(`Loaded and randomized ${shuffledImages.length} images from gallery`);
  return shuffledImages;
};

// Individual tile component with smooth image cycling
const PhotoTile: React.FC<{ 
  tileIndex: number; 
  photos: any[]; 
  className: string;
  updateTrigger: number;
  isSelected: boolean;
  onHoverChange: (isHovered: boolean) => void;
  assignedImageIndex?: number;
  onImageIndexChange: (tileIndex: number, oldIndex: number, newIndex: number) => void;
  getNextUniqueImage?: (currentIndex: number) => number;
}> = ({ 
  tileIndex, 
  photos, 
  className,
  updateTrigger,
  isSelected,
  onHoverChange,
  assignedImageIndex,
  onImageIndexChange,
  getNextUniqueImage
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');

  // Initialize with assigned image or random starting image
  useEffect(() => {
    let startIndex: number;
    if (assignedImageIndex !== undefined) {
      startIndex = assignedImageIndex;
    } else {
      startIndex = Math.floor(Math.random() * photos.length);
    }
    setCurrentImageIndex(startIndex);
    setNextImageIndex(startIndex);
  }, [photos.length, assignedImageIndex]);

  // Smooth transition when this tile is selected for update (only if preview not open)
  useEffect(() => {
    if (isSelected && updateTrigger > 0 && !isPreviewOpen) {
      const currentIndex = currentImageIndex;
      let newIndex: number;
      
      // Use parent's unique image selection if available
      if (getNextUniqueImage) {
        newIndex = getNextUniqueImage(currentIndex);
      } else {
        // Fallback to random selection avoiding current image
        do {
          newIndex = Math.floor(Math.random() * photos.length);
        } while (newIndex === currentIndex && photos.length > 1);
      }
      
      // Notify parent of the image change
      onImageIndexChange(tileIndex, currentIndex, newIndex);
      
      // Start transition
      setNextImageIndex(newIndex);
      setIsTransitioning(true);
      
      // Complete transition after fade out
      setTimeout(() => {
        setCurrentImageIndex(newIndex);
        setIsTransitioning(false);
      }, 500); // Half of the transition duration
    }
  }, [updateTrigger, isSelected, currentImageIndex, photos.length, isPreviewOpen, tileIndex, onImageIndexChange, getNextUniqueImage]);

  // Handle click to open preview
  const handleClick = () => {
    setIsPreviewOpen(true);
    onHoverChange(true); // Still pause transitions when preview is open
    setPreviewImage(photos[currentImageIndex].src);
  };

  const handleClosePreview = () => {
    console.log('🔄 Closing preview...');
    setIsPreviewOpen(false);
    onHoverChange(false);
    setPreviewImage('');
  };

  // Handle escape key to close preview
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isPreviewOpen) {
        handleClosePreview();
      }
    };

    if (isPreviewOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isPreviewOpen]);

  const currentPhoto = photos[currentImageIndex];
  const nextPhoto = photos[nextImageIndex];

  return (
    <div 
      className={`photo-tile photos-animate-item ${className}`}
      onClick={handleClick}
    >
      <div className="tile-inner">
        {/* Current Image */}
        <img 
          src={currentPhoto.src} 
          alt={currentPhoto.alt}
          className={`tile-image current ${isTransitioning ? 'fade-out' : 'fade-in'}`}
          key={`current-${tileIndex}-${currentImageIndex}`}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            console.log(`Failed to load: ${currentPhoto.src}`);
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        {/* Next Image - for smooth transition */}
        {isTransitioning && (
          <img 
            src={nextPhoto.src} 
            alt={nextPhoto.alt}
            className="tile-image next fade-in"
            key={`next-${tileIndex}-${nextImageIndex}`}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              console.log(`Failed to load: ${nextPhoto.src}`);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        )}
        {/* Click hint overlay */}
        <div className="click-hint">
          <span>Click to preview</span>
        </div>
      </div>
      {/* Preview positioned outside tile container using Portal for proper full-screen display */}
      {isPreviewOpen && previewImage && createPortal(
        <div 
          className="tile-preview-large"
          onClick={(e) => {
            // Only close if clicking on the overlay itself, not on child elements
            if (e.target === e.currentTarget) {
              console.log('🔄 Backdrop clicked - closing preview');
              handleClosePreview();
            }
          }}
        >
          <div className="preview-modal">
            <button 
              className="preview-close-btn" 
              onClick={(e) => {
                e.stopPropagation();
                console.log('🔄 Close button clicked');
                handleClosePreview();
              }} 
              aria-label="Close preview"
            >
              ×
            </button>
            <img 
              src={previewImage} 
              alt="Large Preview"
              className="preview-image-large"
              loading="eager"
              decoding="async"
              onClick={(e) => e.stopPropagation()}
              onLoad={(e) => {
                const img = e.target as HTMLImageElement;
                console.log(`Image dimensions: ${img.naturalWidth}x${img.naturalHeight}`);
              }}
            />
            <div className="preview-info" onClick={(e) => e.stopPropagation()}>
              <p>Full Size Preview</p>
              <span className="preview-hint">Click outside the image, press ESC, or click × to close</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const Photos: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  const [currentTileSequence, setCurrentTileSequence] = useState(0);
  const [isAnyTileHovered, setIsAnyTileHovered] = useState(false);
  const [usedImages, setUsedImages] = useState<Set<number>>(new Set());
  const [tileImageAssignments, setTileImageAssignments] = useState<{ [key: number]: number }>({});
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);

  // Load photos dynamically on component mount
  useEffect(() => {
    const loadPhotos = async () => {
      setIsLoadingPhotos(true);
      try {
        const galleryImages = await loadGalleryImages();
        setPhotos(galleryImages);
        console.log(`Loaded ${galleryImages.length} images from gallery`);
      } catch (error) {
        console.error('Failed to load gallery images:', error);
        // Fallback to empty array or default images
        setPhotos([]);
      }
      setIsLoadingPhotos(false);
    };

    loadPhotos();
  }, []);

  // Initialize unique images for each tile (only after photos are loaded)
  useEffect(() => {
    if (photos.length === 0 || isLoadingPhotos) return;
    
    const numberOfTiles = 12; // Increased to 12 tiles for better coverage
    const assignments: { [key: number]: number } = {};
    const used = new Set<number>();
    
    for (let i = 0; i < numberOfTiles; i++) {
      let imageIndex: number;
      do {
        imageIndex = Math.floor(Math.random() * photos.length);
      } while (used.has(imageIndex) && used.size < photos.length);
      
      assignments[i] = imageIndex;
      used.add(imageIndex);
    }
    
    setTileImageAssignments(assignments);
    setUsedImages(used);
  }, [photos, isLoadingPhotos]);

  // Handle image index changes from tiles
  const handleImageIndexChange = (tileIndex: number, oldIndex: number, newIndex: number) => {
    setUsedImages(prev => {
      const newUsed = new Set(prev);
      newUsed.delete(oldIndex);
      newUsed.add(newIndex);
      return newUsed;
    });
    
    setTileImageAssignments(prev => ({
      ...prev,
      [tileIndex]: newIndex
    }));
  };

  // Get next available unique image
  const getNextUniqueImage = (currentIndex: number): number => {
    const availableImages = [];
    for (let i = 0; i < photos.length; i++) {
      if (i !== currentIndex && !usedImages.has(i)) {
        availableImages.push(i);
      }
    }
    
    if (availableImages.length === 0) {
      // If all images are used, allow reuse but avoid current
      return (currentIndex + 1) % photos.length;
    }
    
    return availableImages[Math.floor(Math.random() * availableImages.length)];
  };

  // Sequential tile updates every 5 seconds (paused when hovering)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnyTileHovered) {
        const numberOfTiles = 12; // Updated to 12 tiles for better layout
        
        // Update tiles in sequence: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, then repeat
        const nextTileIndex = currentTileSequence % numberOfTiles;
        
        setSelectedTileIndex(nextTileIndex);
        setUpdateTrigger(prev => prev + 1);
        setCurrentTileSequence(prev => prev + 1);
        
        // Clear selection after a brief moment to prepare for next update
        setTimeout(() => {
          setSelectedTileIndex(null);
        }, 100);
      }
    }, 7000); // 7 seconds

    return () => clearInterval(interval);
  }, [currentTileSequence, isAnyTileHovered]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isAnimated) {
              const container = entry.target as HTMLElement;
              const animateItems = container.querySelectorAll('.photos-animate-item');
              
              container.classList.add('animate-slide-up');
              
              // Staggered animation for photo tiles
              animateItems.forEach((item, index) => {
                setTimeout(() => {
                  item.classList.add('animate-slide-up');
                }, index * 100); // 100ms delay between each tile
              });
              
              setIsAnimated(true);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );

      if (contentRef.current) {
        observer.observe(contentRef.current);
      }

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [isAnimated]);

  // Handle hover state changes from tiles
  const handleTileHoverChange = (isHovered: boolean) => {
    setIsAnyTileHovered(isHovered);
  };

  // Create tiles (optimized layout with 12 tiles)
  const numberOfTiles = 12;

  // Show loading state while photos are being loaded
  if (isLoadingPhotos) {
    return (
      <section id="photos" className="section">
        <div className="container photos-content" ref={contentRef}>
          <h2>Our Memories</h2>
          <p className="photos-subtitle">Loading our beautiful memories...</p>
          <div className="photo-grid">
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '2rem',
              color: '#666'
            }}>
              📸 Discovering gallery images...
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show message if no photos found
  if (photos.length === 0) {
    return (
      <section id="photos" className="section">
        <div className="container photos-content" ref={contentRef}>
          <h2>Our Memories</h2>
          <p className="photos-subtitle">A glimpse into our beautiful journey together</p>
          <div className="photo-grid">
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '2rem',
              color: '#666'
            }}>
              📷 No images found in gallery. Please add some photos to the /public/gallery/ folder.
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="photos" className="section">
      <div className="container photos-content" ref={contentRef}>
        <h2>Our Memories</h2>
        <p className="photos-subtitle">A glimpse into our beautiful journey together</p>
        
        <div className="photo-grid">
          {Array.from({ length: numberOfTiles }, (_, index) => (
            <PhotoTile
              key={index}
              tileIndex={index}
              photos={photos}
              className={getTileSize(index)}
              updateTrigger={updateTrigger}
              isSelected={selectedTileIndex === index}
              onHoverChange={handleTileHoverChange}
              assignedImageIndex={tileImageAssignments[index]}
              onImageIndexChange={handleImageIndexChange}
              getNextUniqueImage={getNextUniqueImage}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Function to assign different tile sizes (Windows 8 style) - Optimized for better layout
const getTileSize = (index: number): string => {
  // Pattern optimized for 4-column grid with 12 tiles to fill empty spaces
  const sizePattern = [
    'large',   // 0: 2x2
    'small',   // 1: 1x1  
    'small',   // 2: 1x1
    'medium',  // 3: 2x1
    'small',   // 4: 1x1
    'small',   // 5: 1x1
    'large',   // 6: 2x2
    'medium',  // 7: 2x1
    'small',   // 8: 1x1
    'small',   // 9: 1x1
    'small',   // 10: 1x1
    'small'    // 11: 1x1
  ];
  return sizePattern[index % sizePattern.length];
};

export default Photos;
