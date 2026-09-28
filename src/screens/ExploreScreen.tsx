import React, { useState } from 'react';
import { Discovery } from '../types';
import { mockDiscoveries, mockNeighbourhoods } from '../data/mockData';
import { triggerHaptic } from '../lib/haptic';

interface ExploreScreenProps {
  onOpenDossier: (disc: Discovery) => void;
  onShowToast: (msg: string, icon?: string) => void;
  onNavigateTab: (tab: any) => void;
}

interface CommunityEcho {
  id: string;
  author: string;
  handle: string;
  spot: string;
  snippet: string;
  timestamp: string;
  likes: number;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ onOpenDossier, onShowToast, onNavigateTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});

  // Community Echoes state
  const [echoes, setEchoes] = useState<CommunityEcho[]>([
    {
      id: 'echo-1',
      author: 'Srividya R.',
      handle: '@mylapore_scribe',
      spot: 'Triplicane Alchemist Well',
      snippet: 'Found an unmapped stone carving near the crumbling 17th-century well mentioning Dutch water treaties of 1682!',
      timestamp: '2 hours ago',
      likes: 24,
    },
    {
      id: 'echo-2',
      author: 'Karthik V.',
      handle: '@george_town_walker',
      spot: 'Armenian Church Belfry',
      snippet: 'Listening to the Whitechapel bronze bells at 07:00 AM in George Town is pure meditative serenity.',
      timestamp: '5 hours ago',
      likes: 41,
    },
    {
      id: 'echo-3',
      author: 'Ananya S.',
      handle: '@coastal_cartographer',
      spot: 'Marina Ghost Lighthouse',
      snippet: 'The rusted spiral staircase still echoes with whispers of old lighthouse keepers from the 1920s.',
      timestamp: 'Yesterday',
      likes: 59,
    }
  ]);

  const [newEchoSpot, setNewEchoSpot] = useState('');
  const [newEchoSnippet, setNewEchoSnippet] = useState('');
  const [contributeOpen, setContributeOpen] = useState(false);

  const handleContributeEcho = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEchoSpot.trim() || !newEchoSnippet.trim()) return;

    triggerHaptic('medium');
    const newEntry: CommunityEcho = {
      id: `echo-${Date.now()}`,
      author: 'You (Explorer)',
      handle: '@chennai_chronicler',
      spot: newEchoSpot.trim(),
      snippet: newEchoSnippet.trim(),
      timestamp: 'Just now',
      likes: 1,
    };

    setEchoes([newEntry, ...echoes]);
    setNewEchoSpot('');
    setNewEchoSnippet('');
    setContributeOpen(false);
    onShowToast('Echo contributed to local knowledge graph! (+50 XP)', 'hub');
  };

  const toggleBookmark = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('medium');
    setBookmarks(prev => {
      const next = !prev[title];
      onShowToast(next ? `Saved "${title}" to Field Journal` : `Removed from Field Journal`, next ? 'bookmark_added' : 'bookmark_remove');
      return { ...prev, [title]: next };
    });
  };

  const fuzzyMatch = (text: string, query: string) => {
    const t = text.toLowerCase();
    const q = query.toLowerCase().trim();
    if (!q) return true;
    if (t.includes(q)) return true;
    let qIdx = 0;
    for (let i = 0; i < t.length && qIdx < q.length; i++) {
      if (t[i] === q[qIdx]) {
        qIdx++;
      }
    }
    return qIdx === q.length;
  };

  const filteredDiscoveries = mockDiscoveries.filter(d => {
    const matchesSearch = fuzzyMatch(d.title, searchQuery) ||
                          fuzzyMatch(d.zone, searchQuery) ||
                          fuzzyMatch(d.description, searchQuery) ||
                          fuzzyMatch(d.category, searchQuery);
                          
    const matchesCat = activeCat === 'all' || 
                       d.categoryKey === activeCat || 
                       (activeCat === 'heritage' && d.categoryKey === 'heritage') ||
                       (activeCat === 'food' && d.categoryKey === 'food') ||
                       (activeCat === 'architecture' && d.categoryKey === 'architecture') ||
                       (activeCat === 'secret' && d.categoryKey === 'secret');

    const matchesZone = !selectedZone || d.zone === selectedZone;
    return matchesSearch && matchesCat && matchesZone;
  });

  return (
    <div className="flex flex-col w-full pb-24 max-w-4xl mx-auto px-4 space-y-6">
      {/* Title Header */}
      <div className="pt-4 pb-2">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="material-symbols-outlined text-[16px] text-orange-400" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
          <span className="text-xs text-orange-400 uppercase tracking-widest font-bold">Field Journal No. 04</span>
        </div>
        <div className="flex items-baseline justify-between">
          <h1 className="font-headline text-3xl text-white">Catalogue</h1>
          <span className="text-xs text-[#9898a0] font-medium">{filteredDiscoveries.length} Curated Spots</span>
        </div>
      </div>

      {/* Fuzzy Search Bar */}
      <div>
        <div className="relative flex items-center bg-[#1a1a1e] rounded-2xl p-2 shadow-sm border border-[#26262b]">
          <div className="pl-3 text-[#9898a0]">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              triggerHaptic('light');
            }}
            placeholder='Fuzzy search e.g. "Senate", "Triplicane well", "Coffee"...'
            className="w-full bg-transparent text-white placeholder:text-[#9898a0] text-sm pl-3 pr-24 py-2.5 focus:outline-none"
          />
          <div className="absolute right-3 flex items-center gap-2">
            {searchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  triggerHaptic('light');
                }} 
                className="w-7 h-7 rounded-full bg-[#26262b] flex items-center justify-center text-[#9898a0]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
            <button
              onClick={() => {
                triggerHaptic('light');
                onShowToast('Advanced sorting: Walking Distance (< 30 min)', 'tune');
              }}
              className="w-8 h-8 rounded-xl bg-[#26262b] flex items-center justify-center text-[#9898a0] hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="overflow-x-auto no-scrollbar flex items-center gap-2 py-1">
        {[
          { key: 'all', label: 'All', icon: 'stars' },
          { key: 'heritage', label: 'Heritage', icon: 'account_balance' },
          { key: 'food', label: 'Hidden Food Spots', icon: 'local_cafe' },
          { key: 'architecture', label: 'Architecture', icon: 'domain' },
          { key: 'secret', label: 'Hidden Lore', icon: 'key' },
        ].map((cat) => {
          const isSelected = activeCat === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => {
                setActiveCat(cat.key);
                triggerHaptic('medium');
                onShowToast(`Filtered by: ${cat.label}`, cat.icon);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all active:scale-95 cursor-pointer ${
                isSelected ? 'bg-orange-600 text-white shadow-md' : 'bg-[#1a1a1e] text-[#9898a0] hover:bg-[#26262b] border border-[#26262b]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* View Toggle */}
      <div>
        <div className="bg-[#1a1a1e] p-1.5 rounded-2xl flex items-center justify-between border border-[#26262b]">
          <button
            onClick={() => {
              setViewMode('cards');
              triggerHaptic('light');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'cards' ? 'bg-[#26262b] text-orange-400 shadow-sm' : 'text-[#9898a0]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">view_agenda</span>
            <span>Curated Cards</span>
          </button>
          <button
            onClick={() => {
              setViewMode('map');
              triggerHaptic('light');
              onNavigateTab('map');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'map' ? 'bg-[#26262b] text-orange-400 shadow-sm' : 'text-[#9898a0]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">map</span>
            <span>Map Radar</span>
          </button>
        </div>
      </div>

      {/* Spot Cards List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <h2 className="font-headline text-xl text-white">Under 1 Hour Walk</h2>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-medium">Paced for Solitary Strolls</span>
        </div>

        {filteredDiscoveries.length === 0 ? (
          <div className="bg-[#1a1a1e] rounded-2xl p-8 text-center border border-[#26262b] space-y-2">
            <span className="material-symbols-outlined text-4xl text-[#9898a0]">search_off</span>
            <h3 className="font-headline text-lg text-white">No matching hidden gems found</h3>
            <p className="text-xs text-[#9898a0]">Try adjusting your fuzzy search query or category filter.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredDiscoveries.map((disc) => {
              const isSaved = !!bookmarks[disc.title];
              return (
                <article
                  key={disc.id}
                  onClick={() => {
                    triggerHaptic('light');
                    onOpenDossier(disc);
                  }}
                  className="bg-[#1a1a1e] rounded-2xl p-4 shadow-sm flex flex-col gap-3.5 border border-[#26262b] hover:border-orange-500/40 transition-all cursor-pointer"
                >
                  <div className="relative w-full h-48 rounded-xl overflow-hidden">
                    <img
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      src={disc.imageUrl}
                      alt={disc.title}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#121214]/80 backdrop-blur-md px-3 py-1 rounded-lg">
                      <span className="material-symbols-outlined text-[14px] text-teal-400" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      <span className="text-xs text-white font-semibold">{disc.provenance}</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-orange-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-xs font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">bolt</span>
                      <span>+{disc.xp} XP</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#9898a0] mb-1">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-orange-400">directions_walk</span>
                        <span>{disc.duration}</span>
                      </div>
                      <span>{disc.zone} Corridor</span>
                    </div>
                    <h3 className="font-headline text-xl text-white mb-1">{disc.title}</h3>
                    <p className="text-xs text-[#9898a0] line-clamp-2">{disc.description}</p>
                  </div>
                  <div className="pt-3 flex items-center justify-between border-t border-[#26262b]">
                    <div className="flex items-center gap-1 text-teal-400 text-xs font-semibold">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span>Open: {disc.openHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleBookmark(disc.title, e)}
                        aria-label="Bookmark"
                        className="w-10 h-10 rounded-xl bg-[#121214] flex items-center justify-center text-[#9898a0] hover:text-white"
                      >
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                          {isSaved ? 'bookmark' : 'bookmark_border'}
                        </span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerHaptic('light');
                          onOpenDossier(disc);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#26262b] text-white text-xs font-semibold hover:bg-orange-600 transition-all flex items-center gap-1"
                      >
                        <span>Read Dossier</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* NEW: Community Echoes & Local Knowledge Graph Section */}
      <section className="bg-[#1a1a1e] rounded-2xl p-5 shadow-sm border border-[#26262b] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-400 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
            <h2 className="font-headline text-xl text-white">Community Echoes</h2>
          </div>
          <button
            onClick={() => {
              setContributeOpen(!contributeOpen);
              triggerHaptic('medium');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[15px]">add_comment</span>
            <span>Contribute Echo</span>
          </button>
        </div>

        <p className="text-xs text-[#9898a0]">
          Real-time snippets and lore contributed by Chennai walkers to the local knowledge graph.
        </p>

        {contributeOpen && (
          <form onSubmit={handleContributeEcho} className="bg-[#121214] p-4 rounded-xl border border-[#26262b] space-y-3">
            <h3 className="text-xs uppercase font-bold text-orange-400 tracking-wider">Contribute to Local Knowledge Graph</h3>
            <div>
              <label className="text-[11px] text-[#9898a0] block mb-1">Landmark or Hidden Spot Name</label>
              <input
                type="text"
                value={newEchoSpot}
                onChange={(e) => setNewEchoSpot(e.target.value)}
                placeholder="e.g. Royapettah Clock Tower"
                required
                className="w-full h-10 bg-[#1a1a1e] text-white px-3 rounded-lg border border-[#26262b] text-xs focus:outline-none focus:border-orange-600"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#9898a0] block mb-1">Your Echo / Discovery Snippet</label>
              <textarea
                value={newEchoSnippet}
                onChange={(e) => setNewEchoSnippet(e.target.value)}
                placeholder="Share what you observed..."
                required
                rows={2}
                className="w-full bg-[#1a1a1e] text-white p-3 rounded-lg border border-[#26262b] text-xs focus:outline-none focus:border-orange-600 resize-none"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setContributeOpen(false)}
                className="px-3 py-2 rounded-lg bg-[#26262b] text-[#9898a0] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-orange-600 text-white text-xs font-semibold"
              >
                Publish to Graph
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-col gap-3">
          {echoes.map((echo) => (
            <div key={echo.id} className="bg-[#121214] p-4 rounded-xl border border-[#26262b] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-orange-600/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                    {echo.author[0]}
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{echo.author} <span className="text-[#9898a0] font-normal">{echo.handle}</span></h4>
                    <span className="text-[10px] text-teal-400">📍 {echo.spot}</span>
                  </div>
                </div>
                <span className="text-[10px] text-[#9898a0]">{echo.timestamp}</span>
              </div>
              <p className="text-xs text-[#9898a0] leading-relaxed italic bg-[#1a1a1e] p-3 rounded-lg border border-[#26262b]/50">
                "{echo.snippet}"
              </p>
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    onShowToast(`Upvoted echo by ${echo.author}!`, 'favorite');
                  }}
                  className="flex items-center gap-1 text-[11px] text-orange-400 hover:text-orange-300 font-semibold"
                >
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  <span>{echo.likes} Upvotes</span>
                </button>
                <span className="text-[10px] text-[#9898a0]">Verified Knowledge Node</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Neighbourhood Carousel */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500 text-[18px]">near_me</span>
            <h2 className="font-headline text-xl text-white">Explore by Neighbourhood</h2>
          </div>
          <button 
            onClick={() => {
              setSelectedZone(null);
              triggerHaptic('light');
            }} 
            className="text-xs font-semibold text-orange-400"
          >
            {selectedZone ? 'Reset Filter' : 'All 18 Zones'}
          </button>
        </div>
        <div className="overflow-x-auto no-scrollbar flex items-center gap-3 pb-1">
          {mockNeighbourhoods.map((z) => {
            const isSelected = selectedZone === z.name;
            return (
              <button
                key={z.name}
                onClick={() => {
                  setSelectedZone(isSelected ? null : z.name);
                  triggerHaptic('medium');
                  onShowToast(`Filtered zone: ${z.name}`, 'pin_drop');
                }}
                className={`shrink-0 w-36 bg-[#1a1a1e] p-3.5 rounded-2xl shadow-sm flex flex-col justify-between h-28 cursor-pointer transition-all border text-left ${
                  isSelected ? 'border-orange-500 bg-orange-600/10' : 'border-[#26262b] hover:border-orange-500/30'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="w-7 h-7 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">{z.icon}</span>
                  </span>
                  <span className="text-[10px] text-[#9898a0]">{z.spotsCount} spots</span>
                </div>
                <div>
                  <h4 className="font-headline text-base text-white leading-tight">{z.name}</h4>
                  <span className="text-[11px] text-[#9898a0]">{z.tagline}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Field Tip */}
      <div>
        <div
          onClick={() => {
            triggerHaptic('light');
            onShowToast('Tip archived in Solitary Walk Guidebook', 'lightbulb');
          }}
          className="w-full text-left bg-[#1a1a1e] rounded-2xl p-4 flex items-center gap-3.5 border border-[#26262b] hover:border-orange-500/30 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">lightbulb</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h5 className="font-headline text-base text-white">Curator's Field Tip</h5>
              <span className="material-symbols-outlined text-[16px] text-[#9898a0]">chevron_right</span>
            </div>
            <p className="text-xs text-[#9898a0] mt-0.5">Early morning (06:30 – 08:30) is the sweet spot for George Town before wholesale hand-carts begin delivery runs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
