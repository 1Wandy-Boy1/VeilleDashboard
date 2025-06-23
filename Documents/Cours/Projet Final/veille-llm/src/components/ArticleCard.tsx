// components/ArticleCard.tsx
import { Article } from "@/types/article";
import { ExternalLink, Star, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Category, PatchInfo } from "@/types/category";

interface Props {
  article: Article;
}

export default function ArticleCard({ article }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [patchInfo, setPatchInfo] = useState<PatchInfo | null>(null);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoris') || '[]');
    setIsFavorite(favorites.some((fav: Article) => fav.id === article.id));

    // Charger les catégories
    const storedCategories = JSON.parse(localStorage.getItem('categories') || '[]');
    setCategories(storedCategories.filter((cat: Category) => 
      article.categories?.includes(cat.id)
    ));

    // Charger les informations de patch si l'article en a
    if (article.patchInfo) {
      setPatchInfo(article.patchInfo);
    }
  }, [article]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoris') || '[]');
    const isCurrentlyFavorite = favorites.some((fav: Article) => fav.id === article.id);
    
    if (isCurrentlyFavorite) {
      const newFavorites = favorites.filter((fav: Article) => fav.id !== article.id);
      localStorage.setItem('favoris', JSON.stringify(newFavorites));
    } else {
      favorites.push(article);
      localStorage.setItem('favoris', JSON.stringify(favorites));
    }
    
    setIsFavorite(!isCurrentlyFavorite);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="text-gray-600 font-medium">{article.source}</span>
          <span className="text-gray-500">{new Date(article.date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}</span>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
          {article.title}
        </h3>

        {article.summary && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
            {article.summary}
          </p>
        )}

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((category) => (
              <span
                key={category.id}
                className="inline-flex items-center px-2 py-1 rounded text-[11px] font-medium"
                style={{ 
                  backgroundColor: `${category.color}20`,
                  color: category.color
                }}
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {patchInfo && (
          <div className="mb-3 p-2 rounded border border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(patchInfo.severity)}`}>
                {patchInfo.severity}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                {patchInfo.applied ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span className="text-green-600">
                      Appliqué le {new Date(patchInfo.appliedDate!).toLocaleDateString('fr-FR')}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 text-orange-600" />
                    <span className="text-orange-600">À appliquer</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-1">{patchInfo.description}</p>
            {patchInfo.affectedTools.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {patchInfo.affectedTools.map((tool, index) => (
                  <span 
                    key={index}
                    className="bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="inline-flex items-center px-2 py-1 rounded text-[11px] font-medium bg-blue-50 text-blue-700">
            {article.theme}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 p-0.5 transition-all duration-200 ${
                isFavorite 
                  ? 'text-yellow-400 hover:text-yellow-500' 
                  : 'text-gray-400 hover:text-yellow-400'
              } transform hover:scale-110 active:scale-95`}
              onClick={toggleFavorite}
              title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Lire <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
