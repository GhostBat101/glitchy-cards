/**
 * CyberpunkHudCard - Tactical cyberpunk matrix HUD card featuring authentic operative imagery, cryptographic decrypt stream, and GSAP chromatic slice glitching.
 * Communicates with: src/App.jsx (receives glitchIntensity and triggerGlitchCount).
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { Terminal, Shield, Eye, Lock, Unlock, Crosshair } from 'lucide-react';

const CIPHER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@%';

const INTENSITY_FACTORS = {
  low: 0.5,
  medium: 1.0,
  critical: 2.0
};

export default function CyberpunkHudCard({
  glitchIntensity = 'medium',
  triggerGlitchCount = 0
}) {
  const cardRef = useRef(null);
  const viewportRef = useRef(null);
  const xQuickTo = useRef(null);
  const yQuickTo = useRef(null);

  const [glitchActive, setGlitchActive] = useState(false);
  const [decryptHash, setDecryptHash] = useState('ARASAKA_NET_0x99B');
  const [isLocked, setIsLocked] = useState(false);
  const [targetDist, setTargetDist] = useState('14.2m');

  const glitchMultiplier = INTENSITY_FACTORS[glitchIntensity] || 1.0;

  const triggerMatrixGlitch = useCallback(() => {
    if (!cardRef.current || !viewportRef.current) return;

    setGlitchActive(true);
    setIsLocked(true);
    setTargetDist(`${(Math.random() * 20 + 5).toFixed(1)}m`);

    const scrambleInterval = setInterval(() => {
      let result = '';
      for (let i = 0; i < 15; i++) {
        result += CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
      }
      setDecryptHash(result);
    }, 50);

    const tl = gsap.timeline({
      onComplete: () => {
        clearInterval(scrambleInterval);
        setGlitchActive(false);
        setIsLocked(false);
        setDecryptHash('ARASAKA_NET_0x99B');
      }
    });

    const intensity = glitchMultiplier;

    tl.to(viewportRef.current, {
      x: () => (Math.random() - 0.5) * 18 * intensity,
      y: () => (Math.random() - 0.5) * 12 * intensity,
      duration: 0.05,
      repeat: 6,
      yoyo: true,
      ease: 'none'
    })
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
  }, []);

  useEffect(() => {
    if (triggerGlitchCount > 0) {
      triggerMatrixGlitch();
    }
  }, [triggerGlitchCount, triggerMatrixGlitch]);

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
      triggerMatrixGlitch();
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
      onClick={triggerMatrixGlitch}
    >
      <div
        ref={cardRef}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full rounded-[2rem] bg-[#0c0f17] border border-laser-cyan/20 p-5 flex flex-col justify-between overflow-hidden terracotta-card-shadow transition-all duration-300 group-hover:border-laser-cyan/40"
      >
        <div className="relative z-20 flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-laser-cyan/10 border border-laser-cyan/20 flex items-center justify-center text-laser-cyan">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold tracking-wider text-white">TACTICAL HUD</h4>
              <p className="text-[10px] font-mono text-slate-400">NETRUNNER // OPERATIVE 07</p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-laser-cyan/10 border border-laser-cyan/30 text-laser-cyan">
            <Crosshair className="w-2.5 h-2.5 animate-spin-slow" />
            <span>SYNCED</span>
          </div>
        </div>

        <div
          ref={viewportRef}
          className="relative z-10 my-auto w-full aspect-square rounded-2xl overflow-hidden bg-black/50 border border-laser-cyan/20 flex items-center justify-center"
        >
          <img
            src="./assets/images/cyberpunk_matrix.jpg"
            alt="Cyberpunk Hacker Operative"
            className="w-full h-full object-cover rounded-2xl pointer-events-none filter saturate-[1.1]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {glitchActive && (
            <>
              <div className="absolute inset-0 bg-laser-cyan/25 mix-blend-screen pointer-events-none glitch-slice-a -translate-x-3" />
              <div className="absolute inset-0 bg-laser-magenta/30 mix-blend-screen pointer-events-none glitch-slice-b translate-x-4" />
              <div className="absolute inset-0 bg-laser-lime/20 mix-blend-screen pointer-events-none glitch-slice-c -translate-x-2" />
            </>
          )}

          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-laser-cyan/20 text-[9px] font-mono text-laser-cyan">
            <Eye className="w-2.5 h-2.5" />
            <span>OCULAR_HUD // v4.2</span>
          </div>

          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-[9px] font-mono text-slate-300">
            <span>DIST: {targetDist}</span>
          </div>

          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-laser-lime animate-pulse" />
              <span>SIG_FREQ: 9.4 GHz</span>
            </div>
            <span className="text-laser-cyan">LATENCY 1.2ms</span>
          </div>
        </div>

        <div className="relative z-20 flex flex-col gap-2.5 pt-3 border-t border-white/5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-laser-cyan" />
              <span>CIPHER PROTOCOL</span>
            </span>
            <span className="font-bold text-laser-cyan flex items-center gap-1">
              {isLocked ? <Lock className="w-3 h-3 text-rose-400" /> : <Unlock className="w-3 h-3 text-laser-lime" />}
              <span>{isLocked ? 'INTERCEPTED' : 'DECRYPTED'}</span>
            </span>
          </div>

          <div className="flex items-center justify-between bg-black/40 p-2 rounded-xl border border-laser-cyan/20 text-[10px] font-mono">
            <span className="text-laser-cyan font-bold tracking-widest">{decryptHash}</span>
            <span className="text-slate-500 uppercase text-[9px]">
              {glitchActive ? 'BURST_INTERFERE' : 'ENCRYPTED'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
