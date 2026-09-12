/**
 * CyberpunkHudCard - Full-bleed netrunner card with bleed-out ASCII Terminal Matrix breakdown, RGB channel datamosh drift, floating vector reticles, and responsive 3D tracking.
 * Communicates with: src/App.jsx (receives glitchIntensity, triggerGlitchCount, and globalMousePos).
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const INTENSITY_FACTORS = {
  low: 0.6,
  medium: 1.0,
  critical: 1.8
};

const ASCII_GLYPHS = ['0', '1', 'X', '7', 'F', 'A', '9', '%', '#', '*', '+', '=', '-', ':', '.'];

export default function CyberpunkHudCard({
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
  const [eqHeights, setEqHeights] = useState([14, 28, 10, 22, 36, 16, 24, 12, 32, 18]);

  const glitchMultiplier = INTENSITY_FACTORS[glitchIntensity] || 1.0;

  const renderCyberpunkGlitch = useCallback((ctx, width, height, progress) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    if (progress <= 0) return;

    const img = imageRef.current;
    if (!img || !img.complete) return;

    const margin = 36;
    const cardW = width - margin * 2;
    const cardH = height - margin * 2;

    const sliceCount = Math.floor((8 + Math.random() * 14) * glitchMultiplier);
    for (let i = 0; i < sliceCount; i++) {
      const sy = margin + Math.random() * cardH;
      const sh = Math.random() * 26 + 6;
      const shiftR = (Math.random() - 0.5) * 80 * progress * glitchMultiplier;
      const shiftB = -shiftR * 1.25;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, sy, width, sh);
      ctx.clip();

      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(img, margin, margin, cardW, cardH);

      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = 'rgba(255, 0, 127, 0.6)';
      ctx.drawImage(img, margin + shiftR, margin, cardW, cardH);

      ctx.fillStyle = 'rgba(0, 246, 255, 0.6)';
      ctx.drawImage(img, margin + shiftB, margin, cardW, cardH);

      if (Math.random() > 0.4) {
        ctx.globalCompositeOperation = 'difference';
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0, 246, 255, 0.4)' : 'rgba(57, 255, 20, 0.4)';
        ctx.fillRect(0, sy, width, sh);
      }

      ctx.restore();
    }

    const asciiBands = Math.floor((3 + Math.random() * 4) * glitchMultiplier);
    for (let b = 0; b < asciiBands; b++) {
      const by = margin + Math.random() * (cardH - 30);
      const bh = Math.random() * 32 + 14;
      const bShift = (Math.random() - 0.5) * 60 * progress * glitchMultiplier;
      const startX = Math.max(0, margin + bShift - 20);
      const endX = Math.min(width, margin + bShift + cardW + 20);

      ctx.save();
      ctx.beginPath();
      ctx.rect(startX, by, endX - startX, bh);
      ctx.clip();

      ctx.fillStyle = 'rgba(10, 15, 25, 0.85)';
      ctx.fillRect(startX, by, endX - startX, bh);

      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      const stepX = 10;
      const stepY = 12;

      for (let gy = by + 10; gy < by + bh; gy += stepY) {
        for (let gx = startX; gx < endX; gx += stepX) {
          const glyph = ASCII_GLYPHS[Math.floor(Math.random() * ASCII_GLYPHS.length)];
          const isLime = Math.random() > 0.65;
          ctx.fillStyle = isLime ? '#39ff14' : '#00f6ff';
          ctx.shadowColor = isLime ? '#39ff14' : '#00f6ff';
          ctx.shadowBlur = 4;
          ctx.fillText(glyph, gx, gy);
        }
      }
      ctx.restore();
    }

    const glitchFibers = Math.floor((12 + Math.random() * 20) * glitchMultiplier);
    for (let f = 0; f < glitchFibers; f++) {
      const fy = Math.random() * height;
      const fw = Math.random() * 70 + 20;
      const fx = Math.random() * (width - fw);

      ctx.fillStyle = Math.random() > 0.5 ? '#00f6ff' : '#39ff14';
      ctx.fillRect(fx, fy, fw, Math.random() > 0.7 ? 2 : 1);
    }
  }, [glitchMultiplier]);

  const triggerMatrixGlitch = useCallback(() => {
    if (!cardRef.current || !canvasRef.current) return;

    setGlitchActive(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const progressObj = { value: 1 };

    const glitchTimeline = gsap.timeline({
      onUpdate: () => {
        renderCyberpunkGlitch(ctx, width, height, progressObj.value);
      },
      onComplete: () => {
        if (ctx) ctx.clearRect(0, 0, width, height);
        setGlitchActive(false);
      }
    });

    const duration = (0.45 + Math.random() * 0.3) * Math.min(1.4, glitchMultiplier);

    glitchTimeline
      .to(progressObj, {
        value: 0,
        duration: duration,
        ease: 'power3.out'
      }, 0);
  }, [glitchMultiplier, renderCyberpunkGlitch]);

  useEffect(() => {
    const img = new Image();
    img.src = './assets/images/cyberpunk_matrix.jpg';
    imageRef.current = img;

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 440;
      canvas.height = 440;
    }
  }, []);

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

  useEffect(() => {
    if (triggerGlitchCount > 0) {
      triggerMatrixGlitch();
    }
  }, [triggerGlitchCount, triggerMatrixGlitch]);

  const handleMouseEnter = () => {
    if (Math.random() < 0.35 * glitchMultiplier) {
      triggerMatrixGlitch();
    }
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="relative w-full max-w-[360px] aspect-[1/1] select-none cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onClick={triggerMatrixGlitch}
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
            src="./assets/images/cyberpunk_matrix.jpg"
            alt=""
            className="w-full h-full object-cover rounded-[2rem] pointer-events-none filter saturate-[1.15]"
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

          <div className="flex items-center justify-center">
            <div className="relative w-24 h-24 rounded-full border border-laser-cyan/30 flex items-center justify-center">
              <div className="w-18 h-18 rounded-full border border-dashed border-laser-magenta/40 animate-spin-slow" />
              <div className="absolute w-2 h-2 rounded-full bg-laser-cyan/90" />
              <div className="absolute w-28 h-[1px] bg-laser-cyan/20" />
              <div className="absolute h-28 w-[1px] bg-laser-cyan/20" />
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

        <canvas
          ref={canvasRef}
          style={{ transform: 'translateZ(70px)' }}
          className="absolute -inset-9 w-[calc(100%+72px)] h-[calc(100%+72px)] pointer-events-none z-30 overflow-visible"
        />
      </div>
    </div>
  );
}
