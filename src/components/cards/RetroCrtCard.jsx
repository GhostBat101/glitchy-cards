/**
 * RetroCrtCard - 3:4 portrait analog CRT/VHS card featuring massive gradient-falloff bleed-out, tape head switching skew, rolling tracking noise bar, and hyper-random autonomous looping.
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
  const loopTimerRef = useRef(null);
  const xQuickTo = useRef(null);
  const yQuickTo = useRef(null);

  const [glitchActive, setGlitchActive] = useState(false);

  const glitchMultiplier = INTENSITY_FACTORS[glitchIntensity] || 1.0;

  const renderCrtGlitch = useCallback((ctx, width, height, progress, rollY) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const img = imageRef.current;
    if (!img || !img.complete) return;

    const marginX = 144;
    const marginY = 144;
    const cardW = width - marginX * 2;
    const cardH = height - marginY * 2;

    if (progress > 0) {
      const tearCount = Math.floor((18 + Math.random() * 26) * glitchMultiplier);
      for (let t = 0; t < tearCount; t++) {
        const sy = marginY + Math.random() * cardH;
        const sh = Math.random() * 10 + 2;
        const shiftX = (Math.random() - 0.5) * 110 * progress * glitchMultiplier;

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, sy, width, sh);
        ctx.clip();
        ctx.drawImage(img, marginX + shiftX, marginY, cardW, cardH);

        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = 'rgba(255, 60, 0, 0.45)';
        ctx.drawImage(img, marginX + shiftX - 10, marginY, cardW, cardH);
        ctx.fillStyle = 'rgba(0, 200, 255, 0.45)';
        ctx.drawImage(img, marginX + shiftX + 10, marginY, cardW, cardH);
        ctx.restore();
      }

      const bottomThreshold = marginY + cardH * 0.84;
      for (let y = bottomThreshold; y < marginY + cardH + 40; y += 2) {
        const factor = (y - bottomThreshold) / (cardH * 0.16 + 40);
        const skew = Math.sin(y * 0.38) * 85 * factor * progress * glitchMultiplier;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, y, width, 2);
        ctx.clip();
        ctx.drawImage(img, marginX + skew, marginY, cardW, cardH);

        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(img, marginX + skew - 8, marginY, cardW, cardH);
        ctx.restore();
      }

      const barHeight = Math.floor(36 + Math.random() * 24);
      const barY = (rollY % (cardH + 60)) + marginY - 30;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, barY, width, barHeight);
      ctx.clip();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
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
      const gw = Math.random() * 80 + 10;
      const gx = Math.random() * (width - gw);
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)';
      ctx.fillRect(gx, gy, gw, 1);
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

  const triggerCrtGlitch = useCallback(() => {
    if (!cardRef.current || !canvasRef.current) return;

    setGlitchActive(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const animState = { progress: 1, rollY: 0 };

    const duration = (2.5 + Math.random() * 1.5) * Math.min(1.4, glitchMultiplier);

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
      rollY: height * 2.2,
      duration: duration,
      ease: 'none'
    }, 0)
    .to(animState, {
      progress: 0,
      duration: duration,
      ease: 'sine.inOut'
    }, 0);
  }, [glitchMultiplier, renderCrtGlitch]);

  useEffect(() => {
    const img = new Image();
    img.src = './assets/images/retro_crt_room.png';
    imageRef.current = img;

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 688;
      canvas.height = 848;
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
    const scheduleNextGlitch = () => {
      const r = Math.random();
      let delay;
      if (r < 0.28) {
        delay = 1200 + Math.random() * 1600;
      } else if (r < 0.72) {
        delay = 3500 + Math.random() * 4200;
      } else {
        delay = 8500 + Math.random() * 5500;
      }

      loopTimerRef.current = setTimeout(() => {
        triggerCrtGlitch();
        scheduleNextGlitch();
      }, delay);
    };

    scheduleNextGlitch();

    return () => {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    };
  }, [triggerCrtGlitch]);

  useEffect(() => {
    if (triggerGlitchCount > 0) {
      triggerCrtGlitch();
    }
  }, [triggerGlitchCount, triggerCrtGlitch]);

  return (
    <div
      style={{ perspective: 1200 }}
      className="relative w-full max-w-[400px] aspect-[3/4] select-none cursor-pointer group"
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
            src="./assets/images/retro_crt_room.png"
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
          className="absolute -inset-36 w-[calc(100%+288px)] h-[calc(100%+288px)] pointer-events-none z-30 overflow-visible"
        />
      </div>
    </div>
  );
}
