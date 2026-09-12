/**
 * App - Master presentation container set on neutral #7f7f7f canvas with ray-traced lighting, 3D cursor tracking, and light-reactive glitch bleeding.
 * Communicates with: src/components/LoadingScreen.jsx, src/components/DeckControls.jsx, src/components/ScreenGlitchCanvas.jsx, and card components.
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen.jsx';
import DeckControls from './components/DeckControls.jsx';
import ScreenGlitchCanvas from './components/ScreenGlitchCanvas.jsx';
import AiCoreCdCard from './components/cards/AiCoreCdCard.jsx';
import CyberpunkHudCard from './components/cards/CyberpunkHudCard.jsx';
import RetroCrtCard from './components/cards/RetroCrtCard.jsx';

const IMAGE_MAP = {
  'ai-core': './assets/images/dvd_jurassic_hand.png',
  'cyberpunk-hud': './assets/images/jet_hud_cockpit.png',
  'retro-crt': './assets/images/retro_crt_poltergeist.png'
};

const PRELOAD_IMAGES = Object.values(IMAGE_MAP);

const LIGHT_CONFIGS = {
  'off': null,
  'top-left': { x: -0.7, y: -0.7, z: 0.8, angle: 135, beamX: 12, beamY: 8, color: 'rgba(255, 248, 225, 0.35)' },
  'top': { x: 0, y: -1, z: 0.8, angle: 90, beamX: 50, beamY: 4, color: 'rgba(255, 248, 225, 0.35)' },
  'top-right': { x: 0.7, y: -0.7, z: 0.8, angle: 45, beamX: 88, beamY: 8, color: 'rgba(255, 248, 225, 0.35)' },
  'left': { x: -1, y: 0, z: 0.8, angle: 180, beamX: 4, beamY: 50, color: 'rgba(255, 248, 225, 0.35)' },
  'right': { x: 1, y: 0, z: 0.8, angle: 0, beamX: 96, beamY: 50, color: 'rgba(255, 248, 225, 0.35)' },
  'bottom-left': { x: -0.7, y: 0.7, z: 0.8, angle: 225, beamX: 12, beamY: 92, color: 'rgba(255, 248, 225, 0.35)' },
  'bottom': { x: 0, y: 1, z: 0.8, angle: 270, beamX: 50, beamY: 96, color: 'rgba(255, 248, 225, 0.35)' },
  'bottom-right': { x: 0.7, y: 0.7, z: 0.8, angle: 315, beamX: 88, beamY: 92, color: 'rgba(255, 248, 225, 0.35)' }
};

export default function App() {
  const [activeStyle, setActiveStyle] = useState('ai-core');
  const [glitchIntensity, setGlitchIntensity] = useState('medium');
  const [triggerCount, setTriggerCount] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cardRect, setCardRect] = useState(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const [lightPosition, setLightPosition] = useState('top-left');

  const mainRef = useRef(null);

  const activeLight = LIGHT_CONFIGS[lightPosition] || null;

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

  const handleAppLoaded = useCallback(() => {
    requestAnimationFrame(() => {
      updateCardRect();
    });
  }, [updateCardRect]);

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
      <LoadingScreen images={PRELOAD_IMAGES} onLoaded={handleAppLoaded} />

      {activeLight && (
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-all duration-500"
          style={{
            background: `radial-gradient(circle at ${activeLight.beamX}% ${activeLight.beamY}%, ${activeLight.color} 0%, transparent 65%)`
          }}
        />
      )}

      <ScreenGlitchCanvas
        activeStyle={activeStyle}
        cardRect={cardRect}
        glitchIntensity={glitchIntensity}
        triggerCount={triggerCount}
        activeImageSrc={IMAGE_MAP[activeStyle]}
        onGlitchActive={setIsGlitching}
        lightConfig={activeLight}
      />

      <div className="w-full h-2" />

      <main ref={mainRef} className="w-full flex-1 flex items-center justify-center my-auto py-4 md:py-6 relative z-10">
        {activeStyle === 'ai-core' && (
          <AiCoreCdCard
            globalMousePos={mousePos}
            isGlitching={isGlitching}
            lightConfig={activeLight}
          />
        )}

        {activeStyle === 'cyberpunk-hud' && (
          <CyberpunkHudCard
            globalMousePos={mousePos}
            isGlitching={isGlitching}
            lightConfig={activeLight}
          />
        )}

        {activeStyle === 'retro-crt' && (
          <RetroCrtCard
            globalMousePos={mousePos}
            isGlitching={isGlitching}
            lightConfig={activeLight}
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
          lightPosition={lightPosition}
          setLightPosition={setLightPosition}
        />
      </footer>
    </div>
  );
}
