/**
 * RetroCrtCard - Full-bleed analog CRT/VHS card with bleed-out tape head switching skew, rolling tracking noise bar, H-sync line tearing, and responsive 3D tracking.
 * Communicates with: src/App.jsx (receives glitchIntensity, triggerGlitchCount, and globalMousePos).
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
  triggerGlitchCount = 0,
  globalMousePos = { x: 0, y: 0 }
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

    const margin = 36;
    const cardW = width - margin * 2;
    const cardH = height - margin * 2;

    if (progress > 0) {
      const tearCount = Math.floor((14 + Math.random() * 22) * glitchMultiplier);
      for (let t = 0; t < tearCount; t++) {
        const sy = margin + Math.random() * cardH;
        const sh = Math.random() * 8 + 2;
        const shiftX = (Math.random() - 0.5) * 65 * progress * glitchMultiplier;

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, sy, width, sh);
        ctx.clip();
        ctx.drawImage(img, margin + shiftX, margin, cardW, cardH);

        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = 'rgba(255, 60, 0, 0.45)';
        ctx.drawImage(img, margin + shiftX - 8, margin, cardW, cardH);
        ctx.fillStyle = 'rgba(0, 200, 255, 0.45)';
        ctx.drawImage(img, margin + shiftX + 8, margin, cardW, cardH);
        ctx.restore();
      }

      const bottomThreshold = margin + cardH * 0.86;
      for (let y = bottomThreshold; y < margin + cardH + 20; y += 2) {
        const factor = (y - bottomThreshold) / (cardH * 0.14 + 20);
        const skew = Math.sin(y * 0.45) * 55 * factor * progress * glitchMultiplier;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, y, width, 2);
        ctx.clip();
        ctx.drawImage(img, margin + skew, margin, cardW, cardH);

        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(img, margin + skew - 6, margin, cardW, cardH);
        ctx.restore();
      }

      const barHeight = Math.floor(28 + Math.random() * 20);
      const barY = (rollY % (cardH + 40)) + margin - 20;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, barY, width, barHeight);
      ctx.clip();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(0, barY, width, barHeight);

      const noiseImg = ctx.createImageData(width, barHeight);
      const data = noiseImg.data;
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() > 0.45 ? 255 : 0;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = Math.floor(Math.random() * 180 + 50);
      }
      ctx.putImageData(noiseImg, 0, barY);
      ctx.restore();
    }

    const grainDensity = progress > 0 ? 0.35 : 0.08;
    const staticLines = Math.floor(height * grainDensity);
    for (let s = 0; s < staticLines; s++) {
      const gy = Math.random() * height;
      const gw = Math.random() * 50 + 8;
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

    const duration = (0.55 + Math.random() * 0.35) * Math.min(1.4, glitchMultiplier);

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
      canvas.width = 440;
      canvas.height = 440;
    }
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

  useEffect(() => {
    if (triggerGlitchCount > 0) {
      triggerCrtGlitch();
    }
  }, [triggerGlitchCount, triggerCrtGlitch]);

  const handleMouseEnter = () => {
    if (Math.random() < 0.35 * glitchMultiplier) {
      triggerCrtGlitch();
    }
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="relative w-full max-w-[360px] aspect-[1/1] select-none cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onClick={triggerCrtGlitch}
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
            src="./assets/images/retro_crt_vhs.jpg"
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

        <canvas
          ref={canvasRef}
          style={{ transform: 'translateZ(60px)' }}
          className="absolute -inset-9 w-[calc(100%+72px)] h-[calc(100%+72px)] pointer-events-none z-30 overflow-visible"
        />
      </div>
    </div>
  );
}
