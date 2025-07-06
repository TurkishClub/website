import { NextResponse } from 'next/server';
import { getDormsFromSanity } from '@/data/dorms';

export async function GET() {
  try {
    const dorms = await getDormsFromSanity();
    return NextResponse.json(dorms);
  } catch (error) {
    console.error('API Error fetching dorms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dorms' },
      { status: 500 }
    );
  }
}
