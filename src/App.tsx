import React, { useState } from 'react';
import { Discovery, TabType } from './types';
import { HomeScreen } from './screens/HomeScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { MapScreen } from './screens/MapScreen';
import { AdventuresScreen } from './screens/AdventuresScreen';
import { GroupsScreen } from './screens/GroupsScreen';
import { JournalScreen } from './screens/JournalScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { DossierModal } from './components/DossierModal';
import { AiGeneratorModal } from './components/AiGeneratorModal';
import { ZomatoNotificationBanner } from './components/ZomatoNotificationBanner';
import { useAuth } from './context/AuthContext';
import { triggerHaptic } from './lib/haptic';

export function App() {
  const { user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedDiscovery, setSelectedDiscovery] = useState<Discovery | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; icon: string } | null>(null);

  // Auth gate form state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const showToast = (message: string, icon: string = 'info') => {
    setToast({ message, icon });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) return;

    setAuthLoading(true);
    triggerHaptic('medium');

    try {
      if (isSignUp) {
        await signUpWithEmail(emailInput, passwordInput, displayNameInput || 'Explorer');
        showToast(`Account created successfully for ${emailInput}`, 'person_add');
      } else {
        await signInWithEmail(emailInput, passwordInput);
        showToast(`Welcome back, ${emailInput}!`, 'login');
      }
    } catch (err: any) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthLoading(true);
    triggerHaptic('medium');
    try {
      await signInWithGoogle();
      showToast('Signed in with Google successfully', 'login');
    } catch (err: any) {
      showToast('Google sign-in failed', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121214] flex items-center justify-center">
        <span className="material-symbols-outlined text-orange-400 animate-spin text-4xl">progress_activity</span>
      </div>
    );
  }

  // Mandatory Sign Up / Sign In gate before entering the app
  if (!user) {
    return (
      <div className="min-h-screen bg-[#121214] text-[#f4f4f6] font-sans flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#1a1a1e] rounded-3xl p-8 border border-[#26262b] shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-orange-600/20 text-orange-400 mx-auto flex items-center justify-center border border-orange-500/40">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
            </div>
            <h1 className="font-headline text-2xl font-bold text-white">DÌ DiscoverIt Chennai</h1>
            <p className="text-xs text-[#9898a0]">Please sign up or sign in to begin discovering hidden trails, tracking your streak, and journaling your findings.</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-[#9898a0] uppercase mb-1">Explorer Name</label>
                <input
                  type="text"
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  placeholder="e.g., Mylapore Stroller"
                  required
                  className="w-full bg-[#121214] text-white p-3.5 rounded-xl border border-[#26262b] text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#9898a0] uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="explorer@example.com"
                required
                className="w-full bg-[#121214] text-white p-3.5 rounded-xl border border-[#26262b] text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9898a0] uppercase mb-1">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#121214] text-white p-3.5 rounded-xl border border-[#26262b] text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {authLoading ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isSignUp ? 'person_add' : 'login'}
                  </span>
                  <span>{isSignUp ? 'Create Account & Enter App' : 'Sign In to App'}</span>
                </>
              )}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[#26262b]"></div>
            <span className="flex-shrink mx-4 text-xs text-[#9898a0]">OR</span>
            <div className="flex-grow border-t border-[#26262b]"></div>
          </div>

          <button
            onClick={handleGoogleAuth}
            disabled={authLoading}
            className="w-full py-3.5 rounded-xl bg-[#26262b] hover:bg-[#32323a] text-white font-semibold text-xs flex items-center justify-center gap-2 border border-[#32323a] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Continue with Google</span>
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                triggerHaptic('light');
              }}
              className="text-xs text-orange-400 font-semibold hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleOpenDossier = (disc: Discovery) => {
    triggerHaptic('light');
    setSelectedDiscovery(disc);
  };

  const handleNavigateTab = (tab: TabType) => {
    triggerHaptic('medium');
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#121214] text-[#f4f4f6] font-sans flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Zomato-style engaging push notification banner */}
      <ZomatoNotificationBanner onShowToast={showToast} />

      {/* Main Screen Router */}
      <main className="flex-1 w-full flex flex-col">
        {activeTab === 'home' && (
          <HomeScreen
            onOpenDossier={handleOpenDossier}
            onShowToast={showToast}
            onNavigateTab={handleNavigateTab}
          />
        )}
        {activeTab === 'explore' && (
          <ExploreScreen
            onOpenDossier={handleOpenDossier}
            onShowToast={showToast}
            onNavigateTab={handleNavigateTab}
          />
        )}
        {activeTab === 'map' && (
          <MapScreen
            onOpenDossier={handleOpenDossier}
            onShowToast={showToast}
          />
        )}
        {activeTab === 'adventures' && (
          <AdventuresScreen
            onShowToast={showToast}
            onOpenAiModal={() => setAiModalOpen(true)}
          />
        )}
        {activeTab === 'groups' && (
          <GroupsScreen
            onShowToast={showToast}
          />
        )}
        {activeTab === 'journal' && (
          <JournalScreen
            onShowToast={showToast}
          />
        )}
        {activeTab === 'me-profile' && (
          <ProfileScreen
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Dossier Detail Modal */}
      <DossierModal
        discovery={selectedDiscovery}
        isOpen={!!selectedDiscovery}
        onClose={() => setSelectedDiscovery(null)}
        onBookmark={(title) => showToast(`Saved "${title}" to Field Journal`, 'bookmark_added')}
        onStartWalk={(title) => {
          setSelectedDiscovery(null);
          setActiveTab('map');
          showToast(`Started walking trail: ${title}`, 'directions_walk');
        }}
        onShowToast={showToast}
      />

      {/* AI Generator Modal */}
      <AiGeneratorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-[#1a1a1e] text-white px-5 py-3 rounded-2xl shadow-2xl border border-orange-500/40 flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-orange-400 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {toast.icon}
          </span>
          <span className="text-xs font-semibold tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Bottom Navigation Dock */}
      <nav aria-label="Main Navigation" className="fixed bottom-0 left-0 right-0 z-40 bg-[#1a1a1e]/95 backdrop-blur-md border-t border-[#26262b] px-2 py-2">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {[
            { id: 'home', label: 'Home', icon: 'explore' },
            { id: 'explore', label: 'Explore', icon: 'auto_stories' },
            { id: 'map', label: 'Map', icon: 'radar' },
            { id: 'adventures', label: 'Adventures', icon: 'hiking' },
            { id: 'groups', label: 'Groups', icon: 'groups' },
            { id: 'journal', label: 'Journal', icon: 'menu_book' },
            { id: 'me-profile', label: 'Profile', icon: 'account_box' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleNavigateTab(tab.id as TabType)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                  isActive ? 'text-orange-400 scale-105' : 'text-[#9898a0] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {tab.icon}
                </span>
                <span className="text-[9px] font-semibold mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
export default App;
