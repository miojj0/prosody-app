'use client';

import { useState } from 'react';

interface Artist {
  slug: string;
  name: string;
  genre: string;
  song_count: number;
}

interface Song {
  idx: number;
  title: string;
}

interface VaultBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLyric: (fragmento: string, artist: string, song: string) => void;
}

export function VaultBrowser({ isOpen, onClose, onSelectLyric }: VaultBrowserProps) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingArtists, setIsLoadingArtists] = useState(false);
  const [isLoadingSongs, setIsLoadingSongs] = useState(false);

  const searchArtists = async (q: string) => {
    if (!q.trim()) {
      setArtists([]);
      return;
    }

    setIsLoadingArtists(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-fceac.up.railway.app';
      const response = await fetch(
        `${apiUrl}/api/vault-search?q=${encodeURIComponent(q)}`
      );
      if (response.ok) {
        const data = await response.json();
        setArtists(data.artists || []);
      }
    } finally {
      setIsLoadingArtists(false);
    }
  };

  const selectArtist = async (artistSlug: string) => {
    setSelectedArtist(artistSlug);
    setSongs([]);
    setIsLoadingSongs(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-fceac.up.railway.app';
      const response = await fetch(
        `${apiUrl}/api/vault-songs?artist=${artistSlug}`
      );
      if (response.ok) {
        const data = await response.json();
        setSongs(data.songs || []);
      }
    } finally {
      setIsLoadingSongs(false);
    }
  };

  const selectSong = async (artistSlug: string, songIdx: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-fceac.up.railway.app';
      const response = await fetch(
        `${apiUrl}/api/vault-lyrics?artist=${artistSlug}&idx=${songIdx}`
      );
      if (response.ok) {
        const data = await response.json();
        const artist = artists.find(a => a.slug === artistSlug);
        const song = songs.find(s => s.idx === songIdx);

        if (data.lyrics && artist && song) {
          onSelectLyric(data.lyrics, artist.name, song.title);
          onClose();
        }
      }
    } catch (err) {
      console.error('Error fetching lyrics:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl max-w-2xl w-full max-h-96 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">🎵 Inspire-se em um Artista</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>
          <input
            type="text"
            placeholder="Buscar artista..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchArtists(e.target.value);
            }}
            className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 border border-slate-700/40 focus:border-purple-500 outline-none"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedArtist ? (
            // Songs View
            <div className="p-6">
              <button
                onClick={() => {
                  setSelectedArtist(null);
                  setSongs([]);
                }}
                className="text-purple-400 hover:text-purple-300 mb-4 text-sm"
              >
                ← Voltar aos artistas
              </button>
              <div className="space-y-2">
                {isLoadingSongs ? (
                  <p className="text-slate-400">Carregando músicas...</p>
                ) : songs.length > 0 ? (
                  songs.map((song) => (
                    <button
                      key={song.idx}
                      onClick={() => selectSong(selectedArtist, song.idx)}
                      className="w-full text-left p-3 bg-slate-800/40 hover:bg-slate-800/60 rounded-lg border border-slate-700/30 hover:border-purple-500/50 transition"
                    >
                      <div className="font-semibold text-white">{song.title}</div>
                      <div className="text-xs text-slate-400">Música #{song.idx}</div>
                    </button>
                  ))
                ) : (
                  <p className="text-slate-400">Nenhuma música encontrada</p>
                )}
              </div>
            </div>
          ) : (
            // Artists View
            <div className="p-6 space-y-2">
              {isLoadingArtists ? (
                <p className="text-slate-400">Buscando artistas...</p>
              ) : artists.length > 0 ? (
                artists.map((artist) => (
                  <button
                    key={artist.slug}
                    onClick={() => selectArtist(artist.slug)}
                    className="w-full text-left p-4 bg-slate-800/40 hover:bg-slate-800/60 rounded-lg border border-slate-700/30 hover:border-purple-500/50 transition"
                  >
                    <div className="font-semibold text-white">{artist.name}</div>
                    <div className="text-sm text-slate-400">
                      {artist.genre} • {artist.song_count} músicas
                    </div>
                  </button>
                ))
              ) : searchQuery ? (
                <p className="text-slate-400">Nenhum artista encontrado</p>
              ) : (
                <p className="text-slate-400">Digite um nome de artista para começar</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
