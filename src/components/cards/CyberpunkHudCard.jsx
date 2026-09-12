/**
 * CyberpunkHudCard - 3:4 portrait cockpit HUD specimen card with multi-layer high-gloss canopy glass, specular glare, and ray-traced reflections.
 * Communicates with: src/App.jsx (receives globalMousePos, isGlitching, and lightConfig).
 */
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CyberpunkHudCard({
  globalMousePos = { x: 0, y: 0 },
  isGlitching = false,
  lightConfig = null
}) {
  const cardRef = useRef(null);
  const rotXQuick = useRef(null);
  const rotYQuick = useRef(null);
  const transXQuick = useRef(null);
  const transYQuick = useRef(null);

  const [eqHeights, setEqHeights] = useState([14, 28, 10, 22, 36, 16, 24, 12, 32, 18]);

  const shadowX = lightConfig ? -lightConfig.x * 32 : 0;
  const shadowY = lightConfig ? -lightConfig.y * 32 : 24;
  const shadowBlur = lightConfig ? 55 : 45;
  const shadowOpacity = lightConfig ? 0.6 : 0.45;

  useEffect(() => {
    const interval = setInterval(() => {
      setEqHeights(prev =>
        prev.map(() => Math.floor(Math.random() * 28 + 6))
      );
    }, 120);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;

    rotYQuick.current = gsap.quickTo(cardRef.current, 'rotationY', {
      duration: 0.25,
      ease: 'power2.out'
    });

    rotXQuick.current = gsap.quickTo(cardRef.current, 'rotationX', {
      duration: 0.25,
      ease: 'power2.out'
    });

    transXQuick.current = gsap.quickTo(cardRef.current, 'x', {
      duration: 0.25,
      ease: 'power2.out'
    });

    transYQuick.current = gsap.quickTo(cardRef.current, 'y', {
      duration: 0.25,
      ease: 'power2.out'
    });
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;

    const rotX = -globalMousePos.y * 24;
    const rotY = globalMousePos.x * 24;
    const transX = globalMousePos.x * 16;
    const transY = globalMousePos.y * 16;

    if (rotYQuick.current) rotYQuick.current(rotY);
    if (rotXQuick.current) rotXQuick.current(rotX);
    if (transXQuick.current) transXQuick.current(transX);
    if (transYQuick.current) transYQuick.current(transY);

    const lightOffsetX = lightConfig ? lightConfig.x * 30 : 0;
    const lightOffsetY = lightConfig ? lightConfig.y * 30 : 0;
    const glossX = Math.round(50 - globalMousePos.x * 35 + lightOffsetX);
    const glossY = Math.round(50 - globalMousePos.y * 35 + lightOffsetY);

    cardRef.current.style.setProperty('--gloss-x', `${glossX}%`);
    cardRef.current.style.setProperty('--gloss-y', `${glossY}%`);
  }, [globalMousePos, lightConfig]);

  useEffect(() => {
    if (!cardRef.current || !isGlitching) return;

    const tl = gsap.timeline();
    tl.to(cardRef.current, { x: '+=7', duration: 0.04, ease: 'power1.inOut' })
      .to(cardRef.current, { x: '-=14', duration: 0.04, ease: 'power1.inOut' })
      .to(cardRef.current, { x: '+=10', duration: 0.04, ease: 'power1.inOut' })
      .to(cardRef.current, { x: '-=3', duration: 0.04, ease: 'power1.out' });

    gsap.to(cardRef.current, {
      filter: 'saturate(2.2) hue-rotate(180deg) brightness(1.25)',
      duration: 0.08,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut'
    });

    setEqHeights(prev => prev.map(() => Math.floor(Math.random() * 26 + 12)));
  }, [isGlitching]);

  return (
    <div
      style={{ perspective: 1000 }}
      className="relative w-full max-w-[400px] aspect-[3/4] select-none cursor-pointer group"
    >
      <div
        ref={cardRef}
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0,0,0,${shadowOpacity})`
        }}
        className="relative w-full h-full rounded-[2rem] overflow-visible transition-shadow duration-500"
      >
        <div
          style={{ transform: 'translateZ(-4px)' }}
          className="absolute inset-0 rounded-[2rem] bg-[#071318] border border-black/70"
        />

        <div
          style={{ transform: 'translateZ(-2px)' }}
          className="absolute inset-0 rounded-[2rem] bg-[#0b1c24] border border-cyan-950/60"
        />

        <div
          style={{ transform: 'translateZ(0px)' }}
          className="absolute inset-0 rounded-[2rem] bg-[#0e2530] border border-cyan-800/40"
        />

        <div
          style={{ transform: 'translateZ(2px)' }}
          className="absolute inset-0 rounded-[2rem] bg-[#0a1e28] border border-cyan-600/30"
        />

        <div
          style={{ transform: 'translateZ(4px)' }}
          className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-[inset_0_2px_4px_rgba(255,255,255,0.85),_inset_2px_0_3px_rgba(0,246,255,0.6),_inset_0_-2px_4px_rgba(0,0,0,0.7)] border-2 border-white/40"
        >
          <img
            src="./assets/images/jet_hud_cockpit.png"
            alt=""
            className="w-full h-full object-cover rounded-[2rem] pointer-events-none filter saturate-[1.18] contrast-[1.05]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25 pointer-events-none rounded-[2rem]" />

          <div className="absolute inset-0 rounded-[2rem] hud-gloss-canopy pointer-events-none opacity-85 z-10" />

          <div className="absolute inset-0 rounded-[2rem] hud-specular-glare pointer-events-none opacity-80 z-10 transition-all duration-300" />

          <div className="absolute inset-0 rounded-[2rem] hud-glass-sheen pointer-events-none opacity-60 z-10" />

          {lightConfig && (
            <div
              className="absolute inset-0 rounded-[2rem] pointer-events-none z-10 mix-blend-screen opacity-80 transition-all duration-500"
              style={{
                background: `linear-gradient(${lightConfig.angle}deg, rgba(255, 255, 255, 0.85) 0%, rgba(0, 246, 255, 0.6) 25%, rgba(57, 255, 20, 0.2) 45%, transparent 75%)`
              }}
            />
          )}

          {lightConfig && (
            <div
              className="absolute inset-0 rounded-[2rem] pointer-events-none z-10 transition-all duration-500"
              style={{
                boxShadow: `inset ${-lightConfig.x * 6}px ${-lightConfig.y * 6}px 18px rgba(255, 255, 255, 0.75)`
              }}
            />
          )}
        </div>

        <div
          style={{ transform: 'translateZ(40px)' }}
          className="absolute inset-0 rounded-[2rem] pointer-events-none border border-white/50 shadow-[inset_0_0_35px_rgba(0,246,255,0.35),_0_0_20px_rgba(0,246,255,0.3)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40 pointer-events-none mix-blend-screen" />
        </div>

        <div
          style={{ transform: 'translateZ(65px)' }}
          className="absolute inset-5 pointer-events-none z-20 flex flex-col justify-between drop-shadow-[0_4px_16px_rgba(0,246,255,0.35)]"
        >
          <div className="flex items-center justify-between">
            <div className="w-5 h-5 border-t-2 border-l-2 border-laser-cyan/90" />
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-laser-cyan animate-ping" />
              <div className="w-1.5 h-1.5 rounded-full bg-laser-lime" />
            </div>
            <div className="w-5 h-5 border-t-2 border-r-2 border-laser-cyan/90" />
          </div>

          <div className="flex items-center justify-center my-auto">
            <div className="relative w-28 h-28 rounded-full border border-laser-cyan/40 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border border-dashed border-laser-magenta/50 animate-spin-slow" />
              <div className="absolute w-2.5 h-2.5 rounded-full bg-laser-cyan shadow-[0_0_8px_#00f6ff]" />
              <div className="absolute w-32 h-[1px] bg-laser-cyan/30" />
              <div className="absolute h-32 w-[1px] bg-laser-cyan/30" />
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div className="w-5 h-5 border-b-2 border-l-2 border-laser-cyan/90" />

            <div className="flex items-end gap-1 h-8 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-laser-cyan/35">
              {eqHeights.map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-laser-cyan to-laser-lime rounded-t transition-all duration-100"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>

            <div className="w-5 h-5 border-b-2 border-r-2 border-laser-cyan/90" />
          </div>
        </div>
      </div>
    </div>
  );
}
