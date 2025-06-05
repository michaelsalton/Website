'use client';

import { motion } from 'framer-motion';

export default function SectionDivider() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="h-20 relative overflow-hidden"
    >
      {/* Natural-looking divider */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="relative">
            {/* Main line */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-900/20 to-transparent" />
            
            {/* Decorative elements */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-amber-900/30" />
              <div className="w-2 h-2 rounded-full bg-amber-900/40" />
              <div className="w-1 h-1 rounded-full bg-amber-900/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent opacity-50" />
    </motion.div>
  );
} 