/**
 * AiCoreCdCard - 3:4 portrait optical specimen card featuring real-time caustic light diffraction, floating 3D depth, specular reflections, and cursor tracking.
 * Communicates with: src/App.jsx (receives globalMousePos and isGlitching state).
 */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AiCoreCdCard({
  globalMousePos = { x: 0, y: 0 },
  isGlitching = false
}) {
  const cardRef = useRef(null);
  const rotXQuick = useRef(null);
  const rotYQuick = useRef(null);
  const transXQuick = useRef(null);
  const transYQuick = useRef(null);

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

    const angle = Math.atan2(globalMousePos.y, globalMousePos.x) * (180 / Math.PI) + 180;
    cardRef.current.style.setProperty('--diffraction-angle', `${Math.round(angle)}deg`);
    cardRef.current.style.setProperty('--glare-x', `${Math.round(50 - globalMousePos.x * 35)}%`);
    cardRef.current.style.setProperty('--glare-y', `${Math.round(50 - globalMousePos.y * 35)}%`);
  }, [globalMousePos]);

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
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full rounded-[2rem] overflow-visible neutral-3d-shadow transition-shadow duration-300"
      >
        <div
          style={{ transform: 'translateZ(0px)' }}
          className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl"
        >
          <img
            src="./assets/images/optical_sunburst.png"
            alt=""
            className="w-full h-full object-cover rounded-[2rem] pointer-events-none"
          />

          <div className="absolute inset-0 rounded-[2rem] cd-diffraction-overlay pointer-events-none opacity-60" />

          <div
            className="absolute inset-0 rounded-[2rem] pointer-events-none opacity-40 mix-blend-overlay"
            style={{
              background: 'radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 65%)'
            }}
          />

          <div
            className="absolute inset-0 rounded-[2rem] pointer-events-none opacity-30 mix-blend-overlay"
            style={{
              background: 'conic-gradient(from var(--diffraction-angle) at 50% 50%, transparent 40%, rgba(255,255,255,0.95) 50%, transparent 60%)'
            }}
          />
        </div>

        <div
          style={{ transform: 'translateZ(45px)' }}
          className="absolute inset-0 rounded-[2rem] pointer-events-none border border-white/25 shadow-[inset_0_0_35px_rgba(255,255,255,0.25)]"
        />
      </div>
    </div>
  );
}
