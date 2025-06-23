// lib/fetchRssArticles.ts
import { XMLParser } from "fast-xml-parser";

export interface BasicArticle {
  title: string;
  link: string;
  date: string;
}

export async function fetchRssArticles(url: string): Promise<BasicArticle[]> {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  const text = await res.text();

  const parser = new XMLParser({ ignoreAttributes: false });
  const feed = parser.parse(text);

  const items = feed.rss?.channel?.item || feed.feed?.entry || [];

  if (!Array.isArray(items)) return [];

  return items.map((item: any, index: number) => {
    const title = item.title?.["#text"] || item.title || "Sans titre";
    const link = item.link?.["@_href"] || item.link || "#";
    const date = item.pubDate || item.updated || item.published || new Date().toISOString();

    return {
      title,
      link,
      date,
    };
  });
}
