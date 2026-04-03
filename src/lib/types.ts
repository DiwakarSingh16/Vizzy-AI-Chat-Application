export type MessageRole = 'user' | 'assistant' | 'system';

export type IntentType =
  | 'image_generation'
  | 'image_editing'
  | 'storytelling'
  | 'marketing_content'
  | 'moodboard_creation'
  | 'video_prompt'
  | 'general';

export type OutputType =
  | 'text'
  | 'image_grid'
  | 'story_cards'
  | 'poster_mockup'
  | 'social_preview'
  | 'video_storyboard'
  | 'moodboard';

export type ImageStyle =
  | 'renaissance'
  | 'anime'
  | 'cinematic'
  | 'dreamlike'
  | 'minimal'
  | 'surreal'
  | 'watercolor'
  | 'cyberpunk';

export type AppMode = 'home' | 'business';

export interface ImageOutput {
  id: string;
  url: string;
  prompt: string;
  style?: ImageStyle;
  selected?: boolean;
}

export interface StoryScene {
  id: string;
  title: string;
  content: string;
  visualPrompt: string;
  imageUrl?: string;
}

export interface VideoScene {
  id: string;
  scene: number;
  description: string;
  cameraAngle: string;
  duration: string;
  mood: string;
}

export interface MessageOutput {
  type: OutputType;
  images?: ImageOutput[];
  stories?: StoryScene[];
  videoScenes?: VideoScene[];
  text?: string;
  posterData?: {
    title: string;
    subtitle: string;
    imageUrl: string;
    brandColors: string[];
  };
  socialData?: {
    platform: string;
    content: string;
    imageUrl: string;
    hashtags: string[];
  };
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  intent?: IntentType;
  output?: MessageOutput;
  isLoading?: boolean;
  reasoning?: {
    detectedIntent: IntentType;
    styleApplied: string;
    reasoning: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  mode: AppMode;
}

export interface UserPreferences {
  preferredStyles: ImageStyle[];
  preferredTone: string;
  preferredColors: string[];
  recentPrompts: string[];
  favoriteOutputs: string[];
}

export interface CreativeBrainData {
  detectedIntent: IntentType;
  styleApplied: string;
  reasoning: string;
  confidence: number;
}
