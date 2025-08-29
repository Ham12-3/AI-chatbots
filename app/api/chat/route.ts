import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages = [] } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        reply: "OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable." 
      });
    }

    // Convert our message format to OpenAI format
    const openaiMessages = [
      {
        role: "system" as const,
        content: "You are a helpful AI assistant. Be concise and helpful in your responses."
      },
      ...messages.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }))
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const reply = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
    
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json({ 
          reply: "Please check your OpenAI API key configuration." 
        });
      }
      if (error.message.includes('quota') || error.message.includes('billing')) {
        return NextResponse.json({ 
          reply: "OpenAI API quota exceeded. Please check your billing settings." 
        });
      }
    }

    return NextResponse.json({ 
      reply: "I'm experiencing some technical difficulties. Please try again in a moment." 
    });
  }
}
