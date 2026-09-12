/**
 * AiCoreCdCard - 3:4 portrait credit-card specimen with physical edge thickness, ray-traced anisotropic diffraction, and directional cast shadows.
 * Communicates with: src/App.jsx (receives globalMousePos, isGlitching, and lightConfig).
 */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AiCoreCdCard({
  globalMousePos = { x: 0, y: 0 },
  isGlitching = false,
  lightConfig = null
}) {
  const cardRef = useRef(null);
  const rotXQuick = useRef(null);
  const rotYQuick = useRef(null);
  const transXQuick = useRef(null);
  const transYQuick = useRef(null);

  const shadowX = lightConfig ? -lightConfig.x * 32 : 0;
  const shadowY = lightConfig ? -lightConfig.y * 32 : 24;
  const shadowBlur = lightConfig ? 55 : 45;
  const shadowOpacity = lightConfig ? 0.6 : 0.45;

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

    const baseAngle = Math.atan2(globalMousePos.y, globalMousePos.x) * (180 / Math.PI) + 180;
    const lightAngle = lightConfig ? lightConfig.angle : 0;
    const combinedAngle = (baseAngle + lightAngle * 0.5) % 360;

    const lightOffsetX = lightConfig ? lightConfig.x * 30 : 0;
    const lightOffsetY = lightConfig ? lightConfig.y * 30 : 0;
    const glareX = Math.round(50 - globalMousePos.x * 35 + lightOffsetX);
    const glareY = Math.round(50 - globalMousePos.y * 35 + lightOffsetY);

    cardRef.current.style.setProperty('--diffraction-angle', `${Math.round(combinedAngle)}deg`);
    cardRef.current.style.setProperty('--glare-x', `${glareX}%`);
    cardRef.current.style.setProperty('--glare-y', `${glareY}%`);
  }, [globalMousePos, lightConfig]);

  useEffect(() => {
    if (!cardRef.current || !isGlitching) return;

    const tl = gsap.timeline();
    tl.to(cardRef.current, { x: '+=6', duration: 0.05, ease: 'power1.inOut' })
      .to(cardRef.current, { x: '-=12', duration: 0.05, ease: 'power1.inOut' })
      .to(cardRef.current, { x: '+=9', duration: 0.05, ease: 'power1.inOut' })
      .to(cardRef.current, { x: '-=3', duration: 0.05, ease: 'power1.out' });

    gsap.to(cardRef.current, {
      filter: 'hue-rotate(90deg) saturate(1.5) brightness(1.2)',
      duration: 0.08,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut'
    });
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
          className="absolute inset-0 rounded-[2rem] bg-[#1a1a1a] border border-black/60"
        />

        <div
          style={{ transform: 'translateZ(-2px)' }}
          className="absolute inset-0 rounded-[2rem] bg-[#222222] border border-neutral-700/50"
        />

        <div
          style={{ transform: 'translateZ(0px)' }}
          className="absolute inset-0 rounded-[2rem] bg-[#2a2a2a] border border-neutral-500/40"
        />

        <div
          style={{ transform: 'translateZ(2px)' }}
          className="absolute inset-0 rounded-[2rem] bg-[#1f1f1f] border border-neutral-400/30"
        />

        <div
          style={{ transform: 'translateZ(4px)' }}
          className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),_inset_0_-1px_2px_rgba(0,0,0,0.5)] border border-white/20"
        >
          <img
            src="./assets/images/dvd_jurassic_hand.png"
            alt=""
            className="w-full h-full object-cover rounded-[2rem] pointer-events-none"
          />

          <div className="absolute inset-0 rounded-[2rem] cd-diffraction-overlay pointer-events-none opacity-50" />

          <div
            className="absolute inset-0 rounded-[2rem] pointer-events-none opacity-45 mix-blend-overlay transition-all duration-300"
            style={{
              background: 'radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 60%)'
            }}
          />

          <div
            className="absolute inset-0 rounded-[2rem] pointer-events-none opacity-40 mix-blend-overlay"
            style={{
              background: 'conic-gradient(from var(--diffraction-angle) at 50% 50%, transparent 35%, rgba(255,255,255,0.95) 50%, transparent 65%)'
            }}
          />

          {lightConfig && (
            <div
              className="absolute inset-0 rounded-[2rem] pointer-events-none mix-blend-color-dodge opacity-30 transition-all duration-500"
              style={{
                background: `linear-gradient(${lightConfig.angle + 180}deg, rgba(255,245,210,0.7) 0%, transparent 70%)`
              }}
            />
          )}
        </div>

        <div
          style={{ transform: 'translateZ(45px)' }}
          className="absolute inset-0 rounded-[2rem] pointer-events-none border border-white/30 shadow-[inset_0_0_35px_rgba(255,255,255,0.25)]"
        />
      </div>
    </div>
  );
}
