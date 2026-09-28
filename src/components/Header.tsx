import React from 'react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onCityClick: () => void;
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ setActiveTab, onCityClick, onProfileClick }) => {
  return (
    <header className="sticky top-0 w-full z-50 pt-safe bg-[#121214]/90 backdrop-blur-xl border-b border-[#26262b] shadow-sm">
      <div className="h-16 px-4 flex items-center justify-between gap-3 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center text-white shadow-md">
            <span className="font-headline font-bold text-lg">DÌ</span>
          </div>
          <span className="font-headline text-xl text-white tracking-tight font-semibold">Discover It</span>
        </div>

        {/* City Pill */}
        <button
          onClick={onCityClick}
          aria-label="Select City: Chennai, India"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a1a1e] hover:bg-[#26262b] text-[#9898a0] active:scale-95 transition-all border border-[#26262b]"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs uppercase tracking-wider font-semibold text-white">Chennai, India</span>
          <span className="material-symbols-outlined text-[16px]">expand_more</span>
        </button>

        {/* Profile Badge */}
        <button
          onClick={onProfileClick}
          aria-label="Explorer Profile"
          className="relative w-10 h-10 rounded-full bg-[#1a1a1e] border border-[#26262b] flex items-center justify-center text-orange-400 hover:bg-[#26262b] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            explore
          </span>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center border border-[#121214]">
            L3
          </span>
        </button>
      </div>
    </header>
  );
};
