import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const reply = `AI: You said "${message}"`;
  return NextResponse.json({ reply });
}
