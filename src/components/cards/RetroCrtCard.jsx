/**
 * RetroCrtCard - Sculptural zero-text analog CRT broadcast card featuring procedural RF static snow, H-sync line tearing, and rolling VHS tracking decay.
 * Communicates with: src/App.jsx (receives glitchIntensity and triggerGlitchCount).
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const INTENSITY_FACTORS = {
  low: 0.6,
  medium: 1.0,
  critical: 1.8
};

export default function RetroCrtCard({
  glitchIntensity = 'medium',
  triggerGlitchCount = 0
}) {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const xQuickTo = useRef(null);
  const yQuickTo = useRef(null);

  const [glitchActive, setGlitchActive] = useState(false);

  const glitchMultiplier = INTENSITY_FACTORS[glitchIntensity] || 1.0;

  const renderCrtGlitch = useCallback((ctx, width, height, progress, rollY) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const img = imageRef.current;
    if (!img || !img.complete) return;

    if (progress > 0) {
      const tearCount = Math.floor((15 + Math.random() * 25) * glitchMultiplier);
      for (let t = 0; t < tearCount; t++) {
        const sy = Math.random() * height;
        const sh = Math.random() * 6 + 1;
        const shiftX = (Math.random() - 0.5) * 35 * progress * glitchMultiplier;

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, sy, width, sh);
        ctx.clip();
        ctx.drawImage(img, shiftX, 0, width, height);

        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = 'rgba(255, 60, 0, 0.4)';
        ctx.drawImage(img, shiftX - 6, 0, width, height);
        ctx.fillStyle = 'rgba(0, 200, 255, 0.4)';
        ctx.drawImage(img, shiftX + 6, 0, width, height);
        ctx.restore();
      }

      const bottomThreshold = height * 0.92;
      for (let y = bottomThreshold; y < height; y += 2) {
        const factor = (y - bottomThreshold) / (height - bottomThreshold);
        const skew = Math.sin(y * 0.4) * 25 * factor * progress * glitchMultiplier;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, y, width, 2);
        ctx.clip();
        ctx.drawImage(img, skew, 0, width, height);
        ctx.restore();
      }

      const barHeight = Math.floor(25 + Math.random() * 20);
      const barY = (rollY % height);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, barY, width, barHeight);
      ctx.clip();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillRect(0, barY, width, barHeight);

      const noiseImg = ctx.createImageData(width, barHeight);
      const data = noiseImg.data;
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() > 0.4 ? 255 : 0;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = Math.floor(Math.random() * 200 + 55);
      }
      ctx.putImageData(noiseImg, 0, barY);
      ctx.restore();
    }

    const grainDensity = progress > 0 ? 0.35 : 0.08;
    const staticLines = Math.floor(height * grainDensity);
    for (let s = 0; s < staticLines; s++) {
      const gy = Math.random() * height;
      const gw = Math.random() * 40 + 5;
      const gx = Math.random() * (width - gw);
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)';
      ctx.fillRect(gx, gy, gw, 1);
    }
  }, [glitchMultiplier]);

  const triggerCrtGlitch = useCallback(() => {
    if (!cardRef.current || !canvasRef.current) return;

    setGlitchActive(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const animState = { progress: 1, rollY: 0 };

    const duration = (0.5 + Math.random() * 0.35) * Math.min(1.4, glitchMultiplier);

    const tl = gsap.timeline({
      onUpdate: () => {
        renderCrtGlitch(ctx, width, height, animState.progress, animState.rollY);
      },
      onComplete: () => {
        if (ctx) ctx.clearRect(0, 0, width, height);
        setGlitchActive(false);
      }
    });

    tl.to(animState, {
      rollY: height * 2.5,
      duration: duration,
      ease: 'none'
    }, 0)
    .to(animState, {
      progress: 0,
      duration: duration,
      ease: 'power2.inOut'
    }, 0);
  }, [glitchMultiplier, renderCrtGlitch]);

  useEffect(() => {
    const img = new Image();
    img.src = './assets/images/retro_crt_vhs.jpg';
    imageRef.current = img;

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 380;
      canvas.height = 380;
    }
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;

    xQuickTo.current = gsap.quickTo(cardRef.current, 'rotationY', {
      duration: 0.4,
      ease: 'power3.out'
    });

    yQuickTo.current = gsap.quickTo(cardRef.current, 'rotationX', {
      duration: 0.4,
      ease: 'power3.out'
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
      className="relative w-full max-w-[380px] aspect-[1/1.32] select-none cursor-pointer group"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={triggerCrtGlitch}
    >
      <div
        ref={cardRef}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full rounded-[2.25rem] bg-[#0d0d12] border border-amber-500/20 p-5 flex items-center justify-center overflow-hidden terracotta-card-shadow transition-all duration-300 group-hover:border-amber-500/40"
      >
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black border border-amber-500/25 flex items-center justify-center shadow-inner">
          <img
            src="./assets/images/retro_crt_vhs.jpg"
            alt="Retro CRT Sony Trinitron Monitor"
            className="w-full h-full object-cover rounded-2xl pointer-events-none filter contrast-[1.08] saturate-[1.1]"
          />

          <div className="absolute inset-0 crt-aperture-grille pointer-events-none opacity-50 z-10" />
          <div className="absolute inset-0 crt-rgb-triads pointer-events-none opacity-30 z-10" />

          <div
            className="absolute inset-0 rounded-2xl pointer-events-none z-10"
            style={{
              boxShadow: 'inset 0 0 50px rgba(0,0,0,0.85), inset 0 0 15px rgba(0,0,0,0.95)'
            }}
          />

          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl z-20"
          />
        </div>
      </div>
    </div>
  );
}
