// src/app/veille/page.tsx
'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Article } from "@/types/article";
import { FluxSource } from "@/types/flux";
import ArticleCard from "@/components/ArticleCard";
import FiltreForm from "@/components/FiltreForm";
import Link from "next/link";

export default function VeillePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const searchParams = useSearchParams();

  const selectedTheme = searchParams.get("theme") || "";
  const selectedSource = searchParams.get("source") || "";

  useEffect(() => {
    const raw = localStorage.getItem("feeds");
    if (!raw) return;

    try {
      const parsed: FluxSource[] = JSON.parse(raw);
      const active = parsed.filter((f) => f.enabled);
      console.log("🎯 Feeds actifs:", active);

      Promise.all(
        active.map(async (feed) => {
          try {
            const res = await fetch(`/api/rss?url=${encodeURIComponent(feed.url)}`);
            const { articles: fetched } = await res.json();
            console.log(`📡 Articles depuis ${feed.url}`, fetched);
            return fetched.map((article: any, i: number) => ({
              id: `${feed.id}-${i}`,
              title: article.title,
              url: article.link,
              date: article.date,
              source: feed.name,
              theme: feed.theme,
            }));
          } catch (e) {
            console.error(`Erreur sur ${feed.name}`, e);
            return [];
          }
        })
      ).then((results) => {
        const flat = results.flat();
        setArticles(flat);
        setThemes(Array.from(new Set(flat.map((a) => a.theme))).sort());
        setSources(Array.from(new Set(flat.map((a) => a.source))).sort());
      });
    } catch (e) {
      console.error("Erreur parsing feeds localStorage", e);
    }
  }, []);

  const filtered = articles.filter((article) => {
    const themeMatch = selectedTheme ? article.theme === selectedTheme : true;
    const sourceMatch = selectedSource ? article.source === selectedSource : true;
    return themeMatch && sourceMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Veille Cybersécurité</h1>
          <p className="text-base text-gray-500">Articles collectés automatiquement depuis vos sources préférées.</p>
        </div>
        <Link 
          href="/sources"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Gérer les sources
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
        <FiltreForm themes={themes} sources={sources} articles={articles} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((article) => (
          <div key={article.id}>
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </div>
  );
}
