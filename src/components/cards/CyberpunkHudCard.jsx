/**
 * CyberpunkHudCard - 3:4 portrait netrunner specimen card featuring floating 3D geometric HUD telemetry and cursor tracking.
 * Communicates with: src/App.jsx (receives globalMousePos).
 */
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CyberpunkHudCard({
  globalMousePos = { x: 0, y: 0 }
}) {
  const cardRef = useRef(null);
  const xQuickTo = useRef(null);
  const yQuickTo = useRef(null);

  const [eqHeights, setEqHeights] = useState([14, 28, 10, 22, 36, 16, 24, 12, 32, 18]);

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
            src="./assets/images/cyberpunk_seoul.png"
            alt=""
            className="w-full h-full object-cover rounded-[2rem] pointer-events-none filter saturate-[1.12]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none rounded-[2rem]" />
        </div>

        <div
          style={{ transform: 'translateZ(40px)' }}
          className="absolute inset-0 rounded-[2rem] pointer-events-none border border-laser-cyan/30 shadow-[inset_0_0_30px_rgba(0,246,255,0.2)]"
        />

        <div
          style={{ transform: 'translateZ(60px)' }}
          className="absolute inset-5 pointer-events-none z-20 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-5 h-5 border-t-2 border-l-2 border-laser-cyan/80" />
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-laser-cyan animate-ping" />
              <div className="w-1.5 h-1.5 rounded-full bg-laser-lime" />
            </div>
            <div className="w-5 h-5 border-t-2 border-r-2 border-laser-cyan/80" />
          </div>

          <div className="flex items-center justify-center my-auto">
            <div className="relative w-28 h-28 rounded-full border border-laser-cyan/30 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border border-dashed border-laser-magenta/40 animate-spin-slow" />
              <div className="absolute w-2.5 h-2.5 rounded-full bg-laser-cyan/90" />
              <div className="absolute w-32 h-[1px] bg-laser-cyan/20" />
              <div className="absolute h-32 w-[1px] bg-laser-cyan/20" />
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div className="w-5 h-5 border-b-2 border-l-2 border-laser-cyan/80" />

            <div className="flex items-end gap-1 h-8 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-laser-cyan/30">
              {eqHeights.map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-laser-cyan to-laser-lime rounded-t transition-all duration-100"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>

            <div className="w-5 h-5 border-b-2 border-r-2 border-laser-cyan/80" />
          </div>
        </div>
      </div>
    </div>
  );
}
