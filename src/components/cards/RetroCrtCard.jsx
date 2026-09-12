/**
 * RetroCrtCard - Vintage analog CRT broadcast monitor card with authentic photographic imagery, phosphor scanlines, and GSAP V-hold sync loss decay.
 * Communicates with: src/App.jsx (receives glitchIntensity and triggerGlitchCount).
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { Tv, Radio, Volume2, AlertCircle } from 'lucide-react';

const INTENSITY_FACTORS = {
  low: 0.5,
  medium: 1.0,
  critical: 2.0
};

export default function RetroCrtCard({
  glitchIntensity = 'medium',
  triggerGlitchCount = 0
}) {
  const cardRef = useRef(null);
  const viewportRef = useRef(null);
  const rollBarRef = useRef(null);
  const xQuickTo = useRef(null);
  const yQuickTo = useRef(null);

  const [glitchActive, setGlitchActive] = useState(false);
  const [signalStatus, setSignalStatus] = useState('NTSC 525 • LOCKED');
  const [channelFreq, setChannelFreq] = useState('61.25 MHz');

  const glitchMultiplier = INTENSITY_FACTORS[glitchIntensity] || 1.0;

  const triggerCrtGlitch = useCallback(() => {
    if (!cardRef.current || !viewportRef.current || !rollBarRef.current) return;

    setGlitchActive(true);
    setSignalStatus('V-HOLD LOSS // SYNC ERR');
    setChannelFreq(`${(Math.random() * 5 + 59).toFixed(2)} MHz`);

    const tl = gsap.timeline({
      onComplete: () => {
        setGlitchActive(false);
        setSignalStatus('NTSC 525 • LOCKED');
        setChannelFreq('61.25 MHz');
      }
    });

    const intensity = glitchMultiplier;

    tl.to(rollBarRef.current, {
      y: '280px',
      duration: 0.35,
      ease: 'none',
      repeat: 2
    }, 0)
    .to(viewportRef.current, {
      x: () => (Math.random() - 0.5) * 14 * intensity,
      filter: 'contrast(1.4) brightness(1.2) hue-rotate(20deg)',
      duration: 0.06,
      repeat: 6,
      yoyo: true,
      ease: 'none'
    }, 0)
    .to(viewportRef.current, {
      x: 0,
      filter: 'contrast(1) brightness(1) hue-rotate(0deg)',
      duration: 0.15,
      ease: 'power2.out'
    });
  }, [glitchMultiplier]);

  useEffect(() => {
    if (!cardRef.current) return;

    xQuickTo.current = gsap.quickTo(cardRef.current, 'rotationY', {
      duration: 0.5,
      ease: 'power2.out'
    });

    yQuickTo.current = gsap.quickTo(cardRef.current, 'rotationX', {
      duration: 0.5,
      ease: 'power2.out'
    });
  }, []);

  useEffect(() => {
    if (triggerGlitchCount > 0) {
      triggerCrtGlitch();
    }
  }, [triggerGlitchCount, triggerCrtGlitch]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 10;
    const rotY = ((x - centerX) / centerX) * 10;

    if (xQuickTo.current) xQuickTo.current(rotY);
    if (yQuickTo.current) yQuickTo.current(rotX);
  };

  const handleMouseEnter = () => {
    if (Math.random() < 0.35 * glitchMultiplier) {
      triggerCrtGlitch();
    }
  };

  const handleMouseLeave = () => {
    if (xQuickTo.current) xQuickTo.current(0);
    if (yQuickTo.current) yQuickTo.current(0);
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="relative w-full max-w-[380px] aspect-[1/1.46] select-none cursor-pointer group"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={triggerCrtGlitch}
    >
      <div
        ref={cardRef}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full rounded-[2rem] bg-[#0d0d12] border border-amber-500/20 p-5 flex flex-col justify-between overflow-hidden terracotta-card-shadow transition-all duration-300 group-hover:border-amber-500/40"
      >
        <div className="relative z-20 flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Tv className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold tracking-wider text-amber-200">TRINITRON PVM</h4>
              <p className="text-[10px] font-mono text-slate-400">ANALOG BROADCAST • CH 03</p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>60Hz RGB</span>
          </div>
        </div>

        <div
          ref={viewportRef}
          className="relative z-10 my-auto w-full aspect-square rounded-2xl overflow-hidden bg-black border border-amber-500/20 flex items-center justify-center shadow-inner"
        >
          <img
            src="./assets/images/retro_crt_vhs.jpg"
            alt="Retro CRT Sony Trinitron Monitor"
            className="w-full h-full object-cover rounded-2xl pointer-events-none filter contrast-[1.05]"
          />

          <div className="absolute inset-0 crt-aperture-grille pointer-events-none opacity-50" />
          <div className="absolute inset-0 crt-rgb-triads pointer-events-none opacity-30" />

          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.85), inset 0 0 10px rgba(0,0,0,0.9)'
            }}
          />

          <div
            ref={rollBarRef}
            className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none -translate-y-20"
          />

          {glitchActive && (
            <>
              <div className="absolute inset-0 bg-amber-400/20 mix-blend-screen pointer-events-none glitch-slice-a -translate-x-3" />
              <div className="absolute inset-0 bg-rose-500/25 mix-blend-screen pointer-events-none glitch-slice-b translate-x-4" />
            </>
          )}

          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-[9px] font-mono text-amber-300">
            <Radio className="w-2.5 h-2.5" />
            <span>VHF BAND</span>
          </div>

          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-[9px] font-mono text-slate-300">
            <span>{channelFreq}</span>
          </div>

          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-slate-300">
            <div className="flex items-center gap-1.5 text-amber-300">
              <Volume2 className="w-3 h-3" />
              <span>MONO • 100%</span>
            </div>
            <span className="text-slate-400">75Ω HIGH-Z</span>
          </div>
        </div>

        <div className="relative z-20 flex flex-col gap-2.5 pt-3 border-t border-white/5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span>SYNC TIMING</span>
            </span>
            <span className={`font-bold ${glitchActive ? 'text-rose-400' : 'text-amber-400'}`}>
              {signalStatus}
            </span>
          </div>

          <div className="flex items-center justify-between bg-black/40 p-2 rounded-xl border border-amber-500/20 text-[10px] font-mono">
            <span className="text-amber-200 tracking-wider">TRACKING: AUTO-CAL</span>
            <span className="text-slate-500 uppercase text-[9px]">
              {glitchActive ? 'HEAD_CLEAN_REQ' : 'ANALOG_STABLE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
