/**
 * AiCoreCdCard - Interactive corrupted AI core card with iridescent CD optical diffraction, concentric data tracks, and GSAP slice glitching.
 * Communicates with: src/App.jsx (receives glitchIntensity, isSpinning, and triggerGlitchCount props).
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { Cpu, AlertTriangle, Radio, Activity, Binary } from 'lucide-react';

const HEX_CHARS = '0123456789ABCDEF!@#$%&*';

const INTENSITY_FACTORS = {
  low: 0.4,
  medium: 1.0,
  critical: 2.2
};

export default function AiCoreCdCard({
  glitchIntensity = 'medium',
  isSpinning = true,
  triggerGlitchCount = 0
}) {
  const cardRef = useRef(null);
  const discRef = useRef(null);
  const xQuickTo = useRef(null);
  const yQuickTo = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [hexDump, setHexDump] = useState('0x7F 0x00 0xA4 0xCD');
  const [integrityPercent, setIntegrityPercent] = useState(64.2);

  const glitchMultiplier = INTENSITY_FACTORS[glitchIntensity] || 1.0;

  const triggerLaserError = useCallback(() => {
    if (!cardRef.current || !discRef.current) return;

    setGlitchActive(true);
    setIntegrityPercent(prev => Math.max(12.4, +(prev - (Math.random() * 8 + 4)).toFixed(1)));

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

    const intensityScale = glitchMultiplier;

    tl.to(cardRef.current, {
      x: () => (Math.random() - 0.5) * 24 * intensityScale,
      y: () => (Math.random() - 0.5) * 16 * intensityScale,
      filter: 'drop-shadow(0 0 35px rgba(255,0,127,0.8)) hue-rotate(90deg)',
      duration: 0.05,
      repeat: 7,
      yoyo: true,
      ease: 'none'
    })
    .to(discRef.current, {
      rotation: `+=${(Math.random() > 0.5 ? 180 : -180) * intensityScale}`,
      scale: 1.05,
      duration: 0.2,
      ease: 'elastic.out(1, 0.3)'
    }, 0)
    .to(cardRef.current, {
      x: 0,
      y: 0,
      filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.8)) hue-rotate(0deg)',
      duration: 0.15,
      ease: 'power2.out'
    });
  }, [glitchMultiplier]);

  useEffect(() => {
    if (!cardRef.current) return;

    xQuickTo.current = gsap.quickTo(cardRef.current, 'rotationY', {
      duration: 0.6,
      ease: 'power3.out'
    });

    yQuickTo.current = gsap.quickTo(cardRef.current, 'rotationX', {
      duration: 0.6,
      ease: 'power3.out'
    });

    const discSpin = gsap.to(discRef.current, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: 'none',
      paused: !isSpinning
    });

    if (isSpinning) {
      discSpin.play();
    } else {
      discSpin.pause();
    }

    return () => {
      discSpin.kill();
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

    const rotX = -((y - centerY) / centerY) * 14;
    const rotY = ((x - centerX) / centerX) * 14;

    if (xQuickTo.current) xQuickTo.current(rotY);
    if (yQuickTo.current) yQuickTo.current(rotX);

    const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 180;
    cardRef.current.style.setProperty('--diffraction-angle', `${Math.round(angle)}deg`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (Math.random() < 0.45 * glitchMultiplier) {
      triggerLaserError();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (xQuickTo.current) xQuickTo.current(0);
    if (yQuickTo.current) yQuickTo.current(0);
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="relative w-full max-w-[420px] aspect-[1/1.44] select-none cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={triggerLaserError}
    >
      <div
        ref={cardRef}
        style={{
          transformStyle: 'preserve-3d',
          '--diffraction-angle': '45deg'
        }}
        className="relative w-full h-full rounded-[2.5rem] bg-gradient-to-b from-obsidian-800 via-obsidian-900 to-[#040608] border border-white/15 p-6 flex flex-col justify-between overflow-hidden shadow-2xl shadow-black/80 transition-shadow duration-500 hover:border-laser-cyan/40 hover:shadow-laser-cyan/10"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-laser-cyan/5 via-transparent to-laser-magenta/5 pointer-events-none" />
        <div className="absolute inset-0 scanlines-overlay opacity-30 pointer-events-none" />

        {glitchActive && (
          <>
            <div className="absolute inset-0 bg-laser-cyan/15 mix-blend-screen pointer-events-none glitch-slice-1 -translate-x-3" />
            <div className="absolute inset-0 bg-laser-magenta/20 mix-blend-screen pointer-events-none glitch-slice-2 translate-x-4" />
            <div className="absolute inset-0 bg-laser-lime/10 mix-blend-screen pointer-events-none glitch-slice-3 -translate-x-2" />
          </>
        )}

        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-laser-magenta/10 border border-laser-magenta/30 text-laser-magenta">
              <Cpu className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold tracking-wider text-white">NEURAL_CD // 0x8F</span>
                <span className="w-1.5 h-1.5 rounded-full bg-laser-magenta animate-ping" />
              </div>
              <span className="text-[10px] font-mono text-slate-400">OPTICAL ARCHIVE SYSTEM</span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              <AlertTriangle className="w-3 h-3" />
              <span>CRC_CORRUPTED</span>
            </div>
            <span className="text-[9px] font-mono text-slate-500 mt-0.5">TRACK 04 • SECTOR FAIL</span>
          </div>
        </div>

        <div className="relative z-10 my-auto flex items-center justify-center py-4">
          <div
            ref={discRef}
            className="relative w-64 h-64 rounded-full border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center bg-obsidian-900"
            style={{
              boxShadow: isHovered
                ? '0 0 50px rgba(0, 246, 255, 0.25), inset 0 0 30px rgba(255, 0, 127, 0.2)'
                : '0 0 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.05)'
            }}
          >
            <div className="absolute inset-0 cd-grooves opacity-80 pointer-events-none" />
            <div className="absolute inset-0 cd-diffraction pointer-events-none opacity-70 transition-opacity duration-300" />

            <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay bg-gradient-to-tr from-transparent via-white/80 to-transparent" />
            <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay bg-gradient-to-br from-transparent via-laser-cyan/80 to-transparent" />

            <div className="absolute inset-8 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute inset-16 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute inset-24 rounded-full border border-white/15 pointer-events-none" />

            <div className="relative w-24 h-24 rounded-full bg-obsidian-950 border-2 border-white/30 flex items-center justify-center shadow-inner overflow-hidden z-20">
              <div className="absolute inset-0 bg-gradient-to-tr from-laser-magenta/20 via-laser-cyan/20 to-transparent animate-spin-slow pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-laser-cyan/60 flex items-center justify-center animate-spin-slow">
                  <div className="w-5 h-5 rounded-full bg-laser-magenta/40 border border-laser-magenta flex items-center justify-center shadow-lg shadow-laser-magenta/50">
                    <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                  </div>
                </div>
                <span className="text-[8px] font-mono font-bold text-laser-cyan mt-1">CORE.AI</span>
              </div>

              <div className="absolute inset-0 rounded-full border border-laser-magenta/40 animate-pulse pointer-events-none" />
            </div>

            <div
              className="absolute w-2 h-2 rounded-full bg-laser-cyan shadow-lg shadow-laser-cyan pointer-events-none"
              style={{
                top: '30%',
                left: '70%',
                opacity: isHovered ? 0.9 : 0.4
              }}
            />
          </div>

          <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-500 flex items-center gap-1.5 bg-obsidian-950/70 px-2.5 py-1 rounded-full border border-white/5 backdrop-blur-sm">
            <Radio className="w-3 h-3 text-laser-cyan animate-pulse" />
            <span>OPTICAL_BURN_LAYER_3</span>
          </div>

          <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-400 bg-obsidian-950/70 px-2.5 py-1 rounded-full border border-white/5 backdrop-blur-sm">
            <span>SECTOR: 0xDEADBEEF</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-laser-magenta" />
              <span>DATA INTEGRITY</span>
            </span>
            <span className={`font-bold ${integrityPercent < 40 ? 'text-rose-400' : 'text-laser-cyan'}`}>
              {integrityPercent}%
            </span>
          </div>

          <div className="w-full h-1.5 bg-obsidian-950 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${integrityPercent}%`,
                background: integrityPercent < 40
                  ? 'linear-gradient(90deg, #ff007f, #f43f5e)'
                  : 'linear-gradient(90deg, #00f6ff, #a855f7, #ff007f)'
              }}
            />
          </div>

          <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 bg-obsidian-950/60 p-2 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <Binary className="w-3.5 h-3.5 text-laser-lime" />
              <span className="text-white tracking-widest">{hexDump}</span>
            </div>
            <span className="text-[9px] uppercase tracking-wider text-slate-500">
              {glitchActive ? 'READ_COLLISION' : 'OPTICAL_SYNCED'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
            <span>CLICK OR HOVER TO TRIGGER LASER JUMP</span>
            <span className="text-laser-cyan/70">780nm DIODE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
