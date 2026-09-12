/**
 * App - Root showcase container featuring 3D card presentation stage, telemetry header, and interactive controls dock.
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
    <div className="min-h-screen bg-[#06080d] text-slate-100 flex flex-col justify-between p-4 md:p-8 relative overflow-hidden select-none">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-laser-cyan/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-laser-magenta/10 rounded-full blur-[120px] pointer-events-none" />

      <header className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-laser-magenta to-laser-cyan p-0.5 shadow-lg shadow-laser-cyan/20">
            <div className="w-full h-full bg-obsidian-900 rounded-[10px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-laser-cyan" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-mono font-bold tracking-wider text-white">GLITCHY CARDS</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-laser-cyan border border-white/10">
                LABS v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">EXPERIMENTAL COMPONENT SHOWCASE & DECK</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2 bg-obsidian-900/80 px-3 py-1.5 rounded-xl border border-white/5">
            <span className="w-2 h-2 rounded-full bg-laser-lime animate-ping" />
            <span className="text-slate-300">CORE 60FPS</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-obsidian-900/80 px-3 py-1.5 rounded-xl border border-white/5">
            <Activity className="w-3.5 h-3.5 text-laser-magenta" />
            <span>RENDER: HARDWARE ACCEL</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center my-8 md:my-12">
        <div className="w-full flex items-center justify-center">
          {activeStyle === 'ai-core' && (
            <AiCoreCdCard
              glitchIntensity={glitchIntensity}
              isSpinning={isSpinning}
              triggerGlitchCount={triggerCount}
            />
          )}

          {activeStyle === 'cyberpunk-hud' && (
            <CyberpunkHudCard />
          )}

          {activeStyle === 'retro-crt' && (
            <RetroCrtCard />
          )}
        </div>
      </main>

      <footer className="relative z-10 max-w-6xl mx-auto w-full pt-4">
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
