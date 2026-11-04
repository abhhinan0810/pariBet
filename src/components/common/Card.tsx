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
  const baseClasses = 'rounded-2xl transition-all duration-200 overflow-hidden';

  const variantClasses = {
    default: 'bg-background-card border border-white/5',
    elevated: 'bg-background-elevated border border-white/10 shadow-card-glow',
    'gold-border': 'bg-background-card border border-gold/30 shadow-gold-glow-sm',
    interactive:
      'bg-background-card border border-white/5 hover:border-gold/40 hover:shadow-gold-glow-sm cursor-pointer',
  }[variant];

  return (
    <motion.div className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </motion.div>
  );
};

