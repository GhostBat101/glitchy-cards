/**
 * AiCoreCdCard - Full-bleed optical disc card with bleed-out Bayer matrix dithering, macroblock tears, caustic diffraction, and responsive 3D tracking.
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

    const margin = 36;
    const cardW = width - margin * 2;
    const cardH = height - margin * 2;

    const sliceCount = Math.floor((10 + Math.random() * 16) * glitchMultiplier);
    for (let i = 0; i < sliceCount; i++) {
      const sy = margin + Math.random() * cardH;
      const sh = Math.random() * 28 + 6;
      const shiftX = (Math.random() - 0.5) * 75 * progress * glitchMultiplier;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, sy, width, sh);
      ctx.clip();

      ctx.drawImage(img, margin + shiftX, margin, cardW, cardH);

      ctx.globalCompositeOperation = Math.random() > 0.4 ? 'difference' : 'screen';
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0, 246, 255, 0.6)' : 'rgba(255, 0, 127, 0.6)';
      ctx.fillRect(0, sy, width, sh);

      ctx.restore();
    }

    const ditherBands = Math.floor((4 + Math.random() * 6) * glitchMultiplier);
    for (let b = 0; b < ditherBands; b++) {
      const dy = margin + Math.random() * cardH;
      const dh = Math.random() * 36 + 12;
      const dShift = (Math.random() - 0.5) * 50 * progress * glitchMultiplier;

      ctx.save();
      ctx.beginPath();
      ctx.rect(margin + dShift - 20, dy, cardW + 40, dh);
      ctx.clip();

      for (let y = dy; y < dy + dh; y += 4) {
        for (let x = margin + dShift - 20; x < margin + dShift + cardW + 20; x += 4) {
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

    const causticBeams = Math.floor(Math.random() * 4 + 2);
    for (let c = 0; c < causticBeams; c++) {
      const angle = Math.random() * Math.PI * 2;
      const length = width * 0.65;
      const cx = width / 2;
      const cy = height / 2;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(
        cx + Math.cos(angle - 0.15) * length,
        cy + Math.sin(angle - 0.15) * length
      );
      ctx.lineTo(
        cx + Math.cos(angle + 0.15) * length,
        cy + Math.sin(angle + 0.15) * length
      );
      ctx.closePath();

      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, length);
      grad.addColorStop(0, 'rgba(255, 0, 127, 0.7)');
      grad.addColorStop(0.5, 'rgba(0, 246, 255, 0.5)');
      grad.addColorStop(1, 'rgba(57, 255, 20, 0)');

      ctx.fillStyle = grad;
      ctx.globalCompositeOperation = 'screen';
      ctx.fill();
      ctx.restore();
    }
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

    const recoilAngle = (Math.random() > 0.5 ? 1 : -1) * (60 + Math.random() * 90) * glitchMultiplier;
    const duration = (0.5 + Math.random() * 0.35) * Math.min(1.4, glitchMultiplier);

    glitchTimeline
      .to(discRef.current, {
        rotation: `+=${recoilAngle}`,
        duration: duration * 0.4,
        ease: 'power4.out'
      }, 0)
      .to(progressObj, {
        value: 0,
        duration: duration,
        ease: 'power2.inOut'
      }, 0)
      .to(discRef.current, {
        rotation: `+=${recoilAngle * -0.25}`,
        duration: duration * 0.6,
        ease: 'elastic.out(1, 0.35)'
      }, duration * 0.4);
  }, [glitchMultiplier, renderDitherAndMacroblocks]);

  useEffect(() => {
    const img = new Image();
    img.src = './assets/images/ai_core_cd.jpg';
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

    const angle = Math.atan2(globalMousePos.y, globalMousePos.x) * (180 / Math.PI) + 180;
    cardRef.current.style.setProperty('--diffraction-angle', `${Math.round(angle)}deg`);
  }, [globalMousePos]);

  useEffect(() => {
    if (!discRef.current) return;

    let spinTween;
    if (isSpinning) {
      spinTween = gsap.to(discRef.current, {
        rotation: '+=360',
        duration: 18,
        ease: 'none',
        repeat: -1
      });
    }

    return () => {
      if (spinTween) spinTween.kill();
    };
  }, [isSpinning]);

  useEffect(() => {
    if (triggerGlitchCount > 0) {
      triggerLaserError();
    }
  }, [triggerGlitchCount, triggerLaserError]);

  const handleMouseEnter = () => {
    if (Math.random() < 0.4 * glitchMultiplier) {
      triggerLaserError();
    }
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="relative w-full max-w-[360px] aspect-[1/1] select-none cursor-pointer group"
      onMouseEnter={handleMouseEnter}
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
            src="./assets/images/ai_core_cd.jpg"
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
          className="absolute -inset-9 w-[calc(100%+72px)] h-[calc(100%+72px)] pointer-events-none z-30 overflow-visible"
        />
      </div>
    </div>
  );
}
