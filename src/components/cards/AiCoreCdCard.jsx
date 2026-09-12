/**
 * AiCoreCdCard - High-fidelity optical CD artifact card with authentic photorealistic disc imagery, dynamic laser diffraction, and GSAP laser-jump slice displacement.
 * Communicates with: src/App.jsx (receives glitchIntensity, isSpinning, and triggerGlitchCount).
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { Disc, Radio, Activity, Binary } from 'lucide-react';

const HEX_CHARS = '0123456789ABCDEF!@#$%&*';

const INTENSITY_FACTORS = {
  low: 0.5,
  medium: 1.0,
  critical: 2.0
};

export default function AiCoreCdCard({
  glitchIntensity = 'medium',
  isSpinning = true,
  triggerGlitchCount = 0
}) {
  const cardRef = useRef(null);
  const discRef = useRef(null);
  const viewportRef = useRef(null);
  const xQuickTo = useRef(null);
  const yQuickTo = useRef(null);

  const [glitchActive, setGlitchActive] = useState(false);
  const [hexDump, setHexDump] = useState('0x7F 0x00 0xA4 0xCD');
  const [integrityPercent, setIntegrityPercent] = useState(78.4);

  const glitchMultiplier = INTENSITY_FACTORS[glitchIntensity] || 1.0;

  const triggerLaserError = useCallback(() => {
    if (!cardRef.current || !discRef.current || !viewportRef.current) return;

    setGlitchActive(true);
    setIntegrityPercent(prev => Math.max(14.2, +(prev - (Math.random() * 6 + 3)).toFixed(1)));

    const scrambleInterval = setInterval(() => {
      let scrambled = '0x';
      for (let i = 0; i < 4; i++) {
        scrambled += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
      }
      scrambled += ' 0x';
      for (let i = 0; i < 4; i++) {
        scrambled += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
      }
      setHexDump(scrambled);
    }, 60);

    const tl = gsap.timeline({
      onComplete: () => {
        clearInterval(scrambleInterval);
        setGlitchActive(false);
        setHexDump('0x7F 0x00 0xA4 0xCD');
      }
    });

    const intensity = glitchMultiplier;

    tl.to(viewportRef.current, {
      x: () => (Math.random() - 0.5) * 16 * intensity,
      y: () => (Math.random() - 0.5) * 10 * intensity,
      duration: 0.05,
      repeat: 5,
      yoyo: true,
      ease: 'none'
    })
    .to(discRef.current, {
      rotation: `+=${(Math.random() > 0.5 ? 90 : -90) * intensity}`,
      scale: 1.02,
      duration: 0.25,
      ease: 'elastic.out(1, 0.4)'
    }, 0)
    .to(viewportRef.current, {
      x: 0,
      y: 0,
      duration: 0.1,
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

    const spinTween = gsap.to(discRef.current, {
      rotation: 360,
      duration: 16,
      repeat: -1,
      ease: 'none',
      paused: !isSpinning
    });

    if (isSpinning) {
      spinTween.play();
    } else {
      spinTween.pause();
    }

    return () => {
      spinTween.kill();
    };
  }, [isSpinning]);

  useEffect(() => {
    if (triggerGlitchCount > 0) {
      triggerLaserError();
    }
  }, [triggerGlitchCount, triggerLaserError]);

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

    const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 180;
    cardRef.current.style.setProperty('--diffraction-angle', `${Math.round(angle)}deg`);
  };

  const handleMouseEnter = () => {
    if (Math.random() < 0.35 * glitchMultiplier) {
      triggerLaserError();
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
      onClick={triggerLaserError}
    >
      <div
        ref={cardRef}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full rounded-[2rem] bg-[#0c0f17] border border-white/10 p-5 flex flex-col justify-between overflow-hidden terracotta-card-shadow transition-all duration-300 group-hover:border-white/20"
      >
        <div className="relative z-20 flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-laser-cyan">
              <Disc className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold tracking-wider text-white">OPTICAL ARCHIVE</h4>
              <p className="text-[10px] font-mono text-slate-400">CORRUPTED AI CORE • 0x8F</p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <span>CRC_FAIL</span>
          </div>
        </div>

        <div
          ref={viewportRef}
          className="relative z-10 my-auto w-full aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center p-3"
        >
          <div
            ref={discRef}
            className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border border-white/10"
          >
            <img
              src="./assets/images/ai_core_cd.jpg"
              alt="Corrupted AI Core Optical CD"
              className="w-full h-full object-cover rounded-full pointer-events-none"
            />

            <div className="absolute inset-0 rounded-full cd-diffraction-overlay pointer-events-none opacity-60" />

            <div
              className="absolute inset-0 rounded-full pointer-events-none opacity-30 mix-blend-overlay"
              style={{
                background: 'conic-gradient(from var(--diffraction-angle) at 50% 50%, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%)'
              }}
            />
          </div>

          {glitchActive && (
            <>
              <div className="absolute inset-0 rounded-2xl bg-laser-cyan/25 mix-blend-screen pointer-events-none glitch-slice-a -translate-x-2" />
              <div className="absolute inset-0 rounded-2xl bg-laser-magenta/30 mix-blend-screen pointer-events-none glitch-slice-b translate-x-3" />
              <div className="absolute inset-0 rounded-2xl bg-laser-lime/20 mix-blend-screen pointer-events-none glitch-slice-c -translate-x-1.5" />
            </>
          )}

          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-[9px] font-mono text-slate-300">
            <Radio className="w-2.5 h-2.5 text-laser-cyan animate-pulse" />
            <span>780nm DIODE</span>
          </div>

          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-[9px] font-mono text-slate-400">
            <span>TRACK 04</span>
          </div>
        </div>

        <div className="relative z-20 flex flex-col gap-2.5 pt-3 border-t border-white/5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-laser-cyan" />
              <span>DATA INTEGRITY</span>
            </span>
            <span className="font-bold text-laser-cyan">{integrityPercent}%</span>
          </div>

          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-laser-cyan via-laser-magenta to-laser-lime"
              style={{ width: `${integrityPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between bg-black/30 p-2 rounded-xl border border-white/5 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <Binary className="w-3 h-3 text-laser-lime" />
              <span className="text-slate-200 tracking-wider">{hexDump}</span>
            </div>
            <span className="text-slate-500 uppercase">
              {glitchActive ? 'TRACK_JUMP' : 'OPTICAL_SYNC'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
