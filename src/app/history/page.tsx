'use client';

import { HistoryList } from '@/components/HistoryList';

export default function HistoryPage() {
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
              <span className="text-2xl sm:text-3xl font-bold">📚</span>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Histórico de Letras
              </h1>
            </div>
            <a href="/app" className="text-sm px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg">
              ← Voltar
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HistoryList />
      </main>
    </div>
  );
}
