import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { triggerHaptic } from '../lib/haptic';

interface AiGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const AiGeneratorModal: React.FC<AiGeneratorModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [promptInput, setPromptInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setLoading(true);
    triggerHaptic('medium');

    try {
      const ai = new GoogleGenAI();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create a secret walking trail and unmapped gem description in Chennai based on this prompt: "${promptInput}". Provide a captivating title, historical provenance, walking duration, and exact waypoint clues. Keep it atmospheric and mysterious.`
      });

      setGeneratedResult(response.text || 'Generated secret Chennai walking trail successfully.');
      onShowToast('New AI walking trail generated! (+100 XP)', 'auto_awesome');
      triggerHaptic([50, 50, 50]);
    } catch {
      setGeneratedResult(`Secret Expedition Trail: "${promptInput}" in George Town. 
Provenance: 18th-century mercantile corridor. 
Duration: 35 minutes walk. 
Clues: Start at Armenian Street belfry, walk past the brick arches, and discover the hidden well.`);
      onShowToast('Generated offline fallback trail successfully.', 'auto_awesome');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#1a1a1e] rounded-2xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-4 border border-[#26262b]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-400 text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <h3 className="font-headline text-xl text-white font-bold">DÌ AI Trail Generator</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#121214] text-[#9898a0] flex items-center justify-center hover:text-white">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="text-xs text-[#9898a0] leading-relaxed">
          Describe what kind of hidden Chennai story, food trail, or architectural walk you want to uncover. Gemini AI will synthesize a custom walking expedition for you.
        </p>

        <form onSubmit={handleGenerate} className="space-y-3">
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="e.g. A 45-minute walking trail through George Town exploring old Armenian print shops and hidden courtyards..."
            rows={3}
            required
            className="w-full bg-[#121214] text-white p-3.5 rounded-xl border border-[#26262b] text-sm focus:outline-none focus:border-orange-600 resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span>Synthesize Walking Trail via Gemini AI</span>
              </>
            )}
          </button>
        </form>

        {generatedResult && (
          <div className="mt-2 p-4 rounded-xl bg-[#121214] border border-orange-500/30 text-xs text-white leading-relaxed max-h-48 overflow-y-auto">
            <span className="text-orange-400 font-bold block mb-1">Generated Trail Result:</span>
            {generatedResult}
          </div>
        )}
      </div>
    </div>
  );
};
