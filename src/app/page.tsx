'use client';

import { useState } from 'react';
import { LyricGenerator, type GenerateRequest } from '@/components/LyricGenerator';
import { LyricCard } from '@/components/LyricCard';

export default function Home() {
  const [generatedLyrics, setGeneratedLyrics] = useState<string[]>([]);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (data: GenerateRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const lyrics: string[] = [];

      // Gerar cada letra sequencialmente
      for (let i = 1; i <= data.quantidade; i++) {
        const response = await fetch('/api/generate-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            max_tokens: 1000,
            messages: [{
              role: 'user',
              content: `Recrie esta letra MANTENDO a prosódia (Versão ${i}/${data.quantidade}):\n\nORIGINAL:\n${data.fragmento}\n\nTEMA: ${data.tema}\nIDIOMÁ: ${data.idioma}\n\nCrie UMA NOVA letra 100% diferente. Retorne APENAS a letra:`
            }]
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Erro ao gerar letra');
        }

        const result = await response.json();
        lyrics.push(result.content[0].text.trim());
      }

      setGeneratedLyrics(lyrics);
      setCurrentTabIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('✅ Copiado!');
  };

  const handleDownload = (text: string, index: number) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `letra-option-${index + 1}.txt`;
    a.click();
  };

  const handleSave = async (index: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://web-production-fceac.up.railway.app'}/api/save-generation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_lyric: generatedLyrics[0] || '',
          theme: 'tema desconhecido',
          language: 'português',
          variants: generatedLyrics
        })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`❌ ${error.error || 'Erro ao salvar'}`);
        return;
      }

      alert('❤️ Letra salva no seu histórico!');
    } catch (err) {
      alert('❌ Erro ao conectar com o servidor');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600 rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-600 rounded-full blur-[100px] opacity-15"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-700/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-bold">⚡</span>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Prosody
              </h1>
            </div>
            <nav className="flex gap-2 sm:gap-4 items-center">
              <a href="/history" className="text-sm text-slate-300 hover:text-purple-300">
                Histórico
              </a>
              <a href="/profile" className="text-sm px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg">
                Perfil
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {generatedLyrics.length === 0 ? (
          <div className="flex items-center justify-center min-h-96">
            <LyricGenerator onGenerate={handleGenerate} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-8">
            <LyricGenerator onGenerate={handleGenerate} isLoading={isLoading} />
            <LyricCard
              lyrics={generatedLyrics}
              currentIndex={currentTabIndex}
              onTabChange={setCurrentTabIndex}
              onCopy={handleCopy}
              onDownload={handleDownload}
              onSave={handleSave}
            />
          </div>
        )}
      </main>
    </div>
  );
}
