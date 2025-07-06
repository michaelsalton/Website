'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center py-8 px-4 bg-black/20 backdrop-blur-sm snap-start"
    >
      <div className="max-w-7xl mx-auto text-center text-gray-400">
        <p>© {new Date().getFullYear()} Michael Salton. All rights reserved.</p>
      </div>
    </motion.footer>
  );
} 