/**
 * RetroCrtCard - Analog CRT and VHS decay card component placeholder for upcoming phase.
 * Communicates with: src/App.jsx.
 */
import React from 'react';
import { Tv, Radio, AlertTriangle } from 'lucide-react';

export default function RetroCrtCard() {
  const statusLabel = "QUEUED_FOR_PHASE_3";
  const channelFreq = "CH 03 • 60Hz";

  return (
    <div className="relative w-full max-w-[420px] aspect-[1/1.42] rounded-3xl bg-[#0d0d0f] border border-amber-500/30 p-8 flex flex-col justify-between overflow-hidden shadow-2xl shadow-amber-500/10">
      <div className="absolute inset-0 scanlines-overlay opacity-40 pointer-events-none" />
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2 text-amber-400 font-mono text-xs">
          <Tv className="w-4 h-4" />
          <span>ANALOG CRT / VHS</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
          {channelFreq}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center text-center my-auto py-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 animate-pulse">
          <Radio className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-mono font-bold text-amber-200 tracking-wider mb-2">V-HOLD DECAY</h3>
        <p className="text-xs font-mono text-slate-400 max-w-[260px] leading-relaxed">
          Phosphor scanlines, magnetic tube distortion, and tape tracking static arriving in upcoming release step.
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-amber-500/20 font-mono text-[11px] text-slate-400">
        <span className="flex items-center gap-1 text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{statusLabel}</span>
        </span>
        <span className="text-slate-500">NTSC • SP</span>
      </div>
    </div>
  );
}
