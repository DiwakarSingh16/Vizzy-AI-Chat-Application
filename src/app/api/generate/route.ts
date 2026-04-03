import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_to_prevent_crash_when_empty',
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, context } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      // Fallback response when no API key
      return NextResponse.json({
        text: generateFallbackResponse(prompt),
      });
    }

    const systemMessage = context
      ? `You are Vizzy, a creative AI assistant. You help users create stunning visual content, stories, and marketing materials. ${context}`
      : `You are Vizzy, a creative AI assistant. You specialize in helping users bring their creative visions to life. You are warm, inspiring, and detail-oriented. When creating content, be vivid and emotionally compelling.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.8,
    });

    const text = completion.choices[0]?.message?.content || 'I couldn\'t generate a response.';

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', text: generateFallbackResponse('') },
      { status: 500 }
    );
  }
}

function generateFallbackResponse(prompt: string): string {
  const promptLower = prompt.toLowerCase();

  if (promptLower.includes('story') || promptLower.includes('tale') || promptLower.includes('narrative')) {
    return JSON.stringify({
      scenes: [
        {
          title: "The Awakening",
          content: "In the softest hours of twilight, when the world holds its breath between day and night, something extraordinary stirred. It began as a whisper — barely audible, yet impossible to ignore. The kind of whisper that resonates not in your ears, but deep within your chest.",
          visualPrompt: "A magical twilight scene with soft golden and purple hues, ethereal light streaming through clouds"
        },
        {
          title: "The Discovery",
          content: "What emerged from the shadows was not what anyone expected. It was a fragment of a dream made real — shimmering, delicate, and impossibly beautiful. Those who witnessed it found that words failed them, for some things exist beyond the reach of language.",
          visualPrompt: "A crystalline, glowing discovery emerging from shadows, prismatic light, wonder-filled atmosphere"
        },
        {
          title: "The Journey",
          content: "And so began a journey not measured in miles, but in moments of transformation. Each step forward revealed new colors never before seen, new sounds never before heard. The path itself seemed alive, shifting and breathing with every heartbeat.",
          visualPrompt: "An enchanted pathway transforming with each step, vibrant colors shifting, alive with energy"
        },
        {
          title: "The Revelation",
          content: "At journey's end — though perhaps 'beginning' is the better word — the truth became clear as morning light. The magic wasn't in the destination. It was in the courage to imagine, to create, to believe that something beautiful could emerge from nothing but a thought and a wish.",
          visualPrompt: "A breathtaking sunrise revelation, golden light washing over a transformed landscape, triumphant mood"
        }
      ]
    });
  }

  if (promptLower.includes('video') || promptLower.includes('storyboard')) {
    return JSON.stringify({
      scenes: [
        { scene: 1, description: "Opening wide shot establishing the world and atmosphere. Camera slowly descends through clouds.", cameraAngle: "Aerial descending shot", duration: "4 seconds", mood: "Mysterious, grand" },
        { scene: 2, description: "Intimate close-up details revealing textures, materials, and subtle movements.", cameraAngle: "Macro with rack focus", duration: "3 seconds", mood: "Intimate, detailed" },
        { scene: 3, description: "Dynamic tracking shot following the main subject through the environment.", cameraAngle: "Steadicam tracking, eye level", duration: "5 seconds", mood: "Energetic, flowing" },
        { scene: 4, description: "Final hero shot — the complete vision revealed in all its glory.", cameraAngle: "Slow push-in, slight low angle", duration: "4 seconds", mood: "Triumphant, inspiring" }
      ]
    });
  }

  return `✨ I'd love to help bring your creative vision to life!\n\nHere's what I can do for you:\n\n🎨 **Image Generation** — Describe any scene, and I'll create stunning visuals\n🖼️ **Style Transfer** — Transform images into Renaissance, Anime, Cinematic styles\n📖 **Storytelling** — Craft emotional narratives with scene-by-scene breakdowns\n🎬 **Video Storyboards** — Generate cinematic storyboards for your video ideas\n📊 **Marketing Content** — Design posters, ads, and brand materials\n\nTry something like:\n- *"Paint something that feels like hope"*\n- *"Create a luxury poster for a coffee brand"*\n- *"Write a bedtime story about a brave little star"*`;
}
