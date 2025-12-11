
import React, { useState } from 'react';
import { GameAction } from '../types';
import Button from './Button';
import { Send, Compass, Eye, MessageCircle, Volume2, VolumeX } from 'lucide-react';

interface ControlsProps {
  onAction: (action: string) => void;
  isLoading: boolean;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onAction, isLoading, isMuted, onToggleMute }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onAction(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 z-30 flex flex-col md:flex-row items-end justify-between gap-4 pointer-events-none">
      
      {/* Left Spacer (Chat covers this area) */}
      <div className="hidden md:block w-1/3"></div>

      {/* Center: Action Bar (Visible Input) */}
      <div className="w-full md:w-1/3 pointer-events-auto">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ketik perintah..."
            className="flex-1 bg-slate-900/80 backdrop-blur-md border-2 border-white/20 rounded-xl px-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 font-bold shadow-lg"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            variant="primary"
            className="aspect-square flex items-center justify-center p-0 w-12"
            disabled={isLoading || !inputValue.trim()}
          >
            <Send size={20} />
          </Button>
        </form>
      </div>

      {/* Right: Game Pad Controls */}
      <div className="w-full md:w-auto flex flex-wrap justify-end gap-2 pointer-events-auto">
        
        {/* Settings Cluster */}
        <div className="flex gap-1 bg-black/20 p-2 rounded-2xl backdrop-blur-sm mr-2">
            <Button variant="neutral" onClick={onToggleMute} className="aspect-square p-0 w-10 flex items-center justify-center">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </Button>
        </div>

        {/* Navigation Cluster */}
        <div className="flex gap-1 bg-black/20 p-2 rounded-2xl backdrop-blur-sm">
           <Button variant="secondary" onClick={() => onAction(GameAction.WEST)} title="Barat">
              <Compass className="rotate-90" />
           </Button>
           <div className="flex flex-col gap-1">
             <Button variant="secondary" onClick={() => onAction(GameAction.NORTH)} title="Utara">
                <Compass className="rotate-180" />
             </Button>
             <Button variant="secondary" onClick={() => onAction(GameAction.SOUTH)} title="Selatan">
                <Compass />
             </Button>
           </div>
           <Button variant="secondary" onClick={() => onAction(GameAction.EAST)} title="Timur">
              <Compass className="-rotate-90" />
           </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
            <Button variant="neutral" onClick={() => onAction(GameAction.LOOK)} className="flex items-center gap-2">
                <Eye size={18} />
                <span className="hidden md:inline">Lihat</span>
            </Button>
            <Button variant="neutral" onClick={() => onAction(GameAction.TALK)} className="flex items-center gap-2">
                <MessageCircle size={18} />
                <span className="hidden md:inline">Bicara</span>
            </Button>
        </div>

      </div>
    </div>
  );
};

export default Controls;
