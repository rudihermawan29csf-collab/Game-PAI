
import React from 'react';
import { GameState } from '../types';
import { MapPin, Star, Scroll } from 'lucide-react';

interface DashboardProps {
  state: GameState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 z-30 pointer-events-none flex justify-between items-start">
      
      {/* Top Left: Location Pill */}
      <div className="flex flex-col gap-2 pointer-events-auto">
        <div className="bg-slate-900/80 text-white px-4 py-2 rounded-full border-2 border-white/20 flex items-center gap-2 shadow-lg backdrop-blur-md">
          <MapPin className="text-blue-400 fill-blue-400/20" size={20} />
          <span className="font-bold text-lg text-shadow">{state.location || "Lokasi Tidak Diketahui"}</span>
        </div>
      </div>

      {/* Top Right: Stats Pills */}
      <div className="flex gap-3 pointer-events-auto">
        {/* Sheets Counter */}
        <div className="bg-slate-900/80 text-white px-4 py-2 rounded-xl border-b-4 border-slate-700 flex items-center gap-2 shadow-lg">
          <Scroll className="text-yellow-200" size={20} />
          <div className="flex flex-col leading-none">
            <span className="text-xs text-slate-400 font-bold uppercase">Lembaran</span>
            <span className="font-black text-xl">{state.sheets}/8</span>
          </div>
        </div>

        {/* XP Score */}
        <div className="bg-yellow-500 text-white px-4 py-2 rounded-xl border-b-4 border-yellow-700 flex items-center gap-2 shadow-lg">
          <Star className="text-white fill-white" size={20} />
          <div className="flex flex-col leading-none text-shadow">
            <span className="text-xs text-yellow-100 font-bold uppercase">Skor</span>
            <span className="font-black text-xl">{state.score} XP</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
