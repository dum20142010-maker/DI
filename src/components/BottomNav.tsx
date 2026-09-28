import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onTabChangeToast: (label: string, icon: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, onTabChangeToast }) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'explore', label: 'Explore', icon: 'explore' },
    { id: 'map', label: 'Map', icon: 'location_on' },
    { id: 'adventures', label: 'Adventures', icon: 'flag' },
    { id: 'me-profile', label: 'Me', icon: 'person' },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 w-full z-50 pb-safe bg-[#121214]/95 backdrop-blur-xl border-t border-[#26262b]"
      role="navigation"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-4xl mx-auto" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActiveTab(tab.id);
                onTabChangeToast(`Navigated to ${tab.label}`, tab.icon);
              }}
              className={`flex flex-col items-center justify-center w-16 py-1 transition-all duration-200 active:scale-95 rounded-xl ${
                isActive ? 'text-orange-500 font-bold' : 'text-[#9898a0] hover:text-white'
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className="text-[11px] mt-0.5 tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
