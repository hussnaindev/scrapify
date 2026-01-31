/**
 * Logo component for Scrapify
 * Displays the Scrapify logo (contains both image and text)
 */

import React from 'react';

// Logo path - public folder assets are served from root in Vite
const logoSrc = '/logo.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'xl' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-20 w-auto',
    '2xl': 'h-24 w-auto'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoSrc}
        alt="Scrapify Logo"
        className={`${sizeClasses[size]} object-contain`}
      />
    </div>
  );
};

export default Logo;

