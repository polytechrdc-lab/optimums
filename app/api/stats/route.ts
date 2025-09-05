// Placeholder API route for key stats/counters.
import { NextResponse } from 'next/server';
import { mockStats } from '@/lib/mockData';

export async function GET() {
  await new Promise((r) => setTimeout(r, 120));
  return NextResponse.json({ items: mockStats });
}

