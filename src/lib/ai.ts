import { IntentType, MessageOutput, ImageStyle } from './types';

const API_BASE = '/api';

export async function generateText(prompt: string, context?: string): Promise<string> {
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, context }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to generate text');
  }

  const data = await res.json();
  return data.text;
}

export async function generateImages(prompt: string, count: number = 4): Promise<string[]> {
  const res = await fetch(`${API_BASE}/image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, count }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to generate images');
  }

  const data = await res.json();
  return data.images;
}

export async function transformImage(imageBase64: string, style: ImageStyle): Promise<string> {
  const res = await fetch(`${API_BASE}/transform`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageBase64, style }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to transform image');
  }

  const data = await res.json();
  return data.image;
}

export async function processCreativeRequest(
  prompt: string,
  intent: IntentType,
  style: string,
  mode: string
): Promise<MessageOutput> {
  switch (intent) {
    case 'image_generation':
      return await handleImageGeneration(prompt, style);
    case 'image_editing':
      return await handleImageEditing(prompt, style);
    case 'storytelling':
      return await handleStorytelling(prompt, style);
    case 'marketing_content':
      return await handleMarketingContent(prompt, style);
    case 'moodboard_creation':
      return await handleMoodboard(prompt, style);
    case 'video_prompt':
      return await handleVideoPrompt(prompt, style);
    default:
      return await handleGeneral(prompt);
  }
}

async function handleImageGeneration(prompt: string, style: string): Promise<MessageOutput> {
  try {
    const images = await generateImages(`${prompt}, ${style} style, high quality, detailed`);
    return {
      type: 'image_grid',
      images: images.map((url, i) => ({
        id: `img-${Date.now()}-${i}`,
        url,
        prompt,
        selected: false,
      })),
      text: `Here are your generated images with a ${style} aesthetic. Select your favorite or refine the results.`,
    };
  } catch {
    // Fallback with placeholder images
    return generatePlaceholderImages(prompt, style);
  }
}

async function handleImageEditing(prompt: string, style: string): Promise<MessageOutput> {
  return {
    type: 'image_grid',
    images: generateStyledPlaceholders(prompt, style),
    text: `I've applied the ${style} transformation to your image. Here are the variations.`,
  };
}

async function handleStorytelling(prompt: string, style: string): Promise<MessageOutput> {
  try {
    const storyText = await generateText(
      `Create a ${style} short story based on: "${prompt}". 
       Format as JSON with this structure:
       {"scenes": [{"title": "Scene Title", "content": "Scene content paragraph", "visualPrompt": "A visual description for this scene"}]}
       Create exactly 4 scenes. Make it emotionally compelling and vivid.`
    );

    try {
      const jsonMatch = storyText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          type: 'story_cards',
          stories: parsed.scenes.map((s: { title: string; content: string; visualPrompt: string }, i: number) => ({
            id: `scene-${Date.now()}-${i}`,
            title: s.title,
            content: s.content,
            visualPrompt: s.visualPrompt,
          })),
          text: `Here's your ${style} story, broken into scenes.`,
        };
      }
    } catch { /* Fall through to text response */ }

    return {
      type: 'story_cards',
      stories: generatePlaceholderStory(prompt, style),
      text: storyText,
    };
  } catch {
    return {
      type: 'story_cards',
      stories: generatePlaceholderStory(prompt, style),
      text: `Here's your ${style} story, crafted scene by scene.`,
    };
  }
}

async function handleMarketingContent(prompt: string, style: string): Promise<MessageOutput> {
  try {
    const marketingText = await generateText(
      `Create marketing content for: "${prompt}" with a ${style} feel.
       Include a catchy headline, subtitle, and 3 key selling points. Make it premium and compelling.`
    );

    return {
      type: 'poster_mockup',
      text: marketingText,
      posterData: {
        title: extractTitle(prompt),
        subtitle: `A ${style} creative vision`,
        imageUrl: `/api/placeholder/poster`,
        brandColors: getStyleColors(style),
      },
    };
  } catch {
    return {
      type: 'poster_mockup',
      text: `Here's your ${style} marketing concept for "${prompt}".`,
      posterData: {
        title: extractTitle(prompt),
        subtitle: `Crafted with ${style} aesthetics`,
        imageUrl: `/api/placeholder/poster`,
        brandColors: getStyleColors(style),
      },
    };
  }
}

async function handleMoodboard(prompt: string, style: string): Promise<MessageOutput> {
  return generatePlaceholderImages(prompt, style);
}

async function handleVideoPrompt(prompt: string, style: string): Promise<MessageOutput> {
  try {
    const videoText = await generateText(
      `Create a video storyboard for: "${prompt}" with ${style} cinematography.
       Format as JSON:
       {"scenes": [{"scene": 1, "description": "Visual description", "cameraAngle": "Camera angle", "duration": "Duration", "mood": "Mood"}]}
       Create exactly 4 scenes. Make them vivid and cinematic.`
    );

    try {
      const jsonMatch = videoText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          type: 'video_storyboard',
          videoScenes: parsed.scenes.map((s: { scene: number; description: string; cameraAngle: string; duration: string; mood: string }, i: number) => ({
            id: `video-${Date.now()}-${i}`,
            scene: s.scene,
            description: s.description,
            cameraAngle: s.cameraAngle,
            duration: s.duration,
            mood: s.mood,
          })),
          text: `Here's your ${style} video storyboard.`,
        };
      }
    } catch { /* fall through */ }

    return {
      type: 'video_storyboard',
      videoScenes: generatePlaceholderVideoScenes(prompt, style),
      text: videoText,
    };
  } catch {
    return {
      type: 'video_storyboard',
      videoScenes: generatePlaceholderVideoScenes(prompt, style),
      text: `Here's your ${style} video storyboard concept.`,
    };
  }
}

async function handleGeneral(prompt: string): Promise<MessageOutput> {
  try {
    const text = await generateText(prompt);
    return { type: 'text', text };
  } catch {
    return {
      type: 'text',
      text: `I'd love to help with "${prompt}". Let me know if you'd like me to generate images, create a story, design marketing content, or build a moodboard!`,
    };
  }
}

// Helper functions
function generatePlaceholderImages(prompt: string, style: string): MessageOutput {
  const colors = [
    ['8b5cf6', '06b6d4'], ['f472b6', '8b5cf6'],
    ['06b6d4', 'f472b6'], ['f59e0b', '8b5cf6'],
  ];
  return {
    type: 'image_grid',
    images: colors.map((c, i) => ({
      id: `img-${Date.now()}-${i}`,
      url: `https://picsum.photos/seed/${encodeURIComponent(prompt + style + i)}/512/512`,
      prompt,
      selected: false,
    })),
    text: `Here are your ${style} creative variations for "${prompt}". Select your favorite to refine further.`,
  };
}

function generateStyledPlaceholders(prompt: string, style: string) {
  const colors = [
    ['6366f1', 'e0e7ff'], ['8b5cf6', 'ede9fe'],
    ['a855f7', 'fae8ff'], ['c084fc', 'f3e8ff'],
  ];
  return colors.map((c, i) => ({
    id: `styled-${Date.now()}-${i}`,
    url: `https://picsum.photos/seed/${encodeURIComponent(prompt + style + i)}/512/512`,
    prompt: `${prompt} - ${style} variation ${i + 1}`,
    selected: false,
  }));
}

function generatePlaceholderStory(prompt: string, style: string) {
  return [
    {
      id: `scene-${Date.now()}-0`,
      title: 'The Beginning',
      content: `In a world shaped by ${style} dreams, our story begins. ${prompt} — a journey that starts with a single spark of wonder, igniting the imagination of all who witness it.`,
      visualPrompt: `A ${style} opening scene depicting the beginning of a journey, ethereal lighting`,
    },
    {
      id: `scene-${Date.now()}-1`,
      title: 'The Discovery',
      content: `Deep within the heart of this ${style} realm, something extraordinary was uncovered. The colors shifted, the air hummed with possibility, and everything changed in an instant.`,
      visualPrompt: `A ${style} discovery moment, magical glow, sense of wonder`,
    },
    {
      id: `scene-${Date.now()}-2`,
      title: 'The Challenge',
      content: `But beauty never comes easy. The path forward demanded courage, creativity, and an unwavering belief in the impossible. Every shadow held a lesson waiting to be learned.`,
      visualPrompt: `A ${style} dramatic challenge scene, contrast of light and dark`,
    },
    {
      id: `scene-${Date.now()}-3`,
      title: 'The Triumph',
      content: `And so, from imagination to reality, the vision was realized. What was once a dream became a masterpiece — proof that creativity knows no bounds.`,
      visualPrompt: `A ${style} triumphant finale, golden light, sense of achievement`,
    },
  ];
}

function generatePlaceholderVideoScenes(prompt: string, style: string) {
  return [
    {
      id: `video-${Date.now()}-0`,
      scene: 1,
      description: `Opening shot: Slow reveal of the ${style} world. ${prompt} unfolds as the camera sweeps across the landscape.`,
      cameraAngle: 'Wide aerial establishing shot, slow zoom in',
      duration: '4 seconds',
      mood: 'Mysterious, intriguing',
    },
    {
      id: `video-${Date.now()}-1`,
      scene: 2,
      description: `Close-up detail shots revealing textures and elements of the ${style} aesthetic. Each frame tells a micro-story.`,
      cameraAngle: 'Macro close-ups with shallow depth of field',
      duration: '3 seconds',
      mood: 'Intimate, detailed',
    },
    {
      id: `video-${Date.now()}-2`,
      scene: 3,
      description: `Dynamic movement sequence. The camera flows through the scene as ${style} elements transform and evolve.`,
      cameraAngle: 'Tracking shot with smooth dolly movement',
      duration: '5 seconds',
      mood: 'Dynamic, energetic',
    },
    {
      id: `video-${Date.now()}-3`,
      scene: 4,
      description: `Final reveal: The complete ${style} vision crystallizes into its final form. A moment of visual poetry.`,
      cameraAngle: 'Push-in to hero shot, slight upward tilt',
      duration: '4 seconds',
      mood: 'Triumphant, satisfying',
    },
  ];
}

function extractTitle(prompt: string): string {
  const words = prompt.split(' ').slice(0, 5);
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getStyleColors(style: string): string[] {
  const colorMap: Record<string, string[]> = {
    luxury: ['#1a1a2e', '#c9a84c', '#f5f0e8'],
    minimal: ['#ffffff', '#1a1a1a', '#e5e5e5'],
    cinematic: ['#0f0f1a', '#2563eb', '#f97316'],
    emotional: ['#1e1b4b', '#8b5cf6', '#f472b6'],
    surreal: ['#0f172a', '#06b6d4', '#a855f7'],
    futuristic: ['#0a0a0f', '#00ff88', '#0088ff'],
    natural: ['#14532d', '#22c55e', '#fef9c3'],
    vintage: ['#451a03', '#d97706', '#fef3c7'],
    creative: ['#1e1b4b', '#8b5cf6', '#06b6d4'],
  };
  return colorMap[style] || colorMap.creative;
}
