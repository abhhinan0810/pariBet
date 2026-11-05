import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'elevated' | 'gold-border' | 'interactive';
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-200 overflow-hidden backdrop-blur-xl';

  const variantClasses = {
    default: 'bg-black/35 backdrop-blur-xl border border-white/10 shadow-xl',
    elevated: 'bg-black/45 backdrop-blur-2xl border border-white/10 shadow-card-glow',
    'gold-border': 'bg-black/40 backdrop-blur-xl border border-amber-500/30 shadow-card-glow',
    interactive:
      'bg-black/35 backdrop-blur-xl border border-white/10 hover:border-red-500/40 hover:bg-[#140b10]/55 hover:shadow-card-glow cursor-pointer',
  }[variant];

  return (
    <motion.div className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </motion.div>
  );
};

