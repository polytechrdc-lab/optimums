// Placeholder API route to simulate fetching latest updates/news.
// Replace with your CMS or data source.
import { NextResponse } from 'next/server';
import { mockNews } from '@/lib/mockData';

export async function GET() {
  // Simulate latency
  await new Promise((r) => setTimeout(r, 150));
  return NextResponse.json({ items: mockNews });
}

