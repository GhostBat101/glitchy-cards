/**
 * App - Master showcase presentation container set on neutral terracotta (#E96C3B) canvas with 3D card stage and floating controls dock.
 * Communicates with: src/components/DeckControls.jsx and card components (AiCoreCdCard, CyberpunkHudCard, RetroCrtCard).
 */
import React, { useState, useCallback } from 'react';
import { Layers, Activity } from 'lucide-react';
import DeckControls from './components/DeckControls.jsx';
import AiCoreCdCard from './components/cards/AiCoreCdCard.jsx';
import CyberpunkHudCard from './components/cards/CyberpunkHudCard.jsx';
import RetroCrtCard from './components/cards/RetroCrtCard.jsx';

export default function App() {
  const [activeStyle, setActiveStyle] = useState('ai-core');
  const [glitchIntensity, setGlitchIntensity] = useState('medium');
  const [triggerCount, setTriggerCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);

  const handleTriggerGlitch = useCallback(() => {
    setTriggerCount(prev => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-[#E96C3B] text-slate-100 flex flex-col justify-between p-4 md:p-8 relative overflow-hidden select-none">
      <header className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-5xl mx-auto w-full pb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-black/30 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-mono font-bold tracking-widest text-black">GLITCHY CARDS</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/10 text-black border border-black/20 font-bold">
                LABS v2.0
              </span>
            </div>
            <p className="text-[11px] text-black/75 font-mono">HIGH-FIDELITY COMPONENT EXPERIMENTS</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/10 text-black font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>60FPS ACCELERATED</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/10 text-black">
            <Activity className="w-3.5 h-3.5 text-black" />
            <span>OPTICAL & ANALOG SHADERS</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center my-6 md:my-10">
        <div className="w-full flex items-center justify-center">
          {activeStyle === 'ai-core' && (
            <AiCoreCdCard
              glitchIntensity={glitchIntensity}
              isSpinning={isSpinning}
              triggerGlitchCount={triggerCount}
            />
          )}

          {activeStyle === 'cyberpunk-hud' && (
            <CyberpunkHudCard
              glitchIntensity={glitchIntensity}
              triggerGlitchCount={triggerCount}
            />
          )}

          {activeStyle === 'retro-crt' && (
            <RetroCrtCard
              glitchIntensity={glitchIntensity}
              triggerGlitchCount={triggerCount}
            />
          )}
        </div>
      </main>

      <footer className="relative z-10 max-w-5xl mx-auto w-full pt-2">
        <DeckControls
          activeStyle={activeStyle}
          setActiveStyle={setActiveStyle}
          glitchIntensity={glitchIntensity}
          setGlitchIntensity={setGlitchIntensity}
          onTriggerGlitch={handleTriggerGlitch}
          isSpinning={isSpinning}
          setIsSpinning={setIsSpinning}
        />
      </footer>
    </div>
  );
}
