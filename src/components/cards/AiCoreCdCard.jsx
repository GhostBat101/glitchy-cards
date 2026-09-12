/**
 * AiCoreCdCard - Sculptural zero-text optical disc card featuring procedural C2 byte-rot macroblocks, caustic rainbow diffraction, and GSAP spindle track-jump recoil.
 * Communicates with: src/App.jsx (receives glitchIntensity, isSpinning, and triggerGlitchCount).
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const INTENSITY_FACTORS = {
  low: 0.6,
  medium: 1.0,
  critical: 1.8
};

export default function AiCoreCdCard({
  glitchIntensity = 'medium',
  isSpinning = true,
  triggerGlitchCount = 0
}) {
  const cardRef = useRef(null);
  const discRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const animFrameRef = useRef(null);
  const xQuickTo = useRef(null);
  const yQuickTo = useRef(null);

  const [glitchActive, setGlitchActive] = useState(false);

  const glitchMultiplier = INTENSITY_FACTORS[glitchIntensity] || 1.0;

  const renderGlitchFrame = useCallback((ctx, width, height, progress) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    if (progress <= 0) return;

    const blockCount = Math.floor((12 + Math.random() * 20) * glitchMultiplier);
    for (let i = 0; i < blockCount; i++) {
      const bw = Math.floor(Math.random() * 80 + 16);
      const bh = Math.floor(Math.random() * 28 + 6);
      const bx = Math.random() * (width - bw);
      const by = Math.random() * (height - bh);
      const shiftX = (Math.random() - 0.5) * 45 * progress * glitchMultiplier;

      ctx.save();
      ctx.beginPath();
      ctx.rect(bx, by, bw, bh);
      ctx.clip();

      if (imageRef.current && imageRef.current.complete) {
        ctx.drawImage(imageRef.current, shiftX, 0, width, height);
      }

      ctx.globalCompositeOperation = Math.random() > 0.5 ? 'difference' : 'screen';
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0, 246, 255, 0.45)' : 'rgba(255, 0, 127, 0.45)';
      ctx.fillRect(bx, by, bw, bh);

      if (Math.random() > 0.6) {
        ctx.fillStyle = '#ffffff';
        const dots = Math.floor(Math.random() * 8 + 2);
        for (let d = 0; d < dots; d++) {
          ctx.fillRect(
            bx + Math.random() * bw,
            by + Math.random() * bh,
            2,
            2
          );
        }
      }
      ctx.restore();
    }

    const ringCount = Math.floor(Math.random() * 4 + 1);
    const cx = width / 2;
    const cy = height / 2;
    for (let r = 0; r < ringCount; r++) {
      const radius = (0.2 + Math.random() * 0.45) * width;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = Math.random() > 0.5 ? 'rgba(0, 246, 255, 0.6)' : 'rgba(57, 255, 20, 0.5)';
      ctx.lineWidth = Math.random() * 3 + 1;
      ctx.setLineDash([Math.random() * 20 + 5, Math.random() * 15 + 5]);
      ctx.stroke();
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
        renderGlitchFrame(ctx, width, height, progressObj.value);
      },
      onComplete: () => {
        if (ctx) ctx.clearRect(0, 0, width, height);
        setGlitchActive(false);
      }
    });

    const recoilAngle = (Math.random() > 0.5 ? 1 : -1) * (45 + Math.random() * 75) * glitchMultiplier;
    const duration = (0.45 + Math.random() * 0.35) * Math.min(1.4, glitchMultiplier);

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
        rotation: `+=${recoilAngle * -0.3}`,
        duration: duration * 0.6,
        ease: 'elastic.out(1, 0.4)'
      }, duration * 0.4);
  }, [glitchMultiplier, renderGlitchFrame]);

  useEffect(() => {
    const img = new Image();
    img.src = './assets/images/ai_core_cd.jpg';
    imageRef.current = img;

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 380;
      canvas.height = 380;
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
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
      className="relative w-full max-w-[380px] aspect-[1/1.32] select-none cursor-pointer group"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={triggerLaserError}
    >
      <div
        ref={cardRef}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full rounded-[2.25rem] bg-[#0c0f17] border border-white/10 p-5 flex items-center justify-center overflow-hidden terracotta-card-shadow transition-all duration-300 group-hover:border-white/25"
      >
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black/60 border border-white/5 flex items-center justify-center p-3 shadow-inner">
          <div
            ref={discRef}
            className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border border-white/15"
          >
            <img
              src="./assets/images/ai_core_cd.jpg"
              alt="AI Core Optical CD"
              className="w-full h-full object-cover rounded-full pointer-events-none"
            />

            <div className="absolute inset-0 rounded-full cd-diffraction-overlay pointer-events-none opacity-65" />

            <div
              className="absolute inset-0 rounded-full pointer-events-none opacity-30 mix-blend-overlay"
              style={{
                background: 'conic-gradient(from var(--diffraction-angle) at 50% 50%, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%)'
              }}
            />
          </div>

          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl z-10"
          />
        </div>
      </div>
    </div>
  );
}
