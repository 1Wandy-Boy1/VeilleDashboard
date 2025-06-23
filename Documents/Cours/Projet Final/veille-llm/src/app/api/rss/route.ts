// src/app/api/rss/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchRssArticles } from '@/lib/fetchRssArticles';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing RSS URL' }, { status: 400 });
  }

  try {
    const articles = await fetchRssArticles(url);
    return NextResponse.json({ articles });
  } catch (e) {
    return NextResponse.json({ error: 'Erreur lors du chargement RSS' }, { status: 500 });
  }
}
