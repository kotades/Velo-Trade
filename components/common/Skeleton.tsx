import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rect' | 'circle';
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width, 
  height, 
  variant = 'rect' 
}) => {
  const baseStyles = "bg-[hsl(var(--color-surface))] animate-pulse overflow-hidden relative";
  const variantStyles = {
    text: "h-3 w-full rounded",
    rect: "rounded-xl",
    circle: "rounded-full"
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`} 
      style={style}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shine" />
    </div>
  );
};

export default Skeleton;
