import { IntentType, OutputType, AppMode } from './types';

interface IntentResult {
  intent: IntentType;
  outputType: OutputType;
  confidence: number;
  reasoning: string;
  suggestedStyle: string;
}

const intentKeywords: Record<IntentType, string[]> = {
  image_generation: [
    'create', 'generate', 'paint', 'draw', 'design', 'make', 'visualize',
    'imagine', 'render', 'illustrate', 'picture', 'image', 'art', 'artwork',
    'poster', 'wallpaper', 'scene', 'landscape', 'portrait', 'photo',
  ],
  image_editing: [
    'transform', 'turn into', 'convert', 'style', 'apply', 'edit',
    'modify', 'change', 'filter', 'enhance', 'retouch', 'adjust',
    'renaissance', 'anime', 'cinematic', 'dreamlike', 'watercolor',
  ],
  storytelling: [
    'story', 'narrative', 'tale', 'write', 'tell', 'chapter', 'scene',
    'character', 'plot', 'bedtime', 'fairy tale', 'adventure', 'fiction',
    'once upon', 'beginning', 'ending',
  ],
  marketing_content: [
    'marketing', 'brand', 'branding', 'logo', 'campaign', 'ad', 'advertisement',
    'poster', 'flyer', 'banner', 'promotion', 'product', 'launch',
    'billboard', 'commercial',
  ],
  moodboard_creation: [
    'moodboard', 'mood board', 'vision board', 'collage', 'aesthetic',
    'collection', 'palette', 'inspiration', 'vibe', 'theme',
  ],
  video_prompt: [
    'video', 'animation', 'motion', 'storyboard', 'clip', 'film',
    'movie', 'sequence', 'cinematic', 'footage', 'runway', 'pika', 'sora',
  ],
  general: [],
};

const styleKeywords: Record<string, string[]> = {
  'cinematic': ['cinematic', 'film', 'movie', 'dramatic', 'epic', 'hollywood'],
  'minimal': ['minimal', 'clean', 'simple', 'elegant', 'modern', 'sleek'],
  'emotional': ['emotional', 'feeling', 'heart', 'soul', 'deep', 'moving', 'feels like'],
  'luxury': ['luxury', 'premium', 'high-end', 'elegant', 'sophisticated', 'rich'],
  'surreal': ['surreal', 'dream', 'fantasy', 'otherworldly', 'abstract', 'psychedelic'],
  'vintage': ['vintage', 'retro', 'classic', 'old', 'nostalgic', 'antique'],
  'futuristic': ['futuristic', 'sci-fi', 'tech', 'neon', 'cyberpunk', 'digital'],
  'natural': ['nature', 'organic', 'earth', 'botanical', 'forest', 'ocean'],
};

export function classifyIntent(prompt: string, mode: AppMode = 'home'): IntentResult {
  const lowerPrompt = prompt.toLowerCase();

  // Score each intent
  const scores: Record<IntentType, number> = {
    image_generation: 0,
    image_editing: 0,
    storytelling: 0,
    marketing_content: 0,
    moodboard_creation: 0,
    video_prompt: 0,
    general: 0.1,
  };

  for (const [intent, keywords] of Object.entries(intentKeywords)) {
    for (const keyword of keywords) {
      if (lowerPrompt.includes(keyword)) {
        scores[intent as IntentType] += 1;
      }
    }
  }

  // Mode bias
  if (mode === 'business') {
    scores.marketing_content += 0.5;
    scores.image_generation += 0.3;
  } else {
    scores.storytelling += 0.3;
    scores.image_generation += 0.3;
  }

  // Check for image upload indicators
  if (lowerPrompt.includes('this image') || lowerPrompt.includes('this photo') ||
      lowerPrompt.includes('turn this') || lowerPrompt.includes('upload')) {
    scores.image_editing += 2;
  }

  // Find the highest scoring intent
  let maxScore = 0;
  let detectedIntent: IntentType = 'general';
  for (const [intent, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedIntent = intent as IntentType;
    }
  }

  // Detect style
  let detectedStyle = 'creative';
  let maxStyleScore = 0;
  for (const [style, keywords] of Object.entries(styleKeywords)) {
    let styleScore = 0;
    for (const keyword of keywords) {
      if (lowerPrompt.includes(keyword)) styleScore++;
    }
    if (styleScore > maxStyleScore) {
      maxStyleScore = styleScore;
      detectedStyle = style;
    }
  }

  // Map intent to output type
  const outputTypeMap: Record<IntentType, OutputType> = {
    image_generation: 'image_grid',
    image_editing: 'image_grid',
    storytelling: 'story_cards',
    marketing_content: 'poster_mockup',
    moodboard_creation: 'moodboard',
    video_prompt: 'video_storyboard',
    general: 'text',
  };

  const confidence = Math.min(maxScore / 3, 1);

  const reasoningMap: Record<IntentType, string> = {
    image_generation: `Detected visual creation intent. Applying ${detectedStyle} style to generate imagery.`,
    image_editing: `Detected image transformation request. Will apply style transfer with ${detectedStyle} aesthetics.`,
    storytelling: `Detected narrative intent. Crafting a ${detectedStyle} story with scene-by-scene breakdown.`,
    marketing_content: `Detected marketing/branding request. Creating ${detectedStyle} promotional content.`,
    moodboard_creation: `Detected mood/vision board request. Curating ${detectedStyle} visual collection.`,
    video_prompt: `Detected video creation intent. Generating ${detectedStyle} storyboard with scene descriptions.`,
    general: `Processing general creative request with ${detectedStyle} approach.`,
  };

  return {
    intent: detectedIntent,
    outputType: outputTypeMap[detectedIntent],
    confidence,
    reasoning: reasoningMap[detectedIntent],
    suggestedStyle: detectedStyle,
  };
}
