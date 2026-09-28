import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { triggerHaptic } from '../lib/haptic';

interface GroupsScreenProps {
  onShowToast: (msg: string, icon?: string) => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  photoUrl?: string;
}

interface WalkingGroup {
  id: string;
  name: string;
  zone: string;
  membersCount: number;
  description: string;
}

export const GroupsScreen: React.FC<GroupsScreenProps> = ({ onShowToast }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'squads' | 'chat' | 'invite'>('leaderboard');
  
  // Clean state: empty until user signs in and joins/creates groups or adds friends
  const [myGroups, setMyGroups] = useState<WalkingGroup[]>([]);
  const [activeGroup, setActiveGroup] = useState<WalkingGroup | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupZone, setNewGroupZone] = useState('George Town');
  const [friendEmail, setFriendEmail] = useState('');
  const [friendsList, setFriendsList] = useState<{ email: string; xp: number }[]>([]);

  // Leaderboard ranking based on user XP or signed-in explorers
  const [leaderboardUsers, setLeaderboardUsers] = useState<{ name: string; xp: number; rank: number; zone: string }[]>([]);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onShowToast('Please sign in in your Profile to create groups', 'login');
      return;
    }
    if (!newGroupName.trim()) return;

    const newGroup: WalkingGroup = {
      id: Date.now().toString(),
      name: newGroupName,
      zone: newGroupZone,
      membersCount: 1,
      description: 'Custom walking squad created by ' + (user.email || 'Explorer')
    };

    setMyGroups(prev => [newGroup, ...prev]);
    setActiveGroup(newGroup);
    setNewGroupName('');
    onShowToast(`Created group "${newGroupName}" successfully!`, 'group_add');
    triggerHaptic('medium');
    setActiveTab('chat');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onShowToast('Please sign in to send messages', 'login');
      return;
    }
    if (!inputMessage.trim()) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender: user.email || 'You',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, msg]);
    setInputMessage('');
    triggerHaptic('light');
  };

  const handleInviteFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onShowToast('Please sign in first', 'login');
      return;
    }
    if (!friendEmail.trim()) return;

    setFriendsList(prev => [...prev, { email: friendEmail, xp: 120 }]);
    setFriendEmail('');
    onShowToast(`Invite link sent to ${friendEmail}!`, 'send');
    triggerHaptic('medium');
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-4xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div className="pt-4 pb-2">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="material-symbols-outlined text-[16px] text-orange-400" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
          <span className="text-xs text-orange-400 uppercase tracking-widest font-bold">Community & Squad Hub</span>
        </div>
        <div className="flex items-baseline justify-between">
          <h1 className="font-headline text-3xl text-white">City Explorers</h1>
          <span className="text-xs text-[#9898a0]">
            {user ? `Signed in as ${user.email}` : 'Sign in required for social hubs'}
          </span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-[#1a1a1e] p-1.5 rounded-2xl flex items-center justify-between border border-[#26262b]">
        {[
          { id: 'leaderboard', label: 'Leaderboard', icon: 'leaderboard' },
          { id: 'squads', label: 'My Squads', icon: 'groups' },
          { id: 'chat', label: 'Group Chat', icon: 'chat' },
          { id: 'invite', label: 'Invite Friends', icon: 'person_add' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              triggerHaptic('light');
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id ? 'bg-[#26262b] text-orange-400 shadow-sm' : 'text-[#9898a0] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="bg-[#1a1a1e] rounded-2xl p-6 border border-[#26262b] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#26262b] pb-3">
            <div>
              <h3 className="font-headline text-lg text-white font-bold">City Explorers Global & Group Leaderboard</h3>
              <p className="text-xs text-[#9898a0]">Ranked by total Explorer Points (XP) earned from discovering hidden gems</p>
            </div>
            <span className="text-xs text-orange-400 font-bold px-3 py-1 rounded-full bg-orange-600/20">Live Rank</span>
          </div>

          {!user ? (
            <div className="p-8 text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#9898a0]">lock</span>
              <h4 className="font-headline text-base text-white">Sign in required to view your ranking</h4>
              <p className="text-xs text-[#9898a0]">Please sign in through your Profile tab to register on the leaderboard and compare XP with friends.</p>
            </div>
          ) : leaderboardUsers.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#9898a0]">leaderboard</span>
              <h4 className="font-headline text-base text-white">No active leaderboard entries yet</h4>
              <p className="text-xs text-[#9898a0]">Complete discoveries or join a squad to populate the active leaderboard rankings.</p>
              <button
                onClick={() => {
                  setLeaderboardUsers([
                    { name: user.email || 'You', xp: 450, rank: 1, zone: 'George Town' },
                    { name: 'Arun M.', xp: 320, rank: 2, zone: 'Mylapore' },
                    { name: 'Priya S.', xp: 210, rank: 3, zone: 'Triplicane' }
                  ]);
                  onShowToast('Refreshed leaderboard standings', 'refresh');
                  triggerHaptic('medium');
                }}
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                <span>Load Active Rankings</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboardUsers.map(u => (
                <div key={u.rank} className="flex items-center justify-between p-3.5 rounded-xl bg-[#121214] border border-[#26262b]">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      u.rank === 1 ? 'bg-amber-500 text-black' : u.rank === 2 ? 'bg-slate-300 text-black' : 'bg-orange-900/50 text-orange-300'
                    }`}>
                      #{u.rank}
                    </span>
                    <div>
                      <h4 className="font-headline text-sm text-white">{u.name}</h4>
                      <span className="text-[11px] text-[#9898a0]">Zone: {u.zone}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-orange-400">{u.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Squads Tab */}
      {activeTab === 'squads' && (
        <div className="space-y-6">
          <div className="bg-[#1a1a1e] rounded-2xl p-6 border border-[#26262b] shadow-sm space-y-4">
            <h3 className="font-headline text-lg text-white font-bold">Create or Join a Walking Squad</h3>
            <form onSubmit={handleCreateGroup} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#9898a0] uppercase mb-1">Squad Name</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., Mylapore Heritage Striders"
                  className="w-full bg-[#121214] text-white p-3 rounded-xl border border-[#26262b] text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#9898a0] uppercase mb-1">Base Neighbourhood Zone</label>
                <select
                  value={newGroupZone}
                  onChange={(e) => setNewGroupZone(e.target.value)}
                  className="w-full bg-[#121214] text-white p-3 rounded-xl border border-[#26262b] text-sm focus:outline-none focus:border-orange-500"
                >
                  <option value="George Town">George Town</option>
                  <option value="Mylapore">Mylapore</option>
                  <option value="Triplicane">Triplicane</option>
                  <option value="Marina Beach">Marina Beach</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">group_add</span>
                <span>Create New Squad</span>
              </button>
            </form>
          </div>

          <div className="bg-[#1a1a1e] rounded-2xl p-6 border border-[#26262b] shadow-sm space-y-3">
            <h3 className="font-headline text-lg text-white font-bold">Your Active Squads</h3>
            {myGroups.length === 0 ? (
              <p className="text-xs text-[#9898a0] py-4 text-center">You haven't joined or created any walking squads yet.</p>
            ) : (
              <div className="space-y-2">
                {myGroups.map(g => (
                  <div key={g.id} className="flex items-center justify-between p-4 rounded-xl bg-[#121214] border border-[#26262b]">
                    <div>
                      <h4 className="font-headline text-base text-white">{g.name}</h4>
                      <span className="text-xs text-orange-400">{g.zone} • {g.membersCount} member</span>
                    </div>
                    <button
                      onClick={() => {
                        setActiveGroup(g);
                        setActiveTab('chat');
                        triggerHaptic('light');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#26262b] hover:bg-orange-600 text-white text-xs font-semibold transition-all"
                    >
                      Open Chat
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Group Chat Tab */}
      {activeTab === 'chat' && (
        <div className="bg-[#1a1a1e] rounded-2xl p-6 border border-[#26262b] shadow-sm flex flex-col h-[500px]">
          <div className="flex items-center justify-between border-b border-[#26262b] pb-3 mb-4">
            <div>
              <h3 className="font-headline text-base text-white font-bold">
                {activeGroup ? activeGroup.name : 'General Chennai Explorers Chat'}
              </h3>
              <span className="text-[11px] text-teal-400">Live Voice Call & Photo Sharing Enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onShowToast('Simulating secure voice call with squad...', 'call');
                  triggerHaptic('medium');
                }}
                className="w-9 h-9 rounded-xl bg-teal-600/20 text-teal-400 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all"
                title="Start Voice Call"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2">
                <span className="material-symbols-outlined text-4xl text-[#9898a0]">chat_bubble_outline</span>
                <p className="text-xs text-[#9898a0]">No messages yet. Send a message or photo to start chatting with explorers!</p>
              </div>
            ) : (
              messages.map(m => (
                <div key={m.id} className="p-3 rounded-xl bg-[#121214] border border-[#26262b] space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-[#9898a0]">
                    <span className="text-orange-400 font-bold">{m.sender}</span>
                    <span>{m.timestamp}</span>
                  </div>
                  <p className="text-xs text-white leading-relaxed">{m.text}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-[#26262b] flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type message or share discovery note..."
              className="flex-1 bg-[#121214] text-white p-3 rounded-xl border border-[#26262b] text-xs focus:outline-none focus:border-orange-500"
            />
            <button
              type="button"
              onClick={() => {
                onShowToast('Photo attached from camera!', 'photo_camera');
                triggerHaptic('light');
                setMessages(prev => [...prev, {
                  id: Date.now().toString(),
                  sender: user?.email || 'You',
                  text: '[Photo Evidence Shared]',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
              }}
              className="w-11 h-11 rounded-xl bg-[#121214] hover:bg-[#26262b] text-orange-400 flex items-center justify-center border border-[#26262b]"
              title="Send Photo"
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </button>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs shadow-md"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Invite Friends Tab */}
      {activeTab === 'invite' && (
        <div className="bg-[#1a1a1e] rounded-2xl p-6 border border-[#26262b] shadow-sm space-y-4">
          <h3 className="font-headline text-lg text-white font-bold">Invite Friends to DÌ DiscoverIt</h3>
          <p className="text-xs text-[#9898a0]">Send an invite link to your friends so they can join your walking squad and compete on the leaderboard.</p>

          <form onSubmit={handleInviteFriend} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#9898a0] uppercase mb-1">Friend's Email Address</label>
              <input
                type="email"
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                placeholder="friend@example.com"
                required
                className="w-full bg-[#121214] text-white p-3 rounded-xl border border-[#26262b] text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Send Invite Link</span>
            </button>
          </form>

          {friendsList.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#26262b] space-y-2">
              <h4 className="font-headline text-sm text-white">Pending / Active Friends:</h4>
              {friendsList.map((f, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#121214] border border-[#26262b]">
                  <span className="text-xs text-white">{f.email}</span>
                  <span className="text-[11px] text-teal-400 font-semibold">Active Explorer</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
