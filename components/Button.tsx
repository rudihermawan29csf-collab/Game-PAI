
import React from 'react';
import { audioManager } from '../services/audio';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'neutral';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  onClick,
  ...props 
}) => {
  // Roblox/Game style: Thick borders, bottom border for 3D effect, bright colors
  const baseStyles = "px-4 py-2 rounded-xl font-bold transition-all transform active:translate-y-1 active:border-b-0 border-b-4 relative";
  
  const variants = {
    primary: "bg-blue-500 border-blue-700 text-white hover:bg-blue-400 border-b-blue-800",
    secondary: "bg-green-500 border-green-700 text-white hover:bg-green-400 border-b-green-800",
    danger: "bg-red-500 border-red-700 text-white hover:bg-red-400 border-b-red-800",
    neutral: "bg-slate-100 border-slate-300 text-slate-700 hover:bg-white border-b-slate-400",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Play sound via service
      // Note: We don't play click sound here if it's the main quiz button or controls, 
      // as they might trigger their own specific sounds, but generic buttons will click.
      // For consistency, let's keep it simple: specific buttons in App.tsx might play specific sounds,
      // but UI feedback is good everywhere.
      // However, App.tsx's handleAction also plays 'click'. To avoid double sounds,
      // we can check if onClick is provided.
      
      // Actually, relying on the parent to play sound (like in Controls/App) is safer for logic flow,
      // BUT for pure UI feedback, playing a short 'pop' here is great for "Game Feel".
      // Let's rely on App.tsx/Controls.tsx calling the audioManager for logic-based sounds,
      // but we can add a very subtle hover sound or similar if needed. 
      // For now, let's NOT auto-play here to avoid double-playing with the logic in App.tsx.
      
      if (onClick) {
          onClick(e);
      }
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
