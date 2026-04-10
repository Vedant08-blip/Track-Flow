import React, { useState } from 'react';
import { motion } from 'framer-motion';

const InteractiveLogo = ({ collapsed = false, size = 'normal' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeMap = {
    small: { container: 'w-6 h-6', text: 'text-sm' },
    normal: { container: 'w-8 h-8', text: 'text-lg' },
    large: { container: 'w-12 h-12', text: 'text-3xl' }
  };

  const currentSize = sizeMap[size];

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center gap-2"
    >
      {/* Interactive Logo Container */}
      <motion.div
        className={`${currentSize.container} rounded-lg overflow-hidden shadow-lg shadow-blue-500/30 flex-shrink-0 relative group cursor-pointer`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600"
          animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
        />

        {/* Pulsing inner glow */}
        <motion.div
          className="absolute inset-0 bg-white/20"
          animate={isHovered ? { opacity: [0.2, 0.4, 0.2] } : { opacity: 0.2 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Logo content */}
        <div className="relative w-full h-full flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Center dot */}
            <circle cx="50" cy="50" r="8" fill="white" />

            {/* Horizontal flow indicator */}
            <motion.rect
              x="20"
              y="45"
              width="60"
              height="10"
              rx="5"
              fill="white"
              opacity="0.6"
              animate={isHovered ? { x: [20, 25, 20] } : { x: 20 }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />

            {/* Vertical flow indicator */}
            <motion.rect
              x="45"
              y="20"
              width="10"
              height="60"
              rx="5"
              fill="white"
              opacity="0.6"
              animate={isHovered ? { y: [20, 25, 20] } : { y: 20 }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
            />

            {/* Orbiting dot 1 */}
            <motion.circle
              cx="50"
              cy="30"
              r="3"
              fill="white"
              animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
              origin="50px 50px"
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />

            {/* Orbiting dot 2 */}
            <motion.circle
              cx="70"
              cy="50"
              r="3"
              fill="white"
              animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
              origin="50px 50px"
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.5 }}
            />

            {/* Orbiting dot 3 */}
            <motion.circle
              cx="50"
              cy="70"
              r="3"
              fill="white"
              animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
              origin="50px 50px"
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1 }}
            />
          </svg>
        </div>
      </motion.div>

      {/* Logo Text */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <span className={`font-bold tracking-tight ${currentSize.text} text-slate-900 dark:text-white`}>
            TrackFlow
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Flow Tracking
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InteractiveLogo;
