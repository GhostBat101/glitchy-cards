/**
 * RetroCrtCard - 3:4 portrait analog CRT specimen card featuring curved tube curvature, hardware scanlines, and sync loss micro-tremors.
 * Communicates with: src/App.jsx (receives globalMousePos and isGlitching state).
 */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function RetroCrtCard({
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

    const rotX = -globalMousePos.y * 22;
    const rotY = globalMousePos.x * 22;
    const transX = globalMousePos.x * 14;
    const transY = globalMousePos.y * 14;

    if (rotYQuick.current) rotYQuick.current(rotY);
    if (rotXQuick.current) rotXQuick.current(rotX);
    if (transXQuick.current) transXQuick.current(transX);
    if (transYQuick.current) transYQuick.current(transY);

    cardRef.current.style.setProperty('--glass-x', `${Math.round(50 - globalMousePos.x * 30)}%`);
    cardRef.current.style.setProperty('--glass-y', `${Math.round(50 - globalMousePos.y * 30)}%`);
  }, [globalMousePos]);

  useEffect(() => {
    if (!cardRef.current || !isGlitching) return;

    const tl = gsap.timeline();
    tl.to(cardRef.current, { y: '+=6', x: '-=4', duration: 0.04, ease: 'power1.inOut' })
      .to(cardRef.current, { y: '-=10', x: '+=7', duration: 0.04, ease: 'power1.inOut' })
      .to(cardRef.current, { y: '+=6', x: '-=5', duration: 0.04, ease: 'power1.inOut' })
      .to(cardRef.current, { y: '-=2', x: '+=2', duration: 0.04, ease: 'power1.out' });

    gsap.to(cardRef.current, {
      filter: 'contrast(1.6) brightness(1.3) hue-rotate(-25deg)',
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
            src="./assets/images/retro_crt_room.png"
            alt=""
            className="w-full h-full object-cover rounded-[2rem] pointer-events-none filter contrast-[1.08] saturate-[1.1]"
          />

          <div className="absolute inset-0 crt-aperture-grille pointer-events-none opacity-50 z-10" />
          <div className="absolute inset-0 crt-rgb-triads pointer-events-none opacity-30 z-10" />

          <div
            className="absolute inset-0 rounded-[2rem] pointer-events-none z-10 opacity-30 mix-blend-screen"
            style={{
              background: 'radial-gradient(circle at var(--glass-x, 50%) var(--glass-y, 50%), rgba(255,255,255,0.7) 0%, transparent 65%)'
            }}
          />

          <div
            className="absolute inset-0 rounded-[2rem] pointer-events-none z-10"
            style={{
              boxShadow: 'inset 0 0 50px rgba(0,0,0,0.85), inset 0 0 15px rgba(0,0,0,0.95)'
            }}
          />
        </div>

        <div
          style={{ transform: 'translateZ(40px)' }}
          className="absolute inset-0 rounded-[2rem] pointer-events-none border border-amber-500/35 shadow-[inset_0_0_35px_rgba(255,183,3,0.25)]"
        />
      </div>
    </div>
  );
}
