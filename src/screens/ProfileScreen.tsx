import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { triggerHaptic } from '../lib/haptic';

interface ProfileScreenProps {
  onShowToast: (msg: string, icon?: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onShowToast }) => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || 'Explorer');
  const [bio, setBio] = useState('Exploring heritage trails across Chennai.');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    triggerHaptic('medium');
    onShowToast('Profile updated successfully!', 'check_circle');
  };

  const handleSignOut = async () => {
    try {
      await logout();
      onShowToast('Signed out successfully', 'logout');
      triggerHaptic('light');
    } catch {
      onShowToast('Sign out failed', 'error');
    }
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-4xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div className="pt-4 pb-2">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="material-symbols-outlined text-[16px] text-orange-400" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
          <span className="text-xs text-orange-400 uppercase tracking-widest font-bold">Explorer Profile & Credentials</span>
        </div>
        <div className="flex items-baseline justify-between">
          <h1 className="font-headline text-3xl text-white">Identity Dossier</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-teal-400 font-semibold flex items-center gap-1 bg-teal-500/10 px-3 py-1.5 rounded-xl border border-teal-500/20"
          >
            <span className="material-symbols-outlined text-[14px]">edit</span>
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      <div className="bg-[#1a1a1e] rounded-2xl p-6 border border-[#26262b] shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-[#26262b] pb-5">
          <div className="w-16 h-16 rounded-2xl bg-orange-600/20 text-orange-400 flex items-center justify-center font-headline text-2xl font-bold border border-orange-500/40">
            {user?.email?.[0].toUpperCase() || 'E'}
          </div>
          <div>
            <span className="text-xs text-[#9898a0] uppercase tracking-wider font-semibold">Authenticated Explorer</span>
            <h2 className="font-headline text-xl text-white font-bold">{displayName}</h2>
            <span className="text-xs text-[#9898a0]">{user?.email}</span>
          </div>
        </div>

        {/* Stats & Streak Number */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-[#121214] border border-[#26262b] text-center">
            <span className="text-[10px] uppercase text-[#9898a0] block mb-1 font-semibold">Active Streak</span>
            <span className="font-headline text-2xl text-orange-400 font-bold flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              <span>14 Days</span>
            </span>
          </div>
          <div className="p-4 rounded-xl bg-[#121214] border border-[#26262b] text-center">
            <span className="text-[10px] uppercase text-[#9898a0] block mb-1 font-semibold">Explorer XP</span>
            <span className="font-headline text-2xl text-teal-400 font-bold block">820 XP</span>
          </div>
          <div className="p-4 rounded-xl bg-[#121214] border border-[#26262b] text-center">
            <span className="text-[10px] uppercase text-[#9898a0] block mb-1 font-semibold">Badges</span>
            <span className="font-headline text-2xl text-white font-bold block">18</span>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#9898a0] uppercase mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#121214] text-white p-3 rounded-xl border border-[#26262b] text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9898a0] uppercase mb-1">Explorer Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full bg-[#121214] text-white p-3 rounded-xl border border-[#26262b] text-sm focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
            >
              Save Profile Changes
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-[#121214] border border-[#26262b] space-y-2">
            <span className="text-xs text-[#9898a0] uppercase tracking-wider font-semibold">Bio</span>
            <p className="text-xs text-white leading-relaxed">{bio}</p>
          </div>
        )}

        <button
          onClick={handleSignOut}
          className="w-full py-3.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold text-xs flex items-center justify-center gap-2 border border-red-500/30 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Log Out of Account</span>
        </button>
      </div>
    </div>
  );
};
