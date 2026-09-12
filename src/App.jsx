/**
 * App - Master presentation showcase container on neutral terracotta (#E96C3B) canvas with zero-text sculptural card staging.
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

  const handleTriggerGlitch = useCallback(() => {
    setTriggerCount(prev => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-[#E96C3B] flex flex-col justify-between items-center p-4 md:p-8 relative overflow-hidden select-none">
      <div className="w-full h-4" />

      <main className="w-full flex-1 flex items-center justify-center my-auto py-4">
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
      </main>

      <footer className="w-full max-w-xl mx-auto pt-4 pb-2">
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
