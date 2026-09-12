/**
 * AiCoreCdCard - 3:4 portrait optical disc card featuring massive gradient-falloff bleed-out, Bayer dithering, slow caustic macroblock tears, and hyper-random autonomous looping.
 * Communicates with: src/App.jsx (receives glitchIntensity, isSpinning, triggerGlitchCount, and globalMousePos).
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const INTENSITY_FACTORS = {
  low: 0.6,
  medium: 1.0,
  critical: 1.8
};

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

export default function AiCoreCdCard({
  glitchIntensity = 'medium',
  isSpinning = true,
  triggerGlitchCount = 0,
  globalMousePos = { x: 0, y: 0 }
}) {
  const cardRef = useRef(null);
  const discRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const loopTimerRef = useRef(null);
  const xQuickTo = useRef(null);
  const yQuickTo = useRef(null);

  const [glitchActive, setGlitchActive] = useState(false);

  const glitchMultiplier = INTENSITY_FACTORS[glitchIntensity] || 1.0;

  const renderDitherAndMacroblocks = useCallback((ctx, width, height, progress) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    if (progress <= 0) return;

    const img = imageRef.current;
    if (!img || !img.complete) return;

    const marginX = 144;
    const marginY = 144;
    const cardW = width - marginX * 2;
    const cardH = height - marginY * 2;

    const sliceCount = Math.floor((12 + Math.random() * 18) * glitchMultiplier);
    for (let i = 0; i < sliceCount; i++) {
      const sy = marginY + Math.random() * cardH;
      const sh = Math.random() * 38 + 8;
      const shiftX = (Math.random() - 0.5) * 140 * progress * glitchMultiplier;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, sy, width, sh);
      ctx.clip();

      ctx.drawImage(img, marginX + shiftX, marginY, cardW, cardH);

      ctx.globalCompositeOperation = Math.random() > 0.4 ? 'difference' : 'screen';
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0, 246, 255, 0.65)' : 'rgba(255, 0, 127, 0.65)';
      ctx.fillRect(0, sy, width, sh);

      ctx.restore();
    }

    const ditherBands = Math.floor((5 + Math.random() * 7) * glitchMultiplier);
    for (let b = 0; b < ditherBands; b++) {
      const dy = marginY + Math.random() * cardH;
      const dh = Math.random() * 45 + 16;
      const dShift = (Math.random() - 0.5) * 120 * progress * glitchMultiplier;
      const startX = Math.max(0, marginX + dShift - 80);
      const bandWidth = cardW + 160;

      ctx.save();
      ctx.beginPath();
      ctx.rect(startX, dy, bandWidth, dh);
      ctx.clip();

      for (let y = dy; y < dy + dh; y += 4) {
        for (let x = startX; x < startX + bandWidth; x += 4) {
          const matrixX = Math.floor((x % 16) / 4);
          const matrixY = Math.floor((y % 16) / 4);
          const threshold = BAYER_4X4[matrixY][matrixX] * 16;
          const noise = Math.random() * 255;

          if (noise > threshold) {
            ctx.fillStyle = Math.random() > 0.5 ? '#00f6ff' : '#ffffff';
            ctx.fillRect(x, y, 3, 3);
          }
        }
      }
      ctx.restore();
    }

    const causticBeams = Math.floor(Math.random() * 5 + 3);
    for (let c = 0; c < causticBeams; c++) {
      const angle = Math.random() * Math.PI * 2;
      const length = width * 0.75;
      const cx = width / 2;
      const cy = height / 2;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(
        cx + Math.cos(angle - 0.2) * length,
        cy + Math.sin(angle - 0.2) * length
      );
      ctx.lineTo(
        cx + Math.cos(angle + 0.2) * length,
        cy + Math.sin(angle + 0.2) * length
      );
      ctx.closePath();

      const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, length);
      grad.addColorStop(0, 'rgba(255, 0, 127, 0.7)');
      grad.addColorStop(0.45, 'rgba(0, 246, 255, 0.5)');
      grad.addColorStop(1, 'rgba(57, 255, 20, 0)');

      ctx.fillStyle = grad;
      ctx.globalCompositeOperation = 'screen';
      ctx.fill();
      ctx.restore();
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

  const triggerLaserError = useCallback(() => {
    if (!cardRef.current || !discRef.current || !canvasRef.current) return;

    setGlitchActive(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const progressObj = { value: 1 };

    const glitchTimeline = gsap.timeline({
      onUpdate: () => {
        renderDitherAndMacroblocks(ctx, width, height, progressObj.value);
      },
      onComplete: () => {
        if (ctx) ctx.clearRect(0, 0, width, height);
        setGlitchActive(false);
      }
    });

    const recoilAngle = (Math.random() > 0.5 ? 1 : -1) * (40 + Math.random() * 80) * glitchMultiplier;
    const duration = (2.2 + Math.random() * 1.5) * Math.min(1.4, glitchMultiplier);

    glitchTimeline
      .to(discRef.current, {
        rotation: `+=${recoilAngle}`,
        duration: duration * 0.45,
        ease: 'power2.out'
      }, 0)
      .to(progressObj, {
        value: 0,
        duration: duration,
        ease: 'sine.inOut'
      }, 0)
      .to(discRef.current, {
        rotation: `+=${recoilAngle * -0.25}`,
        duration: duration * 0.55,
        ease: 'sine.out'
      }, duration * 0.45);
  }, [glitchMultiplier, renderDitherAndMacroblocks]);

  useEffect(() => {
    const img = new Image();
    img.src = './assets/images/optical_sunburst.png';
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

    const angle = Math.atan2(globalMousePos.y, globalMousePos.x) * (180 / Math.PI) + 180;
    cardRef.current.style.setProperty('--diffraction-angle', `${Math.round(angle)}deg`);
  }, [globalMousePos]);

  useEffect(() => {
    if (!discRef.current) return;

    let spinTween;
    if (isSpinning) {
      spinTween = gsap.to(discRef.current, {
        rotation: '+=360',
        duration: 24,
        ease: 'none',
        repeat: -1
      });
    }

    return () => {
      if (spinTween) spinTween.kill();
    };
  }, [isSpinning]);

  useEffect(() => {
    const scheduleNextGlitch = () => {
      const r = Math.random();
      let delay;
      if (r < 0.28) {
        delay = 1200 + Math.random() * 1600;
      } else if (r < 0.72) {
        delay = 3400 + Math.random() * 4000;
      } else {
        delay = 8000 + Math.random() * 5500;
      }

      loopTimerRef.current = setTimeout(() => {
        triggerLaserError();
        scheduleNextGlitch();
      }, delay);
    };

    scheduleNextGlitch();

    return () => {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    };
  }, [triggerLaserError]);

  useEffect(() => {
    if (triggerGlitchCount > 0) {
      triggerLaserError();
    }
  }, [triggerGlitchCount, triggerLaserError]);

  return (
    <div
      style={{ perspective: 1200 }}
      className="relative w-full max-w-[400px] aspect-[3/4] select-none cursor-pointer group"
      onClick={triggerLaserError}
    >
      <div
        ref={cardRef}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full rounded-[2rem] overflow-visible neutral-3d-shadow transition-shadow duration-300"
      >
        <div
          ref={discRef}
          style={{ transform: 'translateZ(0px)' }}
          className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl"
        >
          <img
            src="./assets/images/optical_sunburst.png"
            alt=""
            className="w-full h-full object-cover rounded-[2rem] pointer-events-none"
          />

          <div className="absolute inset-0 rounded-[2rem] cd-diffraction-overlay pointer-events-none opacity-60" />

          <div
            className="absolute inset-0 rounded-[2rem] pointer-events-none opacity-30 mix-blend-overlay"
            style={{
              background: 'conic-gradient(from var(--diffraction-angle) at 50% 50%, transparent 40%, rgba(255,255,255,0.95) 50%, transparent 60%)'
            }}
          />
        </div>

        <div
          style={{ transform: 'translateZ(40px)' }}
          className="absolute inset-0 rounded-[2rem] pointer-events-none border border-white/20 shadow-[inset_0_0_30px_rgba(255,255,255,0.2)]"
        />

        <canvas
          ref={canvasRef}
          style={{ transform: 'translateZ(50px)' }}
          className="absolute -inset-36 w-[calc(100%+288px)] h-[calc(100%+288px)] pointer-events-none z-30 overflow-visible"
        />
      </div>
    </div>
  );
}
