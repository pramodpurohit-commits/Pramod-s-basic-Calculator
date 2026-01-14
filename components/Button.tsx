
import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'action' | 'equal';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'number', className = '' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'operator':
        return 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/20';
      case 'action':
        return 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/30';
      case 'equal':
        return 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20';
      default:
        return 'bg-slate-800/40 text-slate-100 hover:bg-slate-800 border border-slate-700/30';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`h-14 md:h-16 rounded-2xl text-xl font-medium transition-all duration-200 active:scale-95 flex items-center justify-center ${getVariantStyles()} ${className}`}
    >
      {label}
    </button>
  );
};
