/**
 * App - Master presentation container set on neutral #7f7f7f canvas with window-level 3D cursor tracking, zero-text staging, and full-screen gradient glitch bleeding.
 * Communicates with: src/components/DeckControls.jsx, src/components/ScreenGlitchCanvas.jsx, and card components (AiCoreCdCard, CyberpunkHudCard, RetroCrtCard).
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import DeckControls from './components/DeckControls.jsx';
import ScreenGlitchCanvas from './components/ScreenGlitchCanvas.jsx';
import AiCoreCdCard from './components/cards/AiCoreCdCard.jsx';
import CyberpunkHudCard from './components/cards/CyberpunkHudCard.jsx';
import RetroCrtCard from './components/cards/RetroCrtCard.jsx';

const IMAGE_MAP = {
  'ai-core': './assets/images/optical_sunburst.png',
  'cyberpunk-hud': './assets/images/cyberpunk_seoul.png',
  'retro-crt': './assets/images/retro_crt_room.png'
};

export default function App() {
  const [activeStyle, setActiveStyle] = useState('ai-core');
  const [glitchIntensity, setGlitchIntensity] = useState('medium');
  const [triggerCount, setTriggerCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cardRect, setCardRect] = useState(null);

  const mainRef = useRef(null);

  const handleTriggerGlitch = useCallback(() => {
    setTriggerCount(prev => prev + 1);
  }, []);

  const handleGlobalMouseMove = useCallback((e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setMousePos({ x, y });
  }, []);

  const updateCardRect = useCallback(() => {
    if (mainRef.current) {
      const cardEl = mainRef.current.querySelector('.group');
      if (cardEl) {
        setCardRect(cardEl.getBoundingClientRect());
      }
    }
  }, []);

  useEffect(() => {
    updateCardRect();
    window.addEventListener('resize', updateCardRect);
    return () => window.removeEventListener('resize', updateCardRect);
  }, [updateCardRect, activeStyle]);

  return (
    <div
      onMouseMove={handleGlobalMouseMove}
      className="min-h-screen bg-[#7f7f7f] flex flex-col justify-between items-center p-4 md:p-8 relative overflow-hidden select-none"
    >
      <ScreenGlitchCanvas
        activeStyle={activeStyle}
        cardRect={cardRect}
        glitchIntensity={glitchIntensity}
        triggerCount={triggerCount}
        activeImageSrc={IMAGE_MAP[activeStyle]}
      />

      <div className="w-full h-2" />

      <main ref={mainRef} className="w-full flex-1 flex items-center justify-center my-auto py-4 md:py-6 relative z-10">
        {activeStyle === 'ai-core' && (
          <AiCoreCdCard
            globalMousePos={mousePos}
          />
        )}

        {activeStyle === 'cyberpunk-hud' && (
          <CyberpunkHudCard
            globalMousePos={mousePos}
          />
        )}

        {activeStyle === 'retro-crt' && (
          <RetroCrtCard
            globalMousePos={mousePos}
          />
        )}
      </main>

      <footer className="w-full max-w-xl mx-auto pt-2 pb-2 relative z-30">
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
