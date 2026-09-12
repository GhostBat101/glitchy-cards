/**
 * AiCoreCdCard - 3:4 portrait optical specimen card featuring real-time caustic light diffraction, floating 3D depth, and cursor tracking.
 * Communicates with: src/App.jsx (receives globalMousePos).
 */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AiCoreCdCard({
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

    const angle = Math.atan2(globalMousePos.y, globalMousePos.x) * (180 / Math.PI) + 180;
    cardRef.current.style.setProperty('--diffraction-angle', `${Math.round(angle)}deg`);
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
            src="./assets/images/optical_sunburst.png"
            alt=""
            className="w-full h-full object-cover rounded-[2rem] pointer-events-none"
          />

          <div className="absolute inset-0 rounded-[2rem] cd-diffraction-overlay pointer-events-none opacity-60" />

          <div
            className="absolute inset-0 rounded-[2rem] pointer-events-none opacity-30 mix-blend-overlay"
            style={{
              background: 'conic-gradient(from var(--diffraction-angle) at 50% 50%, transparent 40%, rgba(255,255,255,0.95) 50%, transparent 60%)'
            }}
          />
        </div>

        <div
          style={{ transform: 'translateZ(40px)' }}
          className="absolute inset-0 rounded-[2rem] pointer-events-none border border-white/20 shadow-[inset_0_0_30px_rgba(255,255,255,0.2)]"
        />
      </div>
    </div>
  );
}
