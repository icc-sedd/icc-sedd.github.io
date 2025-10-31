import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Close menu when a link is clicked
    setIsOpen(false);
    
    // Clear any existing timer
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      setAutoCloseTimer(null);
    }
  };

  const handleBrandClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    // Scroll to top of page smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Close mobile menu if open
    setIsOpen(false);
    
    // Clear any existing timer
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      setAutoCloseTimer(null);
    }
  };

  // Handle scroll effect and active section detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
      
      // Detect active section based on scroll position
      const sections = ['about', 'entourage', 'details', 'what-to-wear', 'photos'];
      const sectionElements = sections.map(id => document.getElementById(id));
      
      let currentSection = 'about';
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            currentSection = sections[i];
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update sliding bar position when active section changes
  useEffect(() => {
    const updateSlidingBar = () => {
      const navMenu = document.querySelector('.navbar-menu') as HTMLElement;
      const activeLink = document.querySelector('.navbar-menu a.active') as HTMLElement;
      
      if (navMenu && activeLink) {
        const navMenuRect = navMenu.getBoundingClientRect();
        const activeLinkRect = activeLink.getBoundingClientRect();
        
        const left = activeLinkRect.left - navMenuRect.left;
        const width = activeLinkRect.width;
        
        navMenu.style.setProperty('--slider-left', `${left}px`);
        navMenu.style.setProperty('--slider-width', `${width}px`);
      }
    };

    // Small delay to ensure DOM is updated
    const timer = setTimeout(updateSlidingBar, 50);
    
    return () => clearTimeout(timer);
  }, [activeSection]);

  // Initialize sliding bar position on component mount
  useEffect(() => {
    const initializeSlidingBar = () => {
      const navMenu = document.querySelector('.navbar-menu') as HTMLElement;
      const firstLink = document.querySelector('.navbar-menu a') as HTMLElement;
      
      if (navMenu && firstLink) {
        const navMenuRect = navMenu.getBoundingClientRect();
        const firstLinkRect = firstLink.getBoundingClientRect();
        
        const left = firstLinkRect.left - navMenuRect.left;
        const width = firstLinkRect.width;
        
        navMenu.style.setProperty('--slider-left', `${left}px`);
        navMenu.style.setProperty('--slider-width', `${width}px`);
      }
    };

    // Initialize after component mounts
    const timer = setTimeout(initializeSlidingBar, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Auto-close menu functionality
  useEffect(() => {
    if (isOpen) {
      // Set auto-close timer when menu opens
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 3000); // 3 seconds delay
      
      setAutoCloseTimer(timer);
      
      // Cleanup function
      return () => {
        clearTimeout(timer);
      };
    } else {
      // Clear timer if menu is closed manually
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        setAutoCloseTimer(null);
      }
    }
  }, [isOpen]);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div className="navbar-brand">
          <a href="#" onClick={handleBrandClick}>
            <span className="brand-text">Sedd & Mara</span>
            <span className="brand-date">December 13, 2025</span>
          </a>
        </div>

        {/* Hamburger Button */}
        <button 
          className={`navbar-hamburger ${isOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Menu */}
        <ul className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          <li><a href="#about" onClick={handleNavClick} className={activeSection === 'about' ? 'active' : ''}>Our Story</a></li>
          <li><a href="#entourage" onClick={handleNavClick} className={activeSection === 'entourage' ? 'active' : ''}>Entourage</a></li>
          <li><a href="#details" onClick={handleNavClick} className={activeSection === 'details' ? 'active' : ''}>Wedding Details</a></li>
          <li><a href="#what-to-wear" onClick={handleNavClick} className={activeSection === 'what-to-wear' ? 'active' : ''}>What to Wear</a></li>
          <li><a href="#photos" onClick={handleNavClick} className={activeSection === 'photos' ? 'active' : ''}>Photos</a></li>
        </ul>
        
        {/* Spacer for layout balance */}
        <div className="navbar-spacer"></div>
      </div>
    </nav>
  );
};

export default Navbar;
