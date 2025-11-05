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
  
let About = null;

  return About;

};

export default About;
