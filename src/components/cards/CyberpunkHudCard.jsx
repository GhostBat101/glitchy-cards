/**
 * CyberpunkHudCard - 3:4 portrait cockpit HUD specimen card with physically ray-traced canopy glass, light-driven specular reflections, and optical clarity.
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

    if (lightConfig) {
      const radX = (rotX * Math.PI) / 180;
      const radY = (rotY * Math.PI) / 180;
      const nx = -Math.sin(radY);
      const ny = Math.sin(radX);
      const nz = Math.cos(radY) * Math.cos(radX);

      const lx = lightConfig.x;
      const ly = lightConfig.y;
      const lz = lightConfig.z || 0.85;
      const lLen = Math.sqrt(lx * lx + ly * ly + lz * lz) || 1;
      const nlx = lx / lLen;
      const nly = ly / lLen;
      const nlz = lz / lLen;

      const vx = 0;
      const vy = 0;
      const vz = 1;

      const hx = nlx + vx;
      const hy = nly + vy;
      const hz = nlz + vz;
      const hLen = Math.sqrt(hx * hx + hy * hy + hz * hz) || 1;
      const nhx = hx / hLen;
      const nhy = hy / hLen;
      const nhz = hz / hLen;

      const ndoth = Math.max(0, nx * nhx + ny * nhy + nz * nhz);
      const specFactor = Math.pow(ndoth, 20);

      const specX = Math.round(50 + nlx * 30 + nx * 40);
      const specY = Math.round(50 + nly * 30 + ny * 40);
      const specAngle = Math.round(Math.atan2(nly, nlx) * (180 / Math.PI));

      cardRef.current.style.setProperty('--spec-x', `${specX}%`);
      cardRef.current.style.setProperty('--spec-y', `${specY}%`);
      cardRef.current.style.setProperty('--spec-intensity', (specFactor * 0.85).toFixed(3));
      cardRef.current.style.setProperty('--spec-angle', `${specAngle}deg`);
    } else {
      cardRef.current.style.setProperty('--spec-intensity', '0');
    }
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
          className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-[inset_0_1.5px_3px_rgba(255,255,255,0.4),_inset_0_-1.5px_3px_rgba(0,0,0,0.6)] border border-white/20"
        >
          <img
            src="./assets/images/jet_hud_cockpit.png"
            alt=""
            className="w-full h-full object-cover rounded-[2rem] pointer-events-none filter saturate-[1.18] contrast-[1.05]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25 pointer-events-none rounded-[2rem]" />

          <div className="absolute inset-0 rounded-[2rem] hud-glass-clarity pointer-events-none z-10" />

          <div className="absolute inset-0 rounded-[2rem] hud-fresnel-glance pointer-events-none z-10" />

          <div className="absolute inset-0 rounded-[2rem] hud-raytraced-specular pointer-events-none z-10" />

          {lightConfig && (
            <div
              className="absolute inset-0 rounded-[2rem] pointer-events-none z-10 mix-blend-screen opacity-50 transition-all duration-500"
              style={{
                background: `linear-gradient(${lightConfig.angle}deg, rgba(255, 255, 255, 0.45) 0%, rgba(0, 246, 255, 0.2) 25%, transparent 65%)`
              }}
            />
          )}

          {lightConfig && (
            <div
              className="absolute inset-0 rounded-[2rem] pointer-events-none z-10 transition-all duration-500"
              style={{
                boxShadow: `inset ${-lightConfig.x * 4}px ${-lightConfig.y * 4}px 12px rgba(255, 255, 255, 0.4)`
              }}
            />
          )}
        </div>

        <div
          style={{ transform: 'translateZ(40px)' }}
          className="absolute inset-0 rounded-[2rem] pointer-events-none border border-cyan-400/30 shadow-[inset_0_0_25px_rgba(0,246,255,0.2),_0_0_15px_rgba(0,246,255,0.15)] overflow-hidden"
        >
          {lightConfig && (
            <div
              className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40 transition-opacity duration-500"
              style={{
                background: `linear-gradient(${lightConfig.angle}deg, rgba(255, 255, 255, 0.3) 0%, transparent 60%)`
              }}
            />
          )}
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
