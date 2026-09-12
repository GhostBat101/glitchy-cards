/**
 * CyberpunkHudCard - 3:4 portrait netrunner card featuring massive gradient-falloff bleed-out, ASCII Terminal Matrix breakdown, RGB channel datamosh drift, and hyper-random autonomous looping.
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
  const loopTimerRef = useRef(null);
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

    const marginX = 144;
    const marginY = 144;
    const cardW = width - marginX * 2;
    const cardH = height - marginY * 2;

    const sliceCount = Math.floor((10 + Math.random() * 16) * glitchMultiplier);
    for (let i = 0; i < sliceCount; i++) {
      const sy = marginY + Math.random() * cardH;
      const sh = Math.random() * 34 + 8;
      const shiftR = (Math.random() - 0.5) * 150 * progress * glitchMultiplier;
      const shiftB = -shiftR * 1.25;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, sy, width, sh);
      ctx.clip();

      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(img, marginX, marginY, cardW, cardH);

      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = 'rgba(255, 0, 127, 0.65)';
      ctx.drawImage(img, marginX + shiftR, marginY, cardW, cardH);

      ctx.fillStyle = 'rgba(0, 246, 255, 0.65)';
      ctx.drawImage(img, marginX + shiftB, marginY, cardW, cardH);

      if (Math.random() > 0.4) {
        ctx.globalCompositeOperation = 'difference';
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0, 246, 255, 0.45)' : 'rgba(57, 255, 20, 0.45)';
        ctx.fillRect(0, sy, width, sh);
      }

      ctx.restore();
    }

    const asciiBands = Math.floor((4 + Math.random() * 5) * glitchMultiplier);
    for (let b = 0; b < asciiBands; b++) {
      const by = marginY + Math.random() * (cardH - 36);
      const bh = Math.random() * 40 + 16;
      const bShift = (Math.random() - 0.5) * 130 * progress * glitchMultiplier;
      const startX = Math.max(0, marginX + bShift - 70);
      const endX = Math.min(width, marginX + bShift + cardW + 70);

      ctx.save();
      ctx.beginPath();
      ctx.rect(startX, by, endX - startX, bh);
      ctx.clip();

      ctx.fillStyle = 'rgba(10, 15, 25, 0.88)';
      ctx.fillRect(startX, by, endX - startX, bh);

      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      const stepX = 10;
      const stepY = 13;

      for (let gy = by + 11; gy < by + bh; gy += stepY) {
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

    const glitchFibers = Math.floor((16 + Math.random() * 24) * glitchMultiplier);
    for (let f = 0; f < glitchFibers; f++) {
      const fy = Math.random() * height;
      const fw = Math.random() * 120 + 30;
      const fx = Math.random() * (width - fw);

      ctx.fillStyle = Math.random() > 0.5 ? '#00f6ff' : '#39ff14';
      ctx.fillRect(fx, fy, fw, Math.random() > 0.7 ? 2 : 1);
    }

    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    const cx = width / 2;
    const cy = height / 2;
    const coreRadius = Math.min(cardW, cardH) * 0.45;
    const maxRadius = Math.max(width, height) * 0.56;
    const falloffGrad = ctx.createRadialGradient(cx, cy, coreRadius, cx, cy, maxRadius);
    falloffGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    falloffGrad.addColorStop(0.55, 'rgba(0, 0, 0, 0.88)');
    falloffGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.28)');
    falloffGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = falloffGrad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
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

    const duration = (2.2 + Math.random() * 1.4) * Math.min(1.4, glitchMultiplier);

    glitchTimeline
      .to(progressObj, {
        value: 0,
        duration: duration,
        ease: 'sine.inOut'
      }, 0);
  }, [glitchMultiplier, renderCyberpunkGlitch]);

  useEffect(() => {
    const img = new Image();
    img.src = './assets/images/cyberpunk_seoul.png';
    imageRef.current = img;

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 688;
      canvas.height = 848;
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
    const scheduleNextGlitch = () => {
      const r = Math.random();
      let delay;
      if (r < 0.28) {
        delay = 1100 + Math.random() * 1500;
      } else if (r < 0.72) {
        delay = 3300 + Math.random() * 3800;
      } else {
        delay = 8000 + Math.random() * 5200;
      }

      loopTimerRef.current = setTimeout(() => {
        triggerMatrixGlitch();
        scheduleNextGlitch();
      }, delay);
    };

    scheduleNextGlitch();

    return () => {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    };
  }, [triggerMatrixGlitch]);

  useEffect(() => {
    if (triggerGlitchCount > 0) {
      triggerMatrixGlitch();
    }
  }, [triggerGlitchCount, triggerMatrixGlitch]);

  return (
    <div
      style={{ perspective: 1200 }}
      className="relative w-full max-w-[400px] aspect-[3/4] select-none cursor-pointer group"
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

        <canvas
          ref={canvasRef}
          style={{ transform: 'translateZ(70px)' }}
          className="absolute -inset-36 w-[calc(100%+288px)] h-[calc(100%+288px)] pointer-events-none z-30 overflow-visible"
        />
      </div>
    </div>
  );
}
