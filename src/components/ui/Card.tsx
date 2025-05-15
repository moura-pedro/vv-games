import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn(
        'bg-white/10 backdrop-blur-sm rounded-xl p-6',
        'border border-white/10 shadow-xl',
        'transition-all duration-200 ease-out',
        className
      )}
    >
      {children}
    </motion.div>
  );
}