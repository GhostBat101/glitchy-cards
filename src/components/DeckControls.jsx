/**
 * DeckControls - Floating navigation and modulation dock for card style switching and glitch trigger events.
 * Communicates with: src/App.jsx (transmits activeStyle, glitchIntensity, onTriggerGlitch, and isSpinning state).
 */
import React from 'react';
import { Disc, Terminal, Tv, Zap, Disc3 } from 'lucide-react';

const STYLES = [
  { id: 'ai-core', label: 'AI Core / CD Artifact', icon: Disc },
  { id: 'cyberpunk-hud', label: 'Cyberpunk HUD', icon: Terminal },
  { id: 'retro-crt', label: 'Retro CRT / VHS', icon: Tv }
];

const INTENSITIES = [
  { id: 'low', label: 'Low', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
  { id: 'medium', label: 'Med', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
  { id: 'critical', label: 'Critical', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' }
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
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-2.5 bg-[#0c0f17]/90 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/5 w-full md:w-auto">
        {STYLES.map((style) => {
          const Icon = style.icon;
          const isActive = activeStyle === style.id;
          return (
            <button
              key={style.id}
              onClick={() => setActiveStyle(style.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                isActive
                  ? 'bg-white text-black font-bold shadow-lg shadow-black/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{style.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
          <span className="text-[10px] uppercase font-mono text-slate-400 px-2">GLITCH:</span>
          {INTENSITIES.map((level) => (
            <button
              key={level.id}
              onClick={() => setGlitchIntensity(level.id)}
              className={`px-2 py-0.5 text-[10px] font-mono rounded-md transition-all ${
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
            title="Toggle Disc Spin Drive"
            className={`p-1.5 rounded-xl border transition-all ${
              isSpinning
                ? 'bg-laser-cyan/15 border-laser-cyan/40 text-laser-cyan'
                : 'bg-black/40 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Disc3 className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
          </button>
        )}

        <button
          onClick={onTriggerGlitch}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black hover:bg-slate-900 border border-white/20 text-white font-mono text-xs font-bold shadow-lg transition-all active:scale-95"
        >
          <Zap className="w-3.5 h-3.5 fill-laser-cyan text-laser-cyan" />
          <span>TRIGGER GLITCH</span>
        </button>
      </div>
    </div>
  );
}
