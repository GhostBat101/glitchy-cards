/**
 * ScreenGlitchCanvas - High-energy electronic glitch burst engine with quantized stepped jitters, chromatic RGB separation, and gradient falloff bleed.
 * Communicates with: src/App.jsx (receives activeStyle, cardRect, glitchIntensity, triggerCount, activeImageSrc, and emits onGlitchActive).
 */
import React, { useEffect, useRef, useCallback } from 'react';

const INTENSITY_FACTORS = {
  low: 0.7,
  medium: 1.2,
  critical: 2.0
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
  activeImageSrc = '',
  onGlitchActive = null
}) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const animStateRef = useRef({
    isBursting: false,
    burstStart: 0,
    burstDuration: 0,
    burstTick: -1,
    amp: 0,
    slices: [],
    macroblocks: [],
    asciiStreams: [],
    ditherBands: [],
    trackingBarY: 0
  });
  const loopTimerRef = useRef(null);

  const glitchMultiplier = INTENSITY_FACTORS[glitchIntensity] || 1.2;

  const generateBurstSubState = useCallback((rect, style) => {
    if (!rect) return { slices: [], macroblocks: [], asciiStreams: [], ditherBands: [], trackingBarY: 0 };

    const sliceCount = Math.floor((6 + Math.random() * 8) * glitchMultiplier);
    const slices = [];
    for (let i = 0; i < sliceCount; i++) {
      const relY = Math.random() * (rect.height - 12);
      const height = Math.random() * (style === 'retro-crt' ? 16 : 28) + 6;
      const shiftX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 80 + 20) * glitchMultiplier;
      const rgbSplit = (Math.random() * 18 + 6) * glitchMultiplier;
      slices.push({ relY, height, shiftX, rgbSplit });
    }

    const blockCount = Math.floor((3 + Math.random() * 4) * glitchMultiplier);
    const macroblocks = [];
    for (let i = 0; i < blockCount; i++) {
      const bx = Math.random() * (rect.width - 60);
      const by = Math.random() * (rect.height - 40);
      const bw = Math.random() * 90 + 40;
      const bh = Math.random() * 34 + 14;
      const offsetX = (Math.random() - 0.5) * 70 * glitchMultiplier;
      const offsetY = (Math.random() - 0.5) * 16 * glitchMultiplier;
      macroblocks.push({ bx, by, bw, bh, offsetX, offsetY });
    }

    const streamCount = Math.floor((3 + Math.random() * 3) * glitchMultiplier);
    const asciiStreams = [];
    for (let i = 0; i < streamCount; i++) {
      const relY = Math.random() * (rect.height - 30);
      const height = Math.random() * 28 + 14;
      const shiftX = (Math.random() - 0.5) * 80 * glitchMultiplier;
      const charCount = Math.floor((rect.width + 160) / 10);
      const chars = Array.from({ length: charCount }, () =>
        ASCII_GLYPHS[Math.floor(Math.random() * ASCII_GLYPHS.length)]
      );
      asciiStreams.push({ relY, height, shiftX, chars, isLime: Math.random() > 0.5 });
    }

    const bandCount = Math.floor((3 + Math.random() * 3) * glitchMultiplier);
    const ditherBands = [];
    for (let i = 0; i < bandCount; i++) {
      const relY = Math.random() * (rect.height - 24);
      const height = Math.random() * 32 + 12;
      const shiftX = (Math.random() - 0.5) * 75 * glitchMultiplier;
      ditherBands.push({ relY, height, shiftX });
    }

    const trackingBarY = rect.top + Math.random() * rect.height;

    return { slices, macroblocks, asciiStreams, ditherBands, trackingBarY };
  }, [glitchMultiplier]);

  const triggerGlitchBurst = useCallback(() => {
    if (!cardRect || !canvasRef.current) return;
    const duration = (420 + Math.random() * 320);
    const now = performance.now();
    const subState = generateBurstSubState(cardRect, activeStyle);

    animStateRef.current = {
      isBursting: true,
      burstStart: now,
      burstDuration: duration,
      burstTick: 0,
      amp: 1,
      ...subState
    };

    if (onGlitchActive) onGlitchActive(true);
  }, [cardRect, activeStyle, generateBurstSubState, onGlitchActive]);

  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const { isBursting, burstStart, burstDuration, burstTick } = animStateRef.current;
    if (!isBursting || !cardRect) return;

    const now = performance.now();
    const elapsed = now - burstStart;

    if (elapsed >= burstDuration) {
      animStateRef.current.isBursting = false;
      animStateRef.current.amp = 0;
      if (onGlitchActive) onGlitchActive(false);
      return;
    }

    const currentTick = Math.floor(elapsed / 52);
    if (currentTick !== burstTick) {
      animStateRef.current.burstTick = currentTick;
      const updated = generateBurstSubState(cardRect, activeStyle);
      animStateRef.current.slices = updated.slices;
      animStateRef.current.macroblocks = updated.macroblocks;
      animStateRef.current.asciiStreams = updated.asciiStreams;
      animStateRef.current.ditherBands = updated.ditherBands;
      animStateRef.current.trackingBarY = updated.trackingBarY;
    }

    const img = imageRef.current;
    if (!img || !img.complete) return;

    const amp = 1.0 - (elapsed / burstDuration) * 0.35;
    const bleedMargin = 160 * glitchMultiplier;
    const clipX = Math.max(0, cardRect.left - bleedMargin);
    const clipW = Math.min(width - clipX, cardRect.width + bleedMargin * 2);

    const { slices, macroblocks, asciiStreams, ditherBands, trackingBarY } = animStateRef.current;

    for (const slice of slices) {
      const sy = cardRect.top + slice.relY;
      const sh = slice.height;
      const shiftX = slice.shiftX * amp;
      const split = slice.rgbSplit * amp;

      ctx.save();
      ctx.beginPath();
      ctx.rect(clipX, sy, clipW, sh);
      ctx.clip();

      ctx.drawImage(img, cardRect.left + shiftX, cardRect.top, cardRect.width, cardRect.height);

      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(img, cardRect.left + shiftX - split, cardRect.top, cardRect.width, cardRect.height);
      ctx.drawImage(img, cardRect.left + shiftX + split, cardRect.top, cardRect.width, cardRect.height);

      ctx.restore();
    }

    for (const block of macroblocks) {
      const sx = cardRect.left + block.bx;
      const sy = cardRect.top + block.by;
      const shiftX = block.offsetX * amp;
      const shiftY = block.offsetY * amp;

      ctx.save();
      ctx.beginPath();
      ctx.rect(clipX, sy, clipW, block.bh);
      ctx.clip();

      ctx.drawImage(
        img,
        (block.bx / cardRect.width) * img.naturalWidth,
        (block.by / cardRect.height) * img.naturalHeight,
        (block.bw / cardRect.width) * img.naturalWidth,
        (block.bh / cardRect.height) * img.naturalHeight,
        sx + shiftX,
        sy + shiftY,
        block.bw,
        block.bh
      );

      ctx.globalCompositeOperation = 'difference';
      ctx.fillStyle = currentTick % 2 === 0 ? 'rgba(0, 246, 255, 0.4)' : 'rgba(255, 0, 127, 0.4)';
      ctx.fillRect(sx + shiftX, sy + shiftY, block.bw, block.bh);
      ctx.restore();
    }

    if (activeStyle === 'ai-core') {
      for (const band of ditherBands) {
        const dy = cardRect.top + band.relY;
        const dh = band.height;
        const shiftX = band.shiftX * amp;
        const startX = Math.max(0, cardRect.left + shiftX - 80);
        const endX = Math.min(width, cardRect.left + shiftX + cardRect.width + 80);

        ctx.save();
        ctx.beginPath();
        ctx.rect(startX, dy, endX - startX, dh);
        ctx.clip();

        for (let y = dy; y < dy + dh; y += 4) {
          for (let x = startX; x < endX; x += 4) {
            const matrixX = Math.floor((x % 16) / 4);
            const matrixY = Math.floor((y % 16) / 4);
            const threshold = BAYER_4X4[matrixY][matrixX] * 16;
            const noise = ((Math.sin(x * 12.9898 + y * 78.233 + currentTick * 17.0) * 43758.5453) % 1) * 255;

            if (Math.abs(noise) > threshold) {
              ctx.fillStyle = noise > 120 ? 'rgba(0, 246, 255, 0.85)' : 'rgba(255, 0, 127, 0.85)';
              ctx.fillRect(x, y, 3, 3);
            }
          }
        }
        ctx.restore();
      }
    } else if (activeStyle === 'cyberpunk-hud') {
      for (const stream of asciiStreams) {
        const by = cardRect.top + stream.relY;
        const bh = stream.height;
        const shiftX = stream.shiftX * amp;
        const startX = Math.max(0, cardRect.left + shiftX - 90);
        const endX = Math.min(width, cardRect.left + shiftX + cardRect.width + 90);

        ctx.save();
        ctx.beginPath();
        ctx.rect(startX, by, endX - startX, bh);
        ctx.clip();

        ctx.fillStyle = 'rgba(10, 15, 25, 0.85)';
        ctx.fillRect(startX, by, endX - startX, bh);

        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        const stepX = 10;
        const stepY = 13;

        let charIdx = 0;
        for (let gy = by + 11; gy < by + bh; gy += stepY) {
          for (let gx = startX; gx < endX; gx += stepX) {
            const glyph = stream.chars[charIdx % stream.chars.length];
            charIdx++;
            ctx.fillStyle = stream.isLime ? '#39ff14' : '#00f6ff';
            ctx.shadowColor = stream.isLime ? '#39ff14' : '#00f6ff';
            ctx.shadowBlur = 3;
            ctx.fillText(glyph, gx, gy);
          }
        }
        ctx.restore();
      }
    } else if (activeStyle === 'retro-crt') {
      const bottomThreshold = cardRect.top + cardRect.height * 0.82;
      const bottomEnd = cardRect.top + cardRect.height + 40;
      for (let y = bottomThreshold; y < bottomEnd; y += 2) {
        const factor = (y - bottomThreshold) / (cardRect.height * 0.18 + 40);
        const skew = Math.sin(y * 0.45 + currentTick * 5.0) * 85 * factor * amp * glitchMultiplier;

        ctx.save();
        ctx.beginPath();
        ctx.rect(clipX, y, clipW, 2);
        ctx.clip();

        ctx.drawImage(img, cardRect.left + skew, cardRect.top, cardRect.width, cardRect.height);

        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(img, cardRect.left + skew - 12, cardRect.top, cardRect.width, cardRect.height);
        ctx.restore();
      }

      const barHeight = 36;
      ctx.save();
      ctx.beginPath();
      ctx.rect(clipX, trackingBarY, clipW, barHeight);
      ctx.clip();

      const noiseImg = ctx.createImageData(Math.floor(clipW), barHeight);
      const data = noiseImg.data;
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() > 0.4 ? 255 : 0;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = Math.floor(Math.random() * 200 + 40);
      }
      ctx.putImageData(noiseImg, clipX, trackingBarY);
      ctx.restore();
    }

    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    const cx = cardRect.left + cardRect.width / 2;
    const cy = cardRect.top + cardRect.height / 2;
    const coreRadius = Math.max(cardRect.width, cardRect.height) * 0.45;
    const maxRadius = Math.max(cardRect.width, cardRect.height) * 1.35;
    const falloffGrad = ctx.createRadialGradient(cx, cy, coreRadius, cx, cy, maxRadius);
    falloffGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    falloffGrad.addColorStop(0.35, 'rgba(0, 0, 0, 0.95)');
    falloffGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.3)');
    falloffGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = falloffGrad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }, [cardRect, activeStyle, glitchMultiplier, generateBurstSubState, onGlitchActive]);

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
      if (r < 0.35) {
        delay = 1200 + Math.random() * 1200;
      } else if (r < 0.75) {
        delay = 2600 + Math.random() * 2200;
      } else {
        delay = 5000 + Math.random() * 3000;
      }

      loopTimerRef.current = setTimeout(() => {
        triggerGlitchBurst();
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    };
  }, [triggerGlitchBurst]);

  useEffect(() => {
    if (triggerCount > 0) {
      triggerGlitchBurst();
    }
  }, [triggerCount, triggerGlitchBurst]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-20 overflow-hidden"
    />
  );
}
