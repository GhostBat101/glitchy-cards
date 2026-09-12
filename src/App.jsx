/**
 * App - Master presentation container set on neutral #7f7f7f canvas with window-level 3D cursor tracking and zero-text staging.
 * Communicates with: src/components/DeckControls.jsx and card components (AiCoreCdCard, CyberpunkHudCard, RetroCrtCard).
 */
import React, { useState, useCallback } from 'react';
import DeckControls from './components/DeckControls.jsx';
import AiCoreCdCard from './components/cards/AiCoreCdCard.jsx';
import CyberpunkHudCard from './components/cards/CyberpunkHudCard.jsx';
import RetroCrtCard from './components/cards/RetroCrtCard.jsx';

export default function App() {
  const [activeStyle, setActiveStyle] = useState('ai-core');
  const [glitchIntensity, setGlitchIntensity] = useState('medium');
  const [triggerCount, setTriggerCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleTriggerGlitch = useCallback(() => {
    setTriggerCount(prev => prev + 1);
  }, []);

  const handleGlobalMouseMove = useCallback((e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setMousePos({ x, y });
  }, []);

  return (
    <div
      onMouseMove={handleGlobalMouseMove}
      className="min-h-screen bg-[#7f7f7f] flex flex-col justify-between items-center p-4 md:p-8 relative overflow-hidden select-none"
    >
      <div className="w-full h-2" />

      <main className="w-full flex-1 flex items-center justify-center my-auto py-4 md:py-6">
        {activeStyle === 'ai-core' && (
          <AiCoreCdCard
            glitchIntensity={glitchIntensity}
            isSpinning={isSpinning}
            triggerGlitchCount={triggerCount}
            globalMousePos={mousePos}
          />
        )}

        {activeStyle === 'cyberpunk-hud' && (
          <CyberpunkHudCard
            glitchIntensity={glitchIntensity}
            triggerGlitchCount={triggerCount}
            globalMousePos={mousePos}
          />
        )}

        {activeStyle === 'retro-crt' && (
          <RetroCrtCard
            glitchIntensity={glitchIntensity}
            triggerGlitchCount={triggerCount}
            globalMousePos={mousePos}
          />
        )}
      </main>

      <footer className="w-full max-w-xl mx-auto pt-2 pb-2">
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
