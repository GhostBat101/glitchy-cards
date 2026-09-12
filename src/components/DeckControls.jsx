/**
 * DeckControls - Floating control panel for style switching, glitch intensity modulation, and manual error triggers.
 * Communicates with: src/App.jsx (transmits activeStyle, glitchIntensity, onTriggerGlitch, and isSpinning state).
 */
import React from 'react';
import { Disc, Terminal, Tv, Zap, Disc3 } from 'lucide-react';

const STYLES = [
  { id: 'ai-core', label: 'Corrupted AI / CD Artifact', icon: Disc, badge: 'ACTIVE' },
  { id: 'cyberpunk-hud', label: 'Cyberpunk HUD Matrix', icon: Terminal, badge: 'NEXT' },
  { id: 'retro-crt', label: 'Retro CRT / VHS Decay', icon: Tv, badge: 'NEXT' }
];

const INTENSITIES = [
  { id: 'low', label: 'Low', color: 'text-emerald-400 border-emerald-500/30' },
  { id: 'medium', label: 'Med', color: 'text-amber-400 border-amber-500/30' },
  { id: 'critical', label: 'Critical', color: 'text-rose-500 border-rose-500/40' }
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
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 bg-obsidian-800/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-1.5 p-1 bg-obsidian-900/90 rounded-xl border border-white/5 w-full md:w-auto overflow-x-auto">
        {STYLES.map((style) => {
          const Icon = style.icon;
          const isActive = activeStyle === style.id;
          return (
            <button
              key={style.id}
              onClick={() => setActiveStyle(style.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                isActive
                  ? 'bg-laser-cyan/15 text-laser-cyan border border-laser-cyan/40 shadow-lg shadow-laser-cyan/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'animate-spin-slow' : ''}`} />
              <span>{style.label}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                isActive ? 'bg-laser-cyan text-obsidian-900 font-bold' : 'bg-white/5 text-slate-500'
              }`}>
                {style.badge}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        <div className="flex items-center gap-1 bg-obsidian-900/90 p-1 rounded-xl border border-white/5">
          <span className="text-[10px] uppercase font-mono text-slate-400 px-2 font-semibold">Intensity:</span>
          {INTENSITIES.map((level) => (
            <button
              key={level.id}
              onClick={() => setGlitchIntensity(level.id)}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-all ${
                glitchIntensity === level.id
                  ? `bg-white/10 font-bold border ${level.color}`
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsSpinning(!isSpinning)}
          title="Toggle Disc Spin Drive"
          className={`p-2 rounded-xl border transition-all ${
            isSpinning
              ? 'bg-laser-violet/20 border-laser-violet/50 text-laser-violet'
              : 'bg-obsidian-900 border-white/5 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Disc3 className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={onTriggerGlitch}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-laser-magenta to-laser-cyan text-white font-mono text-xs font-bold shadow-lg shadow-laser-magenta/20 hover:shadow-laser-magenta/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Zap className="w-3.5 h-3.5 fill-white" />
          <span>FORCE READ ERROR</span>
        </button>
      </div>
    </div>
  );
}
