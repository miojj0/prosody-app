'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface LyricGeneratorProps {
  onGenerate?: (data: GenerateRequest) => void;
  isLoading?: boolean;
}

export interface GenerateRequest {
  fragmento: string;
  tema: string;
  idioma: string;
  quantidade: number;
}

export function LyricGenerator({ onGenerate, isLoading }: LyricGeneratorProps) {
  const [fragmento, setFragmento] = useState('');
  const [tema, setTema] = useState('');
  const [idioma, setIdioma] = useState('português');
  const [quantidade, setQuantidade] = useState(4);
  const [prosodyAnalysis, setProsodyAnalysis] = useState<any>(null);

  const analyzeProsody = () => {
    if (!fragmento.trim()) return;

    const lines = fragmento.split('\n').filter(l => l.trim());
    const syllables = (fragmento.match(/[aeiouáéíóú]/gi) || []).length;
    const avgSyllables = Math.round(syllables / lines.length);

    setProsodyAnalysis({
      totalLines: lines.length,
      avgSyllablesPerLine: avgSyllables,
      rhythmType: avgSyllables > 10 ? 'Lento' : avgSyllables < 8 ? 'Rápido' : 'Equilibrado'
    });
  };

  const handleGenerate = () => {
    if (!fragmento.trim() || !tema.trim() || !prosodyAnalysis) return;
    onGenerate?.({
      fragmento,
      tema,
      idioma,
      quantidade
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Fragmento */}
        <div className="bg-slate-900/40 backdrop-blur border border-slate-700/30 rounded-2xl p-8">
          <h2 className="text-lg font-bold mb-2">📝 Fragmento</h2>
          <p className="text-sm text-slate-400 mb-4">Cole um verso ou refrão</p>
          <textarea
            value={fragmento}
            onChange={(e) => setFragmento(e.target.value)}
            placeholder="Cole um fragmento de letra..."
            rows={5}
            className="w-full bg-slate-950 text-white rounded-xl px-4 py-3 border border-slate-700/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none text-sm resize-none"
          />
          <button
            onClick={analyzeProsody}
            className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl rounded-xl font-semibold transition"
          >
            📊 Analisar Prosódia
          </button>

          {prosodyAnalysis && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between bg-slate-950 p-3 rounded-lg text-sm">
                <span>Linhas:</span>
                <span className="font-bold text-purple-400">{prosodyAnalysis.totalLines}</span>
              </div>
              <div className="flex justify-between bg-slate-950 p-3 rounded-lg text-sm">
                <span>Sílabas/linha:</span>
                <span className="font-bold text-purple-400">~{prosodyAnalysis.avgSyllablesPerLine}</span>
              </div>
              <div className="flex justify-between bg-slate-950 p-3 rounded-lg text-sm">
                <span>Ritmo:</span>
                <span className="font-bold text-purple-400">{prosodyAnalysis.rhythmType}</span>
              </div>
            </div>
          )}
        </div>

        {/* Tema e Idioma */}
        <div className="bg-slate-900/40 backdrop-blur border border-slate-700/30 rounded-2xl p-8">
          <h2 className="text-lg font-bold mb-4">🎨 Novo Tema</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Tema</label>
              <textarea
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ex: Amor, liberdade, melancolia..."
                rows={3}
                className="w-full bg-slate-950 text-white rounded-xl px-4 py-3 border border-slate-700/40 focus:border-purple-500 outline-none text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Idioma</label>
              <select
                value={idioma}
                onChange={(e) => setIdioma(e.target.value)}
                className="w-full bg-slate-950 text-white rounded-xl px-4 py-3 border border-slate-700/40 focus:border-purple-500 outline-none text-sm"
              >
                <option value="português">Português</option>
                <option value="inglês">Inglês</option>
                <option value="espanhol">Espanhol</option>
                <option value="francês">Francês</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Quantidade de Letras</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setQuantidade(num)}
                    className={cn(
                      'py-2 rounded-lg font-semibold transition',
                      quantidade === num
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !prosodyAnalysis}
            className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl rounded-xl font-bold text-lg transition disabled:opacity-50"
          >
            {isLoading ? '⏳ Gerando...' : '⚡ Gerar Letras'}
          </button>
        </div>
      </div>
    </div>
  );
}
