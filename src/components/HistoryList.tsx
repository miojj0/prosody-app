'use client';

import { useState, useEffect } from 'react';

interface GeneratedLyric {
  id: number;
  original_lyric: string;
  theme: string;
  language: string;
  variants: string[];
  created_at: string;
}

export function HistoryList() {
  const [history, setHistory] = useState<GeneratedLyric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/history-test`);

      if (!response.ok) {
        setError('Erro ao carregar histórico');
        return;
      }

      const data = await response.json();
      setHistory(data.history || []);
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('✅ Copiado!');
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Carregando histórico...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl mb-2">📚</p>
        <p className="text-slate-400">Nenhuma letra gerada ainda</p>
        <p className="text-sm text-slate-500 mt-2">Gere sua primeira letra para vê-la aqui!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <div
          key={item.id}
          className="bg-slate-900/40 backdrop-blur border border-slate-700/30 rounded-xl p-4"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-purple-400">{item.theme}</span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-500">{item.language}</span>
              </div>
              <p className="text-xs text-slate-400">{formatDate(item.created_at)}</p>
            </div>
            <button
              onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
              className="text-slate-400 hover:text-slate-300 text-xl"
            >
              {selectedId === item.id ? '−' : '+'}
            </button>
          </div>

          {/* Collapsed Original */}
          <p className="text-sm text-slate-300 line-clamp-2 mb-3">
            <span className="text-slate-500">Original: </span>
            {item.original_lyric}
          </p>

          {/* Expanded Content */}
          {selectedId === item.id && (
            <div className="space-y-4 mt-4 pt-4 border-t border-slate-700/30">
              {/* Original */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Original</h4>
                <pre className="bg-slate-950 rounded-lg p-3 text-slate-100 text-xs overflow-auto max-h-40 whitespace-pre-wrap font-mono border border-slate-700/30 leading-relaxed">
                  {item.original_lyric}
                </pre>
                <button
                  onClick={() => handleCopy(item.original_lyric)}
                  className="mt-2 text-xs text-slate-400 hover:text-slate-300"
                >
                  📋 Copiar
                </button>
              </div>

              {/* Variants */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Gerações ({item.variants.length})</h4>
                {item.variants.map((variant, idx) => (
                  <div key={idx}>
                    <div className="text-xs text-slate-400 mb-1">Opção {idx + 1}</div>
                    <pre className="bg-slate-950 rounded-lg p-3 text-slate-100 text-xs overflow-auto max-h-32 whitespace-pre-wrap font-mono border border-slate-700/30 leading-relaxed">
                      {variant}
                    </pre>
                    <button
                      onClick={() => handleCopy(variant)}
                      className="mt-1 text-xs text-slate-400 hover:text-slate-300"
                    >
                      📋 Copiar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
