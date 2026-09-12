/**
 * DeckControls - Pure functional navigation and trigger dock for card style switching and glitch modulation.
 * Communicates with: src/App.jsx (transmits activeStyle, glitchIntensity, onTriggerGlitch, and isSpinning state).
 */
import React from 'react';
import { Disc, Crosshair, Tv, Zap, Disc3 } from 'lucide-react';

const STYLES = [
  { id: 'ai-core', icon: Disc, label: 'CD' },
  { id: 'cyberpunk-hud', icon: Crosshair, label: 'HUD' },
  { id: 'retro-crt', icon: Tv, label: 'CRT' }
];

const INTENSITIES = [
  { id: 'low', label: '1x', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/15' },
  { id: 'medium', label: '2x', color: 'text-amber-400 border-amber-500/40 bg-amber-500/15' },
  { id: 'critical', label: '3x', color: 'text-rose-400 border-rose-500/40 bg-rose-500/15' }
];

export default function DeckControls({
  activeStyle,
  setActiveStyle,
  glitchIntensity,
  setGlitchIntensity,
  onTriggerGlitch,
  isSpinning,
  setIsSpinning
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-2 bg-[#0c0f17]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl w-full">
      <div className="flex items-center gap-1.5 p-1 bg-black/50 rounded-xl border border-white/5">
        {STYLES.map((style) => {
          const Icon = style.icon;
          const isActive = activeStyle === style.id;
          return (
            <button
              key={style.id}
              onClick={() => setActiveStyle(style.id)}
              aria-label={style.label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-white text-black shadow-md shadow-black/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{style.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/5">
          {INTENSITIES.map((level) => (
            <button
              key={level.id}
              onClick={() => setGlitchIntensity(level.id)}
              aria-label={level.label}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                glitchIntensity === level.id
                  ? `font-bold border ${level.color}`
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>

        {activeStyle === 'ai-core' && (
          <button
            onClick={() => setIsSpinning(!isSpinning)}
            aria-label="Toggle Spin"
            className={`p-2 rounded-xl border transition-all ${
              isSpinning
                ? 'bg-laser-cyan/15 border-laser-cyan/40 text-laser-cyan'
                : 'bg-black/50 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Disc3 className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
          </button>
        )}

        <button
          onClick={onTriggerGlitch}
          aria-label="Trigger Glitch"
          className="flex items-center justify-center p-2 rounded-xl bg-black hover:bg-slate-900 border border-laser-cyan/40 text-laser-cyan shadow-lg transition-all active:scale-90"
        >
          <Zap className="w-4 h-4 fill-laser-cyan" />
        </button>
      </div>
    </div>
  );
}
