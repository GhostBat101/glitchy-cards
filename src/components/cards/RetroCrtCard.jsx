/**
 * RetroCrtCard - 3:4 portrait analog CRT specimen card featuring hardware scanline overlays, tube vignette, and cursor tracking.
 * Communicates with: src/App.jsx (receives globalMousePos).
 */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function RetroCrtCard({
  globalMousePos = { x: 0, y: 0 }
}) {
  const cardRef = useRef(null);
  const xQuickTo = useRef(null);
  const yQuickTo = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;

    xQuickTo.current = gsap.quickTo(cardRef.current, 'rotationY', {
      duration: 0.35,
      ease: 'power3.out'
    });

    yQuickTo.current = gsap.quickTo(cardRef.current, 'rotationX', {
      duration: 0.35,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;

    const rotX = -globalMousePos.y * 18;
    const rotY = globalMousePos.x * 18;

    if (xQuickTo.current) xQuickTo.current(rotY);
    if (yQuickTo.current) yQuickTo.current(rotX);
  }, [globalMousePos]);

  return (
    <div
      style={{ perspective: 1200 }}
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
            className="absolute inset-0 rounded-[2rem] pointer-events-none z-10"
            style={{
              boxShadow: 'inset 0 0 50px rgba(0,0,0,0.85), inset 0 0 15px rgba(0,0,0,0.95)'
            }}
          />
        </div>

        <div
          style={{ transform: 'translateZ(40px)' }}
          className="absolute inset-0 rounded-[2rem] pointer-events-none border border-amber-500/30 shadow-[inset_0_0_30px_rgba(255,183,3,0.2)]"
        />
      </div>
    </div>
  );
}
