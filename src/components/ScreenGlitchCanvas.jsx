/**
 * ScreenGlitchCanvas - Full-viewport fixed overlay canvas rendering persistent slow-drift analog and digital glitch bleeding with whole-screen gradient falloff.
 * Communicates with: src/App.jsx (receives activeStyle, cardRect, glitchIntensity, triggerCount, and activeImageSrc).
 */
import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const INTENSITY_FACTORS = {
  low: 0.6,
  medium: 1.0,
  critical: 1.8
};

const ASCII_GLYPHS = ['0', '1', 'X', '7', 'F', 'A', '9', '%', '#', '*', '+', '=', '-', ':', '.'];

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

export default function ScreenGlitchCanvas({
  activeStyle = 'ai-core',
  cardRect = null,
  glitchIntensity = 'medium',
  triggerCount = 0,
  activeImageSrc = ''
}) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const animStateRef = useRef({
    progress: 0,
    slices: [],
    ditherBands: [],
    asciiStreams: [],
    trackingBarY: 0,
    startTime: 0
  });
  const tweenRef = useRef(null);
  const loopTimerRef = useRef(null);

  const glitchMultiplier = INTENSITY_FACTORS[glitchIntensity] || 1.0;

  const generateSlices = useCallback((rect, style) => {
    if (!rect) return [];
    const count = style === 'retro-crt'
      ? Math.floor((14 + Math.random() * 8) * glitchMultiplier)
      : Math.floor((8 + Math.random() * 6) * glitchMultiplier);

    const slices = [];
    for (let i = 0; i < count; i++) {
      const relY = Math.random() * rect.height;
      const height = Math.random() * (style === 'retro-crt' ? 14 : 32) + 8;
      const maxOffset = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 160 + 40) * glitchMultiplier;
      const color = Math.random() > 0.5 ? 'rgba(0, 246, 255, 0.5)' : 'rgba(255, 0, 127, 0.5)';
      const delay = Math.random() * 0.25;

      slices.push({
        relY,
        height,
        maxOffset,
        color,
        delay,
        skewFactor: (Math.random() - 0.5) * 40
      });
    }
    return slices;
  }, [glitchMultiplier]);

  const generateAsciiStreams = useCallback((rect) => {
    if (!rect) return [];
    const count = Math.floor((3 + Math.random() * 3) * glitchMultiplier);
    const streams = [];
    for (let i = 0; i < count; i++) {
      const relY = Math.random() * (rect.height - 40);
      const height = Math.random() * 36 + 18;
      const maxOffset = (Math.random() - 0.5) * 140 * glitchMultiplier;
      const glyphCount = Math.floor((rect.width + 300) / 10);
      const chars = Array.from({ length: glyphCount }, () =>
        ASCII_GLYPHS[Math.floor(Math.random() * ASCII_GLYPHS.length)]
      );

      streams.push({
        relY,
        height,
        maxOffset,
        chars,
        isLime: Math.random() > 0.6
      });
    }
    return streams;
  }, [glitchMultiplier]);

  const generateDitherBands = useCallback((rect) => {
    if (!rect) return [];
    const count = Math.floor((4 + Math.random() * 3) * glitchMultiplier);
    const bands = [];
    for (let i = 0; i < count; i++) {
      const relY = Math.random() * (rect.height - 30);
      const height = Math.random() * 40 + 16;
      const maxOffset = (Math.random() - 0.5) * 120 * glitchMultiplier;
      bands.push({ relY, height, maxOffset });
    }
    return bands;
  }, [glitchMultiplier]);

  const triggerGlitchWave = useCallback(() => {
    if (!cardRect || !canvasRef.current) return;

    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    const duration = (3.2 + Math.random() * 1.8) * Math.min(1.4, glitchMultiplier);

    animStateRef.current = {
      progress: 1,
      slices: generateSlices(cardRect, activeStyle),
      ditherBands: generateDitherBands(cardRect),
      asciiStreams: generateAsciiStreams(cardRect),
      trackingBarY: cardRect.top - 40,
      startTime: performance.now()
    };

    tweenRef.current = gsap.to(animStateRef.current, {
      progress: 0,
      duration: duration,
      ease: 'sine.inOut',
      onComplete: () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    });
  }, [cardRect, activeStyle, glitchMultiplier, generateSlices, generateDitherBands, generateAsciiStreams]);

  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const { progress, slices, ditherBands, asciiStreams } = animStateRef.current;
    if (progress <= 0 || !cardRect) return;

    const img = imageRef.current;
    if (!img || !img.complete) return;

    const smoothProgress = Math.sin(progress * Math.PI);

    if (activeStyle === 'ai-core') {
      for (const slice of slices) {
        const sy = cardRect.top + slice.relY;
        const sh = slice.height;
        const shiftX = slice.maxOffset * smoothProgress;

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, sy, width, sh);
        ctx.clip();

        ctx.drawImage(img, cardRect.left + shiftX, cardRect.top, cardRect.width, cardRect.height);

        ctx.globalCompositeOperation = 'difference';
        ctx.fillStyle = slice.color;
        ctx.fillRect(0, sy, width, sh);
        ctx.restore();
      }

      for (const band of ditherBands) {
        const dy = cardRect.top + band.relY;
        const dh = band.height;
        const shiftX = band.maxOffset * smoothProgress;
        const startX = Math.max(0, cardRect.left + shiftX - 120);
        const endX = Math.min(width, cardRect.left + shiftX + cardRect.width + 120);

        ctx.save();
        ctx.beginPath();
        ctx.rect(startX, dy, endX - startX, dh);
        ctx.clip();

        for (let y = dy; y < dy + dh; y += 5) {
          for (let x = startX; x < endX; x += 5) {
            const matrixX = Math.floor((x % 16) / 4);
            const matrixY = Math.floor((y % 16) / 4);
            const threshold = BAYER_4X4[matrixY][matrixX] * 16;
            const noise = ((Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1) * 255;

            if (Math.abs(noise) > threshold) {
              ctx.fillStyle = noise > 120 ? 'rgba(0, 246, 255, 0.8)' : 'rgba(255, 255, 255, 0.8)';
              ctx.fillRect(x, y, 3, 3);
            }
          }
        }
        ctx.restore();
      }

      const beamAngle = smoothProgress * Math.PI * 0.4;
      const cx = cardRect.left + cardRect.width / 2;
      const cy = cardRect.top + cardRect.height / 2;
      const length = Math.max(width, height) * 0.8;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(beamAngle) * length, cy + Math.sin(beamAngle) * length);
      ctx.lineTo(cx + Math.cos(beamAngle + 0.3) * length, cy + Math.sin(beamAngle + 0.3) * length);
      ctx.closePath();

      const beamGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, length);
      beamGrad.addColorStop(0, 'rgba(255, 0, 127, 0.5)');
      beamGrad.addColorStop(0.5, 'rgba(0, 246, 255, 0.35)');
      beamGrad.addColorStop(1, 'rgba(57, 255, 20, 0)');
      ctx.fillStyle = beamGrad;
      ctx.globalCompositeOperation = 'screen';
      ctx.fill();
      ctx.restore();
    } else if (activeStyle === 'cyberpunk-hud') {
      for (const slice of slices) {
        const sy = cardRect.top + slice.relY;
        const sh = slice.height;
        const shiftR = slice.maxOffset * smoothProgress;
        const shiftB = -shiftR * 1.3;

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, sy, width, sh);
        ctx.clip();

        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(img, cardRect.left, cardRect.top, cardRect.width, cardRect.height);

        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = 'rgba(255, 0, 127, 0.7)';
        ctx.drawImage(img, cardRect.left + shiftR, cardRect.top, cardRect.width, cardRect.height);

        ctx.fillStyle = 'rgba(0, 246, 255, 0.7)';
        ctx.drawImage(img, cardRect.left + shiftB, cardRect.top, cardRect.width, cardRect.height);

        ctx.restore();
      }

      for (const stream of asciiStreams) {
        const by = cardRect.top + stream.relY;
        const bh = stream.height;
        const shiftX = stream.maxOffset * smoothProgress;
        const startX = Math.max(0, cardRect.left + shiftX - 160);
        const endX = Math.min(width, cardRect.left + shiftX + cardRect.width + 160);

        ctx.save();
        ctx.beginPath();
        ctx.rect(startX, by, endX - startX, bh);
        ctx.clip();

        ctx.fillStyle = 'rgba(10, 15, 25, 0.85)';
        ctx.fillRect(startX, by, endX - startX, bh);

        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        const stepX = 11;
        const stepY = 14;

        let charIdx = 0;
        for (let gy = by + 12; gy < by + bh; gy += stepY) {
          for (let gx = startX; gx < endX; gx += stepX) {
            const glyph = stream.chars[charIdx % stream.chars.length];
            charIdx++;
            ctx.fillStyle = stream.isLime ? '#39ff14' : '#00f6ff';
            ctx.shadowColor = stream.isLime ? '#39ff14' : '#00f6ff';
            ctx.shadowBlur = 4;
            ctx.fillText(glyph, gx, gy);
          }
        }
        ctx.restore();
      }
    } else if (activeStyle === 'retro-crt') {
      for (const slice of slices) {
        const sy = cardRect.top + slice.relY;
        const sh = slice.height;
        const shiftX = slice.maxOffset * smoothProgress;

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, sy, width, sh);
        ctx.clip();

        ctx.drawImage(img, cardRect.left + shiftX, cardRect.top, cardRect.width, cardRect.height);

        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = 'rgba(255, 60, 0, 0.5)';
        ctx.drawImage(img, cardRect.left + shiftX - 10, cardRect.top, cardRect.width, cardRect.height);
        ctx.fillStyle = 'rgba(0, 200, 255, 0.5)';
        ctx.drawImage(img, cardRect.left + shiftX + 10, cardRect.top, cardRect.width, cardRect.height);
        ctx.restore();
      }

      const bottomThreshold = cardRect.top + cardRect.height * 0.84;
      const bottomEnd = cardRect.top + cardRect.height + 60;
      for (let y = bottomThreshold; y < bottomEnd; y += 2) {
        const factor = (y - bottomThreshold) / (cardRect.height * 0.16 + 60);
        const skew = Math.sin(y * 0.35 + (1 - progress) * 8) * 90 * factor * smoothProgress * glitchMultiplier;

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, y, width, 2);
        ctx.clip();
        ctx.drawImage(img, cardRect.left + skew, cardRect.top, cardRect.width, cardRect.height);

        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(img, cardRect.left + skew - 8, cardRect.top, cardRect.width, cardRect.height);
        ctx.restore();
      }

      const barHeight = 44;
      const currentBarY = (cardRect.top + (1 - progress) * (cardRect.height + 120)) % height;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, currentBarY, width, barHeight);
      ctx.clip();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(0, currentBarY, width, barHeight);

      const noiseImg = ctx.createImageData(width, barHeight);
      const data = noiseImg.data;
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() > 0.45 ? 255 : 0;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = Math.floor(Math.random() * 180 + 40);
      }
      ctx.putImageData(noiseImg, 0, currentBarY);
      ctx.restore();
    }

    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    const cx = cardRect.left + cardRect.width / 2;
    const cy = cardRect.top + cardRect.height / 2;
    const coreRadius = Math.max(cardRect.width, cardRect.height) * 0.48;
    const maxRadius = Math.hypot(width, height) * 0.58;
    const falloffGrad = ctx.createRadialGradient(cx, cy, coreRadius, cx, cy, maxRadius);
    falloffGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    falloffGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0.9)');
    falloffGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.35)');
    falloffGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = falloffGrad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }, [cardRect, activeStyle, glitchMultiplier]);

  useEffect(() => {
    let animId;
    const loop = () => {
      renderFrame();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animId);
  }, [renderFrame]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (activeImageSrc) {
      const img = new Image();
      img.src = activeImageSrc;
      imageRef.current = img;
    }
  }, [activeImageSrc]);

  useEffect(() => {
    const scheduleNext = () => {
      const r = Math.random();
      let delay;
      if (r < 0.28) {
        delay = 1400 + Math.random() * 1800;
      } else if (r < 0.72) {
        delay = 3800 + Math.random() * 4200;
      } else {
        delay = 8500 + Math.random() * 6000;
      }

      loopTimerRef.current = setTimeout(() => {
        triggerGlitchWave();
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    };
  }, [triggerGlitchWave]);

  useEffect(() => {
    if (triggerCount > 0) {
      triggerGlitchWave();
    }
  }, [triggerCount, triggerGlitchWave]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-20 overflow-hidden"
    />
  );
}
