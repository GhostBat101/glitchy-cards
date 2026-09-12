/**
 * CyberpunkHudCard - Tactical cyberpunk HUD card component placeholder for upcoming phase.
 * Communicates with: src/App.jsx.
 */
import React from 'react';
import { Terminal, ShieldAlert, Cpu } from 'lucide-react';

export default function CyberpunkHudCard() {
  const statusLabel = "QUEUED_FOR_PHASE_2";
  const protocolId = "SYS.NET_0x99A";

  return (
    <div className="relative w-full max-w-[420px] aspect-[1/1.42] rounded-3xl bg-obsidian-900 border border-laser-cyan/30 p-8 flex flex-col justify-between overflow-hidden shadow-2xl shadow-laser-cyan/10">
      <div className="absolute inset-0 bg-gradient-to-b from-laser-cyan/5 via-transparent to-laser-cyan/10 pointer-events-none" />
      <div className="flex items-center justify-between border-b border-laser-cyan/20 pb-4">
        <div className="flex items-center gap-2 text-laser-cyan font-mono text-xs">
          <Terminal className="w-4 h-4" />
          <span>CYBERPUNK MATRIX HUD</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-laser-cyan/10 text-laser-cyan border border-laser-cyan/30">
          {protocolId}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center text-center my-auto py-8">
        <div className="w-16 h-16 rounded-2xl bg-laser-cyan/10 border border-laser-cyan/30 flex items-center justify-center text-laser-cyan mb-4 animate-pulse">
          <Cpu className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-mono font-bold text-white tracking-wider mb-2">MATRIX COMPONENT</h3>
        <p className="text-xs font-mono text-slate-400 max-w-[260px] leading-relaxed">
          Tactical chamfered borders, dynamic hex decode stream, and slice matrix jitter arriving in next release step.
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-laser-cyan/20 font-mono text-[11px] text-slate-400">
        <span className="flex items-center gap-1 text-amber-400">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{statusLabel}</span>
        </span>
        <span className="text-slate-500">v0.2.0</span>
      </div>
    </div>
  );
}
