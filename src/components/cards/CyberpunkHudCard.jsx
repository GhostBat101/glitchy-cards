/**
 * CyberpunkHudCard - Sculptural zero-text tactical netrunner card featuring pure geometric HUD vectors, procedural RGB channel separation, and horizontal pixel-datamosh drift.
 * Communicates with: src/App.jsx (receives glitchIntensity and triggerGlitchCount).
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const INTENSITY_FACTORS = {
  low: 0.6,
  medium: 1.0,
  critical: 1.8
};

export default function CyberpunkHudCard({
  glitchIntensity = 'medium',
  triggerGlitchCount = 0
}) {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const xQuickTo = useRef(null);
  const yQuickTo = useRef(null);

  const [glitchActive, setGlitchActive] = useState(false);
  const [eqHeights, setEqHeights] = useState([12, 24, 8, 18, 30, 14, 20, 10, 26, 16]);

  const glitchMultiplier = INTENSITY_FACTORS[glitchIntensity] || 1.0;

  const renderCyberpunkGlitch = useCallback((ctx, width, height, progress) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    if (progress <= 0) return;

    const img = imageRef.current;
    if (!img || !img.complete) return;

    const sliceCount = Math.floor((6 + Math.random() * 12) * glitchMultiplier);
    for (let i = 0; i < sliceCount; i++) {
      const sy = Math.random() * height;
      const sh = Math.random() * 32 + 6;
      const shiftR = (Math.random() - 0.5) * 40 * progress * glitchMultiplier;
      const shiftB = -shiftR * 1.2;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, sy, width, sh);
      ctx.clip();

      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(img, 0, 0, width, height);

      ctx.globalCompositeOperation = 'screen';

      ctx.fillStyle = 'rgba(255, 0, 127, 0.5)';
      ctx.drawImage(img, shiftR, 0, width, height);

      ctx.fillStyle = 'rgba(0, 246, 255, 0.5)';
      ctx.drawImage(img, shiftB, 0, width, height);

      if (Math.random() > 0.5) {
        ctx.globalCompositeOperation = 'difference';
        ctx.fillStyle = 'rgba(0, 246, 255, 0.3)';
        ctx.fillRect(0, sy, width, sh);
      }

      ctx.restore();
    }

    const moshCount = Math.floor(Math.random() * 5 + 2);
    for (let m = 0; m < moshCount; m++) {
      const my = Math.random() * height;
      const mh = Math.random() * 18 + 4;
      const moshShift = (Math.random() - 0.5) * 60 * progress * glitchMultiplier;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, my, width, mh);
      ctx.clip();
      ctx.drawImage(img, moshShift, 0, width, height);
      ctx.restore();
    }

    const noiseSpots = Math.floor((20 + Math.random() * 35) * glitchMultiplier);
    for (let n = 0; n < noiseSpots; n++) {
      const nx = Math.random() * width;
      const ny = Math.random() * height;
      const nw = Math.random() * 16 + 2;
      const nh = Math.random() * 4 + 1;

      ctx.fillStyle = Math.random() > 0.5 ? '#00f6ff' : '#ff007f';
      ctx.fillRect(nx, ny, nw, nh);
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

    const duration = (0.4 + Math.random() * 0.3) * Math.min(1.4, glitchMultiplier);

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
      canvas.width = 380;
      canvas.height = 380;
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEqHeights(prev =>
        prev.map(() => Math.floor(Math.random() * 26 + 6))
      );
    }, 120);

    return () => clearInterval(interval);
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
      className="relative w-full max-w-[380px] aspect-[1/1.32] select-none cursor-pointer group"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={triggerMatrixGlitch}
    >
      <div
        ref={cardRef}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full rounded-[2.25rem] bg-[#0c0f17] border border-laser-cyan/20 p-5 flex items-center justify-center overflow-hidden terracotta-card-shadow transition-all duration-300 group-hover:border-laser-cyan/40"
      >
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black/60 border border-laser-cyan/25 flex items-center justify-center shadow-inner">
          <img
            src="./assets/images/cyberpunk_matrix.jpg"
            alt="Cyberpunk Netrunner Operative"
            className="w-full h-full object-cover rounded-2xl pointer-events-none filter saturate-[1.15]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none rounded-2xl" />

          <div className="absolute inset-4 pointer-events-none z-20 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-5 h-5 border-t-2 border-l-2 border-laser-cyan/80" />
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-laser-cyan animate-ping" />
                <div className="w-1.5 h-1.5 rounded-full bg-laser-lime" />
              </div>
              <div className="w-5 h-5 border-t-2 border-r-2 border-laser-cyan/80" />
            </div>

            <div className="flex items-center justify-center">
              <div className="relative w-28 h-28 rounded-full border border-laser-cyan/30 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-dashed border-laser-magenta/40 animate-spin-slow" />
                <div className="absolute w-2 h-2 rounded-full bg-laser-cyan/90" />
                <div className="absolute w-32 h-[1px] bg-laser-cyan/20" />
                <div className="absolute h-32 w-[1px] bg-laser-cyan/20" />
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div className="w-5 h-5 border-b-2 border-l-2 border-laser-cyan/80" />

              <div className="flex items-end gap-1 h-8 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-laser-cyan/20">
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
            className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl z-30"
          />
        </div>
      </div>
    </div>
  );
}
