'use client';

import { useEffect, useState } from 'react';

export default function ScrollIndicator() {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    console.log('ScrollIndicator component mounted');
    
    const updateScrollPosition = () => {
      const scrollTop = window.scrollY;
      const sections = document.querySelectorAll('.snap-start');
      const sectionCount = sections.length;
      const currentSection = Math.floor(scrollTop / window.innerHeight);
      const percentage = sectionCount > 1 ? currentSection / (sectionCount - 1) : 0;
      
      setScrollPercentage(percentage);
      console.log('Scroll:', scrollTop, 'Sections:', sectionCount, 'CurrentSection:', currentSection, 'Percentage:', percentage);
    };

    // Initial calculation
    updateScrollPosition();

    // Add scroll event listener
    window.addEventListener('scroll', updateScrollPosition, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', updateScrollPosition);
    };
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        right: '15px',
        top: '20px',
        width: '3px',
        height: '60px',
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '2px',
        opacity: 0.7,
        pointerEvents: 'none',
        zIndex: 1000,
        transform: `translateY(${80 * scrollPercentage}vh)`,
        transition: 'transform 0.1s ease-out'
      }}
    />
  );
} 