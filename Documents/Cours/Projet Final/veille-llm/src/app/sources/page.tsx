// src/app/sources/page.tsx
'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import FluxCard from "@/components/FluxCard";
import { FluxSource } from "@/types/flux";
import Link from "next/link";

export default function SourcesPage() {
  const [feeds, setFeeds] = useState<FluxSource[]>([]);
  const [newFeed, setNewFeed] = useState({
    name: '',
    url: '',
    theme: '',
    type: 'rss',
    enabled: true
  });

  useEffect(() => {
    const stored = localStorage.getItem('feeds');
    if (stored) {
      setFeeds(JSON.parse(stored));
    }
  }, []);

  const handleAddFeed = () => {
    if (!newFeed.name || !newFeed.url || !newFeed.theme) return;

    const newEntry: FluxSource = {
      id: newFeed.name.toLowerCase().replace(/\s+/g, '-'),
      name: newFeed.name,
      url: newFeed.url,
      theme: newFeed.theme,
      type: newFeed.type as FluxSource['type'],
      enabled: true,
      addedAt: new Date().toISOString(),
    };

    const updated = [...feeds, newEntry];
    setFeeds(updated);
    localStorage.setItem('feeds', JSON.stringify(updated));
    setNewFeed({ name: '', url: '', theme: '', type: 'rss', enabled: true });
  };

  const toggleEnabled = (id: string) => {
    const updated = feeds.map(feed =>
      feed.id === id ? { ...feed, enabled: !feed.enabled } : feed
    );
    setFeeds(updated);
    localStorage.setItem('feeds', JSON.stringify(updated));
  };

  const deleteFeed = (id: string) => {
    const updated = feeds.filter(feed => feed.id !== id);
    setFeeds(updated);
    localStorage.setItem('feeds', JSON.stringify(updated));
  };

  const exportFeeds = () => {
    const blob = new Blob([JSON.stringify(feeds, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sources.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFeeds = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!Array.isArray(parsed)) throw new Error('Fichier invalide');

        const merged = [...feeds];
        for (const newItem of parsed) {
          if (!merged.find((f) => f.url === newItem.url)) {
            merged.push(newItem);
          }
        }

        localStorage.setItem('feeds', JSON.stringify(merged));
        setFeeds(merged);
        alert('Sources importées avec succès.');
      } catch (error) {
        alert("Erreur lors de l'importation : contenu non valide.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-gray-50 to-white py-12 px-6 sm:px-10">
      <nav className="flex justify-center gap-6 mb-10 text-sm font-medium text-gray-600">
        <Link href="/veille" className="hover:text-blue-600 transition">Veille</Link>
        <Link href="/sources" className="text-blue-600 font-semibold">Sources</Link>
        <Link href="/favoris" className="hover:text-blue-600 transition">Favoris</Link>
      </nav>

      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center text-gray-800">Sources de veille configurées</h1>

        <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl space-y-6">
          <h2 className="font-semibold text-xl text-gray-700">Ajouter une nouvelle source</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Nom de la source"
              value={newFeed.name}
              onChange={(e) => setNewFeed({ ...newFeed, name: e.target.value })}
            />
            <input
              className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 transition"
              placeholder="URL RSS/API"
              value={newFeed.url}
              onChange={(e) => setNewFeed({ ...newFeed, url: e.target.value })}
            />
            <input
              className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Thème (LLM, Vulnérabilités, etc.)"
              value={newFeed.theme}
              onChange={(e) => setNewFeed({ ...newFeed, theme: e.target.value })}
            />
            <select
              className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 transition"
              value={newFeed.type}
              onChange={(e) => setNewFeed({ ...newFeed, type: e.target.value })}
            >
              <option value="rss">RSS</option>
              <option value="api">API</option>
              <option value="github">GitHub</option>
              <option value="scientifique">Scientifique</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={handleAddFeed}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm transition"
            >
              Ajouter la source
            </button>
            <button
              onClick={exportFeeds}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm transition"
            >
              Exporter les sources
            </button>
            <label className="cursor-pointer bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-xl text-sm transition">
              Importer un fichier
              <input type="file" accept=".json" className="hidden" onChange={importFeeds} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feeds.map((flux) => (
            <div key={flux.id} className="flex flex-col bg-white rounded-2xl shadow-md p-4 gap-3 hover:shadow-lg transition">
              <FluxCard flux={flux} />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => toggleEnabled(flux.id)}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition ${flux.enabled ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {flux.enabled ? 'Désactiver' : 'Activer'}
                </button>
                <button
                  onClick={() => deleteFeed(flux.id)}
                  className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
