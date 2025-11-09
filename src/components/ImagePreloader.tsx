import React, { useEffect, useState } from 'react';
import ImageCache from '../utils/ImageCache';

interface ImagePreloaderProps {
  imageSrcs: string[];
  onAllImagesLoaded: () => void;
  onProgressUpdate?: (loaded: number, total: number) => void;
}

const ImagePreloader: React.FC<ImagePreloaderProps> = ({ 
  imageSrcs, 
  onAllImagesLoaded, 
  onProgressUpdate 
}) => {
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    // Temporarily disabled - immediately call onAllImagesLoaded
    console.log('⚠️ ImagePreloader: Functionality temporarily disabled');
    onAllImagesLoaded();
    
    /* ORIGINAL CODE - TEMPORARILY DISABLED
    if (imageSrcs.length === 0) {
      onAllImagesLoaded();
      return;
    }

    let completedCount = 0;
    const totalImages = imageSrcs.length;

    const loadImages = async () => {
      const loadPromises = imageSrcs.map(async (src) => {
        try {
          await ImageCache.preloadImage(src);
          completedCount++;
          setLoadedCount(completedCount);
          onProgressUpdate?.(completedCount, totalImages);
          console.log(`✅ Preloaded: ${src} (${completedCount}/${totalImages})`);
        } catch (error) {
          completedCount++;
          setLoadedCount(completedCount);
          onProgressUpdate?.(completedCount, totalImages);
          console.warn(`❌ Failed to preload: ${src}`, error);
        }
      });

      await Promise.all(loadPromises);
      console.log(`🎉 All ${totalImages} images processed. Cache size: ${ImageCache.getCacheSize()}`);
      onAllImagesLoaded();
    };

    loadImages();
    */
  }, [imageSrcs, onAllImagesLoaded, onProgressUpdate]);

  return null; // This component doesn't render anything
};

export default ImagePreloader;
