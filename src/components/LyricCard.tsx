'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface LyricCardProps {
  lyrics: string[];
  currentIndex: number;
  onTabChange: (index: number) => void;
  onCopy?: (text: string) => void;
  onDownload?: (text: string, index: number) => void;
  onSave?: (index: number) => void;
}

export function LyricCard({
  lyrics,
  currentIndex,
  onTabChange,
  onCopy,
  onDownload,
  onSave
}: LyricCardProps) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/40 backdrop-blur border border-slate-700/30 rounded-2xl p-8">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-700/30 mb-8 overflow-x-auto">
        {lyrics.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onTabChange(idx)}
            className={cn(
              'pb-4 px-4 font-semibold transition text-sm whitespace-nowrap',
              currentIndex === idx
                ? 'border-b-2 border-purple-500 text-white'
                : 'border-b-2 border-transparent text-slate-400 hover:text-slate-300'
            )}
          >
            Opção {idx + 1}
          </button>
        ))}
      </div>

      {/* Lyrics Display */}
      <div className="mb-6">
        <pre className="bg-slate-950 rounded-lg p-6 text-slate-100 text-sm overflow-auto max-h-96 whitespace-pre-wrap font-mono border border-slate-700/30 leading-relaxed">
          {lyrics[currentIndex]}
        </pre>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => onCopy?.(lyrics[currentIndex])}
          className="flex-1 py-3 bg-slate-800/60 hover:bg-slate-700/60 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm border border-slate-700/30"
        >
          📋 <span className="hidden sm:inline">Copiar</span>
        </button>
        <button
          onClick={() => onDownload?.(lyrics[currentIndex], currentIndex)}
          className="flex-1 py-3 bg-slate-800/60 hover:bg-slate-700/60 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm border border-slate-700/30"
        >
          ⬇️ <span className="hidden sm:inline">Baixar</span>
        </button>
        <button
          onClick={() => onSave?.(currentIndex)}
          className="flex-1 py-3 bg-purple-600/40 hover:bg-purple-600/60 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm border border-purple-500/30"
        >
          ❤️ <span className="hidden sm:inline">Salvar</span>
        </button>
      </div>
    </div>
  );
}
