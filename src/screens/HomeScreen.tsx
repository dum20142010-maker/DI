import React, { useState } from 'react';
import { Discovery } from '../types';
import { mockDiscoveries } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

interface HomeScreenProps {
  onOpenDossier: (disc: Discovery) => void;
  onShowToast: (msg: string, icon?: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenDossier, onShowToast, onNavigateTab }) => {
  const { user } = useAuth();
  const [hapticOn, setHapticOn] = useState(true);
  const [questCompleted, setQuestCompleted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});

  // Daily Streak Check-in State
  const [streakClaimed, setStreakClaimed] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(3);
  const [streakPoints, setStreakPoints] = useState(640);

  const handleClaimStreak = () => {
    if (!streakClaimed) {
      setStreakClaimed(true);
      setCurrentStreak(prev => prev + 1);
      setStreakPoints(prev => prev + 50);
      onShowToast('+50 Daily Streak Explorer Points Claimed! 🔥', 'local_fire_department');
    } else {
      onShowToast('Today’s streak bonus already claimed. Come back tomorrow!', 'task_alt');
    }
  };

  const toggleBookmark = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks(prev => {
      const next = !prev[title];
      onShowToast(next ? `Saved "${title}" to Field Journal` : `Removed from Field Journal`, next ? 'bookmark_added' : 'bookmark_remove');
      return { ...prev, [title]: next };
    });
  };

  const heroDiscovery = mockDiscoveries[6];
  const curatedList = mockDiscoveries.slice(1, 4);
  const aroundYouList = mockDiscoveries.slice(2, 5);

  const filteredCurated = curatedList.filter(d => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'food' && d.categoryKey === 'food') return true;
    if (selectedCategory === 'heritage' && d.categoryKey === 'heritage') return true;
    if (selectedCategory === 'dayquest' && d.zone === 'George Town') return true;
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-24 space-y-6 max-w-4xl mx-auto px-4">
      {/* Top Status & Haptic Bar */}
      <div className="pt-3 pb-1 flex items-center justify-between text-xs text-[#9898a0] border-b border-[#26262b]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Tactile Feedback: {hapticOn ? 'Enabled' : 'Disabled'}</span>
        </div>
        <button
          onClick={() => {
            setHapticOn(!hapticOn);
            onShowToast(hapticOn ? 'Haptic feedback disabled' : 'Haptic feedback enabled', 'vibration');
          }}
          className="px-2.5 py-1 rounded text-orange-400 hover:bg-[#1a1a1e] active:scale-95 font-semibold transition-all"
        >
          {hapticOn ? 'Haptics On' : 'Haptics Off'}
        </button>
      </div>

      {/* Chennai Real-Time Weather Widget */}
      <section>
        <div className="bg-[#1a1a1e] rounded-2xl p-4 shadow-sm border border-[#26262b] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                wb_sunny
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline text-xl text-white font-bold">32°C</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">AQI 42 • Good</span>
              </div>
              <p className="text-xs text-[#9898a0]">Marina Breeze • Optimal Morning Walk Index</p>
            </div>
          </div>
          <button
            onClick={() => onShowToast('Weather telemetry: Low humidity, ideal for coastal heritage trails.', 'thermostat')}
            className="w-10 h-10 rounded-xl bg-[#26262b] text-orange-400 flex items-center justify-center hover:bg-[#32323a]"
          >
            <span className="material-symbols-outlined text-[20px]">air</span>
          </button>
        </div>
      </section>

      {/* NEW: Daily Check-In Streak & Explorer Points Reward Widget */}
      <section>
        <div className="bg-gradient-to-br from-[#1a1a1e] to-[#26262b] rounded-2xl p-5 shadow-sm border border-orange-500/30 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-orange-600/10 blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_fire_department
                </span>
              </div>
              <div>
                <h3 className="font-headline text-lg text-white font-bold">Daily Check-In Streak</h3>
                <p className="text-xs text-[#9898a0]">{currentStreak} Days Consecutive • {streakPoints} Total XP</p>
              </div>
            </div>
            <button
              onClick={handleClaimStreak}
              disabled={streakClaimed}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md flex items-center gap-1.5 ${
                streakClaimed
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 cursor-default'
                  : 'bg-orange-600 hover:bg-orange-500 text-white animate-pulse'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{streakClaimed ? 'task_alt' : 'bolt'}</span>
              <span>{streakClaimed ? 'Streak Claimed ✓' : 'Claim +50 XP'}</span>
            </button>
          </div>

          {/* 7-Day Streak Node Bar */}
          <div className="grid grid-cols-7 gap-1.5 pt-2">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const isPastOrToday = day <= currentStreak;
              return (
                <div
                  key={day}
                  className={`flex flex-col items-center justify-center py-2 rounded-xl border text-center transition-all ${
                    isPastOrToday
                      ? 'bg-orange-600/20 border-orange-500/50 text-orange-300 shadow-xs'
                      : 'bg-[#121214] border-[#26262b] text-[#9898a0]'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold">Day {day}</span>
                  <span className="material-symbols-outlined text-[14px] mt-0.5" style={{ fontVariationSettings: isPastOrToday ? "'FILL' 1" : "'FILL' 0" }}>
                    {isPastOrToday ? 'local_fire_department' : 'radio_button_unchecked'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Explorer Status Ticker */}
      <section>
        <div className="bg-[#1a1a1e] rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3 border border-[#26262b]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                explore
              </span>
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                  {user ? `Explorer ${user.displayName || 'Chronicler'}` : 'Lvl 3 Explorer'}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#9898a0]"></span>
                <span className="text-xs text-[#9898a0]">{currentStreak}-Day Streak 🔥</span>
              </div>
              <p className="text-sm text-white truncate font-medium">{streakPoints} XP earned • 8 Badges unlocked</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('me-profile')}
            className="shrink-0 px-3 py-2 text-orange-400 font-medium text-xs rounded-xl hover:bg-[#26262b] active:scale-95"
          >
            Profile
          </button>
        </div>
      </section>

      {/* Hero Editorial Card */}
      <section>
        <article
          onClick={() => onOpenDossier(heroDiscovery)}
          className="bg-[#1a1a1e] rounded-2xl overflow-hidden shadow-sm border border-[#26262b] hover:border-orange-500/40 cursor-pointer group transition-all"
        >
          <div className="relative w-full h-72">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src={heroDiscovery.imageUrl}
              alt={heroDiscovery.title}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/40 to-transparent"></div>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-[#121214]/80 backdrop-blur-md text-xs font-semibold tracking-wide text-orange-400 shadow-sm flex items-center gap-1.5 w-fit">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_stories
                </span>
                Story of the Day
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block px-3 py-0.5 rounded-full bg-orange-600/90 text-white text-xs mb-2 font-medium">
                Lore • 25 min walk • +120 XP
              </span>
              <h2 className="font-headline text-2xl text-white font-medium tracking-tight leading-snug">
                Chennai has a story you haven't heard yet: The Secret Chimes of Ripon Hall
              </h2>
            </div>
          </div>
          <div className="p-5 bg-[#1a1a1e] flex flex-col gap-3">
            <p className="text-sm text-[#9898a0]">
              {heroDiscovery.description}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDossier(heroDiscovery);
              }}
              className="w-full min-h-[48px] bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Discover it</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </article>
      </section>

      {/* Continue Exploring */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500 text-[20px]">route</span>
            <h3 className="font-headline text-xl text-white">Continue Exploring</h3>
          </div>
          <button
            onClick={() => onNavigateTab('map')}
            className="text-xs font-semibold text-orange-400 hover:text-orange-300"
          >
            View Map &amp; ETA
          </button>
        </div>
        <div className="bg-[#1a1a1e] rounded-2xl p-5 shadow-sm border border-[#26262b]">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <span className="text-[11px] text-teal-400 uppercase tracking-wider font-bold">Ongoing Field Quest</span>
              <h4 className="font-headline text-lg text-white mt-0.5">Mylapore Heritage Trail</h4>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold shrink-0">
              {questCompleted ? '3 of 4 stops' : '2 of 4 stops'}
            </span>
          </div>
          <div className="w-full bg-[#26262b] h-2.5 rounded-full overflow-hidden my-3">
            <div className="bg-orange-600 h-full rounded-full transition-all duration-700" style={{ width: questCompleted ? '75%' : '50%' }}></div>
          </div>
          <button
            onClick={() => {
              if (!questCompleted) {
                setQuestCompleted(true);
                onShowToast('+60 XP earned! Kapaleeshwarar Gate reached.', 'military_tech');
              } else {
                onShowToast('Milestone already checked in for today', 'task_alt');
              }
            }}
            className="w-full text-left p-3.5 bg-[#121214] hover:bg-[#26262b] rounded-xl flex items-center justify-between gap-3 border border-[#26262b] transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">pin_drop</span>
              </div>
              <div className="truncate">
                <div className="text-xs text-[#9898a0]">Next Milestone • 12 min walk</div>
                <div className="text-sm text-white font-semibold truncate">Kapaleeshwarar Tank West Gate</div>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                questCompleted ? 'bg-teal-500 text-white border-teal-500' : 'text-teal-400 bg-teal-500/10 border-teal-500/20'
              }`}>
                {questCompleted ? 'Claimed!' : '+60 XP'}
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Picked For You */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-headline text-xl text-white">Picked For You</h3>
            <p className="text-xs text-[#9898a0]">Chennai first, thoroughly unhurried</p>
          </div>
          <button onClick={() => onNavigateTab('explore')} className="text-xs font-semibold text-orange-400">
            See all
          </button>
        </div>

        {/* Chip-friendly filter buttons */}
        <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
          {[
            { key: 'all', label: 'All Curations' },
            { key: 'food', label: '🍛 Food Lore' },
            { key: 'heritage', label: '🏛️ Heritage & Books' },
            { key: 'dayquest', label: '🌊 Day Quests' },
          ].map(c => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95 ${
                selectedCategory === c.key ? 'bg-orange-600 text-white shadow-md' : 'bg-[#1a1a1e] text-[#9898a0] hover:bg-[#26262b] border border-[#26262b]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {filteredCurated.map((disc) => (
            <article
              key={disc.id}
              onClick={() => onOpenDossier(disc)}
              className="bg-[#1a1a1e] rounded-2xl overflow-hidden shadow-sm shrink-0 w-[260px] flex flex-col justify-between border border-[#26262b] hover:border-orange-500/40 cursor-pointer transition-all"
            >
              <div>
                <div className="relative w-full h-36">
                  <img className="w-full h-full object-cover" src={disc.imageUrl} alt={disc.title} referrerPolicy="no-referrer" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#121214]/80 backdrop-blur-md text-amber-400 text-xs font-semibold">
                    {disc.category}
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1 text-teal-400">
                    <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <span className="text-[11px] uppercase tracking-wider font-bold">{disc.provenance}</span>
                  </div>
                  <h4 className="font-headline text-lg text-white leading-snug truncate">{disc.title}</h4>
                  <p className="text-xs text-[#9898a0] line-clamp-2">{disc.description}</p>
                </div>
              </div>
              <div className="p-4 pt-0 flex items-center justify-between mt-auto">
                <span className="text-xs text-[#9898a0] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">near_me</span>
                  {disc.distance}
                </span>
                <span className="text-orange-400 font-bold text-xs">+{disc.xp} XP</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Around You */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500 text-[20px]">radar</span>
            <h3 className="font-headline text-xl text-white">Around You</h3>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-[#1a1a1e] text-[#9898a0] border border-[#26262b]">George Town &amp; Marina</span>
        </div>
        <div className="flex flex-col gap-3">
          {aroundYouList.map((disc) => {
            const isSaved = !!bookmarks[disc.title];
            return (
              <div
                key={disc.id}
                onClick={() => onOpenDossier(disc)}
                className="bg-[#1a1a1e] rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3 border border-[#26262b] hover:border-orange-500/40 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                    <img className="w-full h-full object-cover" src={disc.imageUrl} alt={disc.title} referrerPolicy="no-referrer" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-[#26262b] text-[10px] text-[#9898a0] font-semibold">{disc.category}</span>
                      <span className="text-xs text-orange-400 font-bold">{disc.distance}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white truncate">{disc.title}</h4>
                    <p className="text-xs text-[#9898a0] truncate">{disc.description}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => toggleBookmark(disc.title, e)}
                  aria-label={`Save ${disc.title} to Field Journal`}
                  className={`shrink-0 w-11 h-11 flex items-center justify-center transition-all rounded-xl ${
                    isSaved ? 'text-orange-500 bg-orange-500/20' : 'text-[#9898a0] hover:text-white bg-[#121214]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                    {isSaved ? 'bookmark' : 'bookmark_border'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quote Pill */}
      <section className="text-center pt-2">
        <button
          onClick={() => onShowToast('Inspired by Chennai heritage walk memoirs', 'format_quote')}
          className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full bg-[#1a1a1e] hover:bg-[#26262b] border border-[#26262b] shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-orange-400 animate-bounce">local_cafe</span>
          <span className="text-xs text-[#9898a0] italic">"A city isn't paved in stone, but in stories."</span>
        </button>
      </section>
    </div>
  );
};
