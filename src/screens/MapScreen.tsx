import React, { useState } from 'react';
import { Discovery } from '../types';
import { mockDiscoveries, mockNeighbourhoods } from '../data/mockData';
import { triggerHaptic } from '../lib/haptic';

interface MapScreenProps {
  onOpenDossier: (disc: Discovery) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({ onOpenDossier, onShowToast }) => {
  const [selectedZone, setSelectedZone] = useState('George Town');
  const [activeRoute, setActiveRoute] = useState<Discovery | null>(mockDiscoveries[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<'1.0x' | '1.25x' | '1.5x'>('1.0x');

  // Web Speech API audio guidance function
  const speakWalkingDirections = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onShowToast('Web Speech API not supported in this browser', 'error');
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = audioSpeed === '1.25x' ? 1.25 : audioSpeed === '1.5x' ? 1.5 : 1.0;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => {
        setIsPlayingAudio(true);
        triggerHaptic('medium');
        onShowToast('Audio guide playing instructions...', 'volume_up');
      };
      
      utterance.onend = () => {
        setIsPlayingAudio(false);
        triggerHaptic('light');
      };
      
      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPlayingAudio(false);
      onShowToast('Audio synthesis failed', 'error');
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      onShowToast('Audio guide paused', 'pause');
      triggerHaptic('light');
    }
  };

  const zoneDiscoveries = mockDiscoveries.filter(d => d.zone === selectedZone);

  return (
    <div className="flex flex-col w-full pb-24 max-w-4xl mx-auto px-4 space-y-6">
      {/* Title Header */}
      <div className="pt-4 pb-1">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="material-symbols-outlined text-[16px] text-orange-400" style={{ fontVariationSettings: "'FILL' 1" }}>radar</span>
          <span className="text-xs text-orange-400 uppercase tracking-widest font-bold">Chennai Spatial Radar</span>
        </div>
        <div className="flex items-baseline justify-between">
          <h1 className="font-headline text-3xl text-white">Live Expedition Map</h1>
          <span className="text-xs text-teal-400 font-semibold px-3 py-1 rounded-full bg-teal-500/10">GPS Active • 18 Zones</span>
        </div>
      </div>

      {/* NEW: Web Speech Audio Guidance Card for Active Quest */}
      <section className="bg-gradient-to-br from-[#1a1a1e] to-[#26262b] rounded-2xl p-5 shadow-sm border border-orange-500/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                spatial_audio
              </span>
            </div>
            <div>
              <h3 className="font-headline text-lg text-white font-bold">Audio-Guided Walking Directions</h3>
              <p className="text-xs text-[#9898a0]">Hands-free Web Speech API for city streets</p>
            </div>
          </div>
          <button
            onClick={() => {
              const speeds: ('1.0x' | '1.25x' | '1.5x')[] = ['1.0x', '1.25x', '1.5x'];
              const nextSpeed = speeds[(speeds.indexOf(audioSpeed) + 1) % speeds.length];
              setAudioSpeed(nextSpeed);
              onShowToast(`Audio speed set to ${nextSpeed}`, 'speed');
              triggerHaptic('light');
            }}
            className="px-3 py-1.5 rounded-xl bg-[#121214] border border-[#26262b] text-orange-400 text-xs font-bold"
          >
            {audioSpeed}
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-[#121214] border border-[#26262b] text-xs text-[#9898a0] leading-relaxed">
          <span className="text-white font-semibold block mb-1">Active Route: {activeRoute?.title}</span>
          "Head 150 meters north along {selectedZone} corridor. Observe the 18th-century stucco carvings on your left, then cross towards the courtyard entrance."
        </div>

        <div className="flex items-center gap-2">
          {isPlayingAudio ? (
            <button
              onClick={stopAudio}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">pause</span>
              <span>Pause Audio Guide</span>
            </button>
          ) : (
            <button
              onClick={() => speakWalkingDirections(`Heading towards ${activeRoute?.title} in ${selectedZone}. Walk straight for two blocks, note the historic facade, and check in at the waypoint.`)}
              className="flex-1 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 shadow-md transition-all animate-pulse"
            >
              <span className="material-symbols-outlined text-[18px]">volume_up</span>
              <span>Start Audio Guidance</span>
            </button>
          )}
          <button
            onClick={() => {
              speakWalkingDirections(`You are approaching ${activeRoute?.title}. Look for the stone plaque and capture your photo evidence.`);
              triggerHaptic('light');
            }}
            className="py-3 px-4 rounded-xl bg-[#26262b] hover:bg-[#32323a] text-white font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">near_me</span>
            <span>Waypoint Prompt</span>
          </button>
        </div>
      </section>

      {/* Neighbourhood Zone Tabs */}
      <div className="overflow-x-auto no-scrollbar flex items-center gap-2 py-1">
        {mockNeighbourhoods.map((zone) => {
          const isSelected = selectedZone === zone.name;
          return (
            <button
              key={zone.name}
              onClick={() => {
                setSelectedZone(zone.name);
                triggerHaptic('medium');
                onShowToast(`Switched radar zone: ${zone.name}`, 'map');
              }}
              className={`px-4 py-2.5 rounded-full text-xs font-semibold shrink-0 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                isSelected ? 'bg-orange-600 text-white shadow-md' : 'bg-[#1a1a1e] text-[#9898a0] hover:bg-[#26262b] border border-[#26262b]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{zone.icon}</span>
              <span>{zone.name}</span>
            </button>
          );
        })}
      </div>

      {/* Simulated Interactive Vector Map Canvas */}
      <section className="bg-[#1a1a1e] rounded-2xl overflow-hidden shadow-sm border border-[#26262b] relative">
        <div className="relative w-full h-80 bg-[#121214] overflow-hidden flex items-center justify-center">
          {/* Decorative Map Grid & Vector Roads */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ff6600_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 rounded-full border border-orange-500/20 absolute animate-ping duration-1000"></div>
            <div className="w-40 h-40 rounded-full border border-teal-500/30 absolute"></div>
            <div className="w-20 h-20 rounded-full border border-orange-500/40 absolute"></div>
          </div>

          {/* Central Radar Ping */}
          <div className="absolute z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-orange-600/30 border-2 border-orange-500 flex items-center justify-center shadow-lg animate-pulse">
              <span className="material-symbols-outlined text-orange-400 text-[24px]">my_location</span>
            </div>
            <span className="mt-2 px-3 py-1 rounded-full bg-[#121214]/90 backdrop-blur-md text-[11px] text-white font-bold border border-[#26262b] shadow-md">
              {selectedZone} Meridian
            </span>
          </div>

          {/* Map Pins */}
          {zoneDiscoveries.map((disc, idx) => {
            const isSelectedRoute = activeRoute?.id === disc.id;
            return (
              <div
                key={disc.id}
                onClick={() => {
                  setActiveRoute(disc);
                  triggerHaptic('light');
                  onShowToast(`Selected route to: ${disc.title}`, 'route');
                }}
                className={`absolute z-20 cursor-pointer transition-transform active:scale-95 flex flex-col items-center group ${
                  idx === 0 ? 'top-12 left-16' : idx === 1 ? 'bottom-16 right-20' : 'top-20 right-28'
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${
                  isSelectedRoute ? 'bg-orange-600 text-white ring-4 ring-orange-500/30 scale-110' : 'bg-[#26262b] text-orange-400 border border-[#26262b]'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">
                    {disc.categoryKey === 'food' ? 'restaurant' : 'account_balance'}
                  </span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#121214] px-2 py-1 rounded text-[10px] text-white absolute -bottom-7 whitespace-nowrap border border-[#26262b]">
                  {disc.title}
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-3 left-3 bg-[#121214]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#26262b] text-[11px] text-[#9898a0] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span>Tap any pin to set audio guidance destination</span>
          </div>
        </div>

        {/* Selected Route Details Footer */}
        {activeRoute && (
          <div className="p-4 bg-[#1a1a1e] border-t border-[#26262b] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                <img src={activeRoute.imageUrl} alt={activeRoute.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="truncate">
                <span className="text-[10px] uppercase font-bold text-orange-400">{activeRoute.category} • {activeRoute.distance}</span>
                <h4 className="font-headline text-base text-white truncate">{activeRoute.title}</h4>
                <p className="text-xs text-[#9898a0] truncate">{activeRoute.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  onOpenDossier(activeRoute);
                }}
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs active:scale-95 shadow-md transition-all flex items-center gap-1"
              >
                <span>Read Dossier</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Zone Discoveries List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-xl text-white">Landmarks in {selectedZone}</h2>
          <span className="text-xs text-[#9898a0]">{zoneDiscoveries.length} available</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {zoneDiscoveries.map(disc => (
            <div
              key={disc.id}
              onClick={() => {
                setActiveRoute(disc);
                triggerHaptic('light');
                onOpenDossier(disc);
              }}
              className="bg-[#1a1a1e] rounded-2xl p-4 flex items-center justify-between gap-3 border border-[#26262b] hover:border-orange-500/40 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <img src={disc.imageUrl} alt={disc.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-teal-400">{disc.provenance}</span>
                    <span className="text-xs text-orange-400 font-bold">{disc.distance}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white truncate mt-0.5">{disc.title}</h4>
                  <p className="text-xs text-[#9898a0] truncate">{disc.description}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveRoute(disc);
                  speakWalkingDirections(`Navigating to ${disc.title}. ${disc.description}`);
                }}
                className="w-11 h-11 rounded-xl bg-[#121214] hover:bg-[#26262b] text-orange-400 flex items-center justify-center shrink-0 border border-[#26262b]"
                aria-label="Play audio guidance"
              >
                <span className="material-symbols-outlined text-[20px]">volume_up</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
