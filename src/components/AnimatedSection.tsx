import React, { ReactNode } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animationType?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleUp';
  delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animationType = 'fadeIn',
  delay = 0
}) => {
  const { elementRef, isVisible } = useScrollAnimation();

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-[560ms] ease-out';
    
    if (!isVisible) {
      switch (animationType) {
        case 'slideUp':
          return `${baseClasses} opacity-0 transform translate-y-8`;
        case 'slideLeft':
          return `${baseClasses} opacity-0 transform translate-x-8`;
        case 'slideRight':
          return `${baseClasses} opacity-0 transform -translate-x-8`;
        case 'scaleUp':
          return `${baseClasses} opacity-0 transform scale-95`;
        default:
          return `${baseClasses} opacity-0`;
      }
    }
    
    return `${baseClasses} opacity-100 transform translate-x-0 translate-y-0 scale-100`;
  };

  return (
    <div
      ref={elementRef}
      className={`${getAnimationClasses()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;