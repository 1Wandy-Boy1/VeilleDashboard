// src/app/favoris/page.tsx
'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { Article } from '@/types/article';
import ArticleCard from '@/components/ArticleCard';

export default function FavorisPage() {
  const [favorites, setFavorites] = useState<Article[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const stored = localStorage.getItem('favoris');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setFavorites(parsed);
      } catch (e) {
        console.error('Erreur de lecture des favoris', e);
      }
    }
  };

  const clearFavorites = () => {
    localStorage.removeItem('favoris');
    setFavorites([]);
  };

  const exportFavorites = () => {
    const blob = new Blob([JSON.stringify(favorites, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favoris.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFavorites = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!Array.isArray(parsed)) throw new Error('Fichier invalide');

        const current = localStorage.getItem('favoris');
        const currentList: Article[] = current ? JSON.parse(current) : [];

        const merged = [...currentList];
        for (const newItem of parsed) {
          if (!merged.find((a) => a.url === newItem.url)) {
            merged.push(newItem);
          }
        }

        localStorage.setItem('favoris', JSON.stringify(merged));
        setFavorites(merged);
        alert('Favoris importés avec succès.');
      } catch (error) {
        alert("Erreur lors de l'importation : contenu non valide.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Articles favoris</h1>

      <div className="flex gap-4 mb-4">
        <button
          onClick={clearFavorites}
          className="bg-red-600 text-white px-4 py-2 rounded text-sm"
        >
          Vider les favoris
        </button>
        <button
          onClick={exportFavorites}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm"
        >
          Exporter en JSON
        </button>
        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded text-sm">
          Importer un fichier
          <input type="file" accept=".json" className="hidden" onChange={importFavorites} />
        </label>
      </div>

      {favorites.length === 0 ? (
        <p className="text-gray-600 text-sm">Aucun article favoris pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((article) => (
            <ArticleCard key={article.id + article.url} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
