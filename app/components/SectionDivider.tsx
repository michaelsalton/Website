'use client';

import { motion } from 'framer-motion';

export default function SectionDivider() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="h-32 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-theme-mid/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-theme-mid/5 to-transparent" />
    </motion.div>
  );
} 