'use client';

import { motion } from 'framer-motion';

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  in: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

export default function AnimatedCard({ children, className = '', index = 0, onClick }) {
  const isInteractive = !!onClick;
  
  const baseClasses = `glass-panel overflow-hidden relative group ${
    isInteractive ? 'cursor-pointer' : ''
  } ${className}`;

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileInView="in"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05 }}
      whileHover={isInteractive ? { y: -4, scale: 1.01 } : {}}
      whileTap={isInteractive ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={baseClasses}
    >
      {/* Subtle interactive shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 pointer-events-none transform -translate-x-full group-hover:translate-x-full ease-out" />
      {children}
    </motion.div>
  );
}
