// components/FiltreForm.tsx
'use client';

import { Article } from "@/types/article";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface Props {
  themes: string[];
  sources: string[];
  articles: Article[];
}

export default function FiltreForm({ themes, sources, articles }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedTheme = searchParams.get("theme") || "";
  const selectedSource = searchParams.get("source") || "";
  const searchQuery = searchParams.get("q") || "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const filtered = articles.filter((article) => {
    const matchesTheme = !selectedTheme || article.theme === selectedTheme;
    const matchesSource = !selectedSource || article.source === selectedSource;
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTheme && matchesSource && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="w-60">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <Input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => updateFilter("q", e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
        </div>

        <div className="w-40">
          <select
            id="theme"
            value={selectedTheme}
            onChange={(e) => updateFilter("theme", e.target.value)}
            className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les thèmes</option>
            {themes.map(theme => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
        </div>

        <div className="w-40">
          <select
            id="source"
            value={selectedSource}
            onChange={(e) => updateFilter("source", e.target.value)}
            className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les sources</option>
            {sources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 ml-auto">
          <Filter className="w-3.5 h-3.5" />
          <span>{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
}
