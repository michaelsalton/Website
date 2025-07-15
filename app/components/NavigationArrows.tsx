'use client';

import { motion } from 'framer-motion';

interface NavigationArrowsProps {
  onScrollUp?: () => void;
  onScrollDown?: () => void;
  showUpArrow?: boolean;
  showDownArrow?: boolean;
}

export default function NavigationArrows({ 
  onScrollUp, 
  onScrollDown, 
  showUpArrow = true, 
  showDownArrow = true 
}: NavigationArrowsProps) {
  return (
    <>
      {/* Up Arrow */}
      {showUpArrow && onScrollUp && (
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
          onClick={onScrollUp}
        >
          <svg 
            className="w-8 h-8 md:w-8 md:h-8 sm:w-12 sm:h-12 text-theme-accent/50 hover:text-theme-accent transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </motion.div>
      )}

      {/* Down Arrow */}
      {showDownArrow && onScrollDown && (
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
          onClick={onScrollDown}
        >
          <svg 
            className="w-8 h-8 md:w-8 md:h-8 sm:w-12 sm:h-12 text-theme-accent/50 hover:text-theme-accent transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </motion.div>
      )}
    </>
  );
} 