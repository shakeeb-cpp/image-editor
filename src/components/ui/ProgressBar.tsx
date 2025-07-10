import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  isVisible: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'orange';
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  isVisible,
  label,
  size = 'md',
  color = 'blue',
  showPercentage = true,
}) => {
  if (!isVisible) return null;

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  const backgroundColorClasses = {
    blue: 'bg-blue-900/20',
    green: 'bg-green-900/20',
    purple: 'bg-purple-900/20',
    orange: 'bg-orange-900/20',
  };

  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full space-y-1">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs">
          {label && (
            <span className="text-gray-300 font-medium">{label}</span>
          )}
          {showPercentage && (
            <span className="text-gray-400">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      
      <div className={`w-full ${backgroundColorClasses[color]} rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        >
          {/* Animated shimmer effect */}
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
