import React from 'react';

interface SkeletonProps {
  height?: string;
  width?: string;
  condition?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Skeleton: React.FC<SkeletonProps> = ({
  height = 'h-4',
  width = 'w-full',
  condition = true,
  className = '',
  children
}) => {

  if (condition) return <>{children}</>;

  return (
    <div
      className={`animate-pulse bg-gray-300 rounded ${className}`}
      style={{ height, width }}
    />
  );
};

export default Skeleton;