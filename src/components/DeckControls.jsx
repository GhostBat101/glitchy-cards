/**
 * DeckControls - Pure functional navigation and modulation dock with 8-way ray-traced lighting selector styled in shades of #7f7f7f neutral gray.
 * Communicates with: src/App.jsx (transmits activeStyle, glitchIntensity, onTriggerGlitch, and lightPosition state).
 */
import React from 'react';
import { Disc, Crosshair, Tv, Zap, Sun } from 'lucide-react';

const STYLES = [
  { id: 'ai-core', icon: Disc, label: 'CD' },
  { id: 'cyberpunk-hud', icon: Crosshair, label: 'HUD' },
  { id: 'retro-crt', icon: Tv, label: 'CRT' }
];

const INTENSITIES = [
  { id: 'low', label: '1x', color: 'text-white border-white/60 bg-white/20' },
  { id: 'medium', label: '2x', color: 'text-white border-white/80 bg-white/30' },
  { id: 'critical', label: '3x', color: 'text-white border-white bg-white/40' }
];

const LIGHT_OPTIONS = [
  { id: 'top-left', label: 'TL' },
  { id: 'top', label: 'T' },
  { id: 'top-right', label: 'TR' },
  { id: 'left', label: 'L' },
  { id: 'off', label: 'OFF' },
  { id: 'right', label: 'R' },
  { id: 'bottom-left', label: 'BL' },
  { id: 'bottom', label: 'B' },
  { id: 'bottom-right', label: 'BR' }
];

export default function DeckControls({
  activeStyle,
  setActiveStyle,
  glitchIntensity,
  setGlitchIntensity,
  onTriggerGlitch,
  lightPosition = 'top-left',
  setLightPosition
}) {
  return (
    <div className="flex flex-col gap-2 p-2.5 bg-[#222222]/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full">
      <div className="flex items-center justify-between gap-1.5 p-1 bg-[#141414]/80 rounded-xl border border-white/10 overflow-x-auto">
        <div className="flex items-center gap-1 pl-2 pr-1 text-white/70">
          <Sun className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-1 flex-1 justify-around">
          {LIGHT_OPTIONS.map((opt) => {
            const isActive = lightPosition === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setLightPosition(opt.id)}
                aria-label={`Light ${opt.label}`}
                className={`px-2 py-1 text-[10px] font-mono font-bold rounded-lg transition-all ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-sm shadow-amber-400/40 scale-105'
                    : 'text-[#9e9e9e] hover:text-white hover:bg-white/10'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-[#141414]/80 rounded-xl border border-white/10">
          {STYLES.map((style) => {
            const Icon = style.icon;
            const isActive = activeStyle === style.id;
            return (
              <button
                key={style.id}
                onClick={() => setActiveStyle(style.id)}
                aria-label={style.label}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-black shadow-md shadow-black/40'
                    : 'text-[#bfbfbf] hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{style.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#141414]/80 p-1 rounded-xl border border-white/10">
            {INTENSITIES.map((level) => (
              <button
                key={level.id}
                onClick={() => setGlitchIntensity(level.id)}
                aria-label={level.label}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                  glitchIntensity === level.id
                    ? `font-bold border ${level.color}`
                    : 'text-[#9e9e9e] hover:text-white border border-transparent'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>

          <button
            onClick={onTriggerGlitch}
            aria-label="Trigger Glitch"
            className="flex items-center justify-center p-2 rounded-xl bg-[#141414] hover:bg-black border border-white/30 text-white shadow-lg transition-all active:scale-90"
          >
            <Zap className="w-4 h-4 fill-white text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
