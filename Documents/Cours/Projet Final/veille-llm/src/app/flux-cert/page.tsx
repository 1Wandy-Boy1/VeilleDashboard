import ArticleCard from "@/components/ArticleCard";
import { Article } from "@/types/article";
import { fetchRssArticles } from "@/lib/fetchRssArticles";

export default async function FluxCertPage() {
  const url = "https://www.cert.ssi.gouv.fr/feed/";
  const articles: Article[] = await fetchRssArticles(url);

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Articles du flux CERT-FR</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </main>
  );
}
