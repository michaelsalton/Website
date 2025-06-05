'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-theme-darker/20 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-theme-light text-xl font-bold">
              MS
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-baseline space-x-4">
              <Link href="#about" className="text-theme-mid hover:text-theme-light px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              <Link href="#projects" className="text-theme-mid hover:text-theme-light px-3 py-2 rounded-md text-sm font-medium">
                Projects
              </Link>
              <Link href="#contact" className="text-theme-mid hover:text-theme-light px-3 py-2 rounded-md text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
} 