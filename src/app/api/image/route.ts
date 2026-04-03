import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_to_prevent_crash_when_empty',
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, count = 4 } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      // Return placeholder images when no API key
      return NextResponse.json({
        images: generatePlaceholderUrls(prompt, count),
      });
    }

    // Generate images using DALL-E
    const imagePromises = [];
    const actualCount = Math.min(count, 4);

    for (let i = 0; i < actualCount; i++) {
      imagePromises.push(
        openai.images.generate({
          model: 'dall-e-3',
          prompt: `${prompt}. High quality, detailed, artistic. Variation ${i + 1}.`,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
        })
      );
    }

    const results = await Promise.allSettled(imagePromises);
    const images: string[] = [];

    results.forEach((result, i) => {
      if (result.status === 'fulfilled' && result.value.data[0]?.url) {
        images.push(result.value.data[0].url);
      } else {
        images.push(generateSinglePlaceholder(prompt, i));
      }
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Image API error:', error);
    const { prompt = '', count = 4 } = await req.json().catch(() => ({ prompt: '', count: 4 }));
    return NextResponse.json({
      images: generatePlaceholderUrls(prompt, count),
    });
  }
}

function generatePlaceholderUrls(prompt: string, count: number): string[] {
  const palettes = [
    { bg: '8b5cf6', fg: 'e0e7ff' },
    { bg: '06b6d4', fg: 'e0f7ff' },
    { bg: 'f472b6', fg: 'fce7f3' },
    { bg: 'f59e0b', fg: 'fef3c7' },
    { bg: '6366f1', fg: 'e0e7ff' },
    { bg: '14b8a6', fg: 'ccfbf1' },
  ];

  return Array.from({ length: Math.min(count, 4) }, (_, i) => {
    const palette = palettes[i % palettes.length];
    const label = encodeURIComponent(`Vizzy Art ${i + 1}`);
    return `https://picsum.photos/seed/${encodeURIComponent(prompt + i)}/512/512`;
  });
}

function generateSinglePlaceholder(prompt: string, index: number): string {
  const colors = ['8b5cf6', '06b6d4', 'f472b6', 'f59e0b'];
  const label = encodeURIComponent(`Art ${index + 1}`);
  return `https://picsum.photos/seed/${encodeURIComponent(prompt + index)}/512/512`;
}
