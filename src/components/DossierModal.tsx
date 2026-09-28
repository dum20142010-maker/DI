import React, { useState } from 'react';
import { Discovery } from '../types';
import { triggerHaptic } from '../lib/haptic';

interface DossierModalProps {
  discovery: Discovery | null;
  isOpen: boolean;
  onClose: () => void;
  onBookmark: (title: string) => void;
  onStartWalk: (title: string) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({
  discovery,
  isOpen,
  onClose,
  onBookmark,
  onStartWalk,
  onShowToast,
}) => {
  const [verifying, setVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [snapPhotoUrl, setSnapPhotoUrl] = useState<string | null>(null);

  if (!isOpen || !discovery) return null;

  const handleSnapAndVerify = () => {
    triggerHaptic([60, 40, 80]);
    setVerifying(true);
    setSnapPhotoUrl(discovery.imageUrl);

    setTimeout(() => {
      setVerifying(false);
      setVerifiedSuccess(true);
      triggerHaptic([100, 50, 100, 50, 200]);
      onShowToast(`Gemini AI Verified! +150 XP awarded for "${discovery.title}"!`, 'military_tech');
    }, 1800);
  };

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => {
        triggerHaptic(30);
        onClose();
      }}
    >
      <div
        className="bg-[#1a1a1e] text-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto border border-[#26262b]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-[#26262b] rounded-full mx-auto mb-4"></div>
        
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="px-2.5 py-1 rounded-md bg-orange-600/20 text-orange-400 text-xs font-bold uppercase tracking-wider">
              {discovery.zone}
            </span>
            <h3 className="font-headline text-2xl text-white mt-1">
              {discovery.title}
            </h3>
          </div>
          <button
            onClick={() => {
              triggerHaptic(30);
              onClose();
            }}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-[#26262b] flex items-center justify-center text-[#9898a0] hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="relative w-full h-52 rounded-xl overflow-hidden my-4 border border-[#26262b]">
          <img
            src={snapPhotoUrl || discovery.imageUrl}
            alt={discovery.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-[#121214]/90 backdrop-blur-md text-orange-400 text-xs font-semibold">
            {discovery.provenance}
          </div>
          <div className="absolute top-3 right-3 px-3 py-1 rounded-md bg-orange-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            <span>+{verifiedSuccess ? '300' : discovery.xp} XP</span>
          </div>
          {verifiedSuccess && (
            <div className="absolute bottom-3 left-3 right-3 bg-teal-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>AI Verified &amp; Saved to Field Journal Vault!</span>
            </div>
          )}
        </div>

        <div className="p-3.5 bg-[#121214] rounded-xl mb-4 flex items-center justify-between text-sm text-[#9898a0] border border-[#26262b]">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>Open: {discovery.openHours}</span>
          </span>
          <span className="text-xs">Curator: {discovery.curator}</span>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-[#9898a0] leading-relaxed">
            {discovery.fullStory}
          </p>
          <div className="p-3.5 rounded-xl bg-[#26262b]/50 border border-[#26262b] text-sm text-white">
            <div className="flex items-center gap-1.5 font-semibold text-orange-400 mb-1">
              <span className="material-symbols-outlined text-[16px]">auto_stories</span>
              <span>Walking &amp; Lore Tip</span>
            </div>
            {discovery.description}
          </div>

          {/* Snap & Share / AI Verify Button */}
          <div className="pt-2">
            <button
              onClick={handleSnapAndVerify}
              disabled={verifying}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {verifying ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  <span>Gemini AI Analyzing Photo Evidence...</span>
                </>
              ) : verifiedSuccess ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">task_alt</span>
                  <span>Evidence Verified (+150 XP Claimed)</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                  <span>Snap Evidence &amp; AI Verify (+150 XP)</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              triggerHaptic(40);
              onStartWalk(discovery.title);
              onClose();
            }}
            className="flex-1 py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all min-h-[48px]"
          >
            <span className="material-symbols-outlined text-[18px]">directions_walk</span>
            <span>Start Solitary Walk</span>
          </button>
          <button
            onClick={() => {
              triggerHaptic(30);
              onBookmark(discovery.title);
            }}
            aria-label="Bookmark"
            className="w-12 h-12 rounded-xl bg-[#26262b] text-white flex items-center justify-center hover:bg-[#32323a] active:scale-95 transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">bookmark_border</span>
          </button>
        </div>
      </div>
    </div>
  );
};
