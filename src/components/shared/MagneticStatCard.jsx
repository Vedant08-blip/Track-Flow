import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const MagneticStatCard = ({ title, subtitle }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 280, damping: 20, mass: 0.5 });
  const ySpring = useSpring(y, { stiffness: 280, damping: 20, mass: 0.5 });

  const handleMove = (event) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    const strength = 0.18;
    x.set(offsetX * strength);
    y.set(offsetY * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: xSpring, y: ySpring }}
      className="relative overflow-hidden rounded-xl border border-white/15 bg-white/5 px-4 py-3 shadow-md shadow-black/30 backdrop-blur-xl transition-transform duration-300 hover:shadow-primary/30"
    >
      <div className="absolute -right-6 -top-6 h-14 w-14 rounded-full bg-primary/20 blur-2xl" />
      <p className="text-lg font-black text-white tracking-tight">{title}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300">
        {subtitle}
      </p>
    </motion.div>
  );
};

export default MagneticStatCard;
