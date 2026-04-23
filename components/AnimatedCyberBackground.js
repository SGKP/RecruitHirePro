'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AnimatedCyberBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 z-[-1] bg-[#03010b]" />;
  }

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#03010b]">
      {/* Dynamic Purple Bottom Glow (as seen in Figma) */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -bottom-1/4 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] rounded-[100%] bg-gradient-to-t from-[#4c1d95] via-[#2e1065] to-transparent blur-[80px] pointer-events-none"
      />

      {/* Perspective Curved Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #8b5cf6 1px, transparent 1px),
            linear-gradient(to bottom, #8b5cf6 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          transform: 'perspective(1000px) rotateX(60deg) scale(2.5) translateY(20%)',
          transformOrigin: 'bottom',
          maskImage: 'linear-gradient(to bottom, transparent 10%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 10%, black 100%)'
        }}
      />

      {/* Another subtle light behind the robot on the right */}
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#3b82f6] blur-[120px] mix-blend-screen pointer-events-none"
      />

      {/* The Animated Hovering Robot */}
      <motion.div
        animate={{
          y: [-15, 15, -15],
          rotate: [-1, 1, -1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute right-[-5%] lg:right-[5%] xl:right-[10%] top-[15%] w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] xl:w-[700px] xl:h-[700px] pointer-events-none opacity-90"
        style={{
          // mix-blend-screen removes the black background from the AI generated image, leaving only the glowing robot
          mixBlendMode: 'screen',
        }}
      >
        <img 
          src="/images/robot.png" 
          alt="AI Robot" 
          className="w-full h-full object-contain filter contrast-125 saturate-150"
        />
      </motion.div>

      {/* Dark overlay to ensure left-side UI readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#03010b] via-[#03010b]/80 to-transparent pointer-events-none" />
    </div>
  );
}
