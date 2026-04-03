'use client';

import { MessageOutput } from '@/lib/types';
import ImageGrid from './ImageGrid';
import StoryCards from './StoryCards';
import VideoStoryboard from './VideoStoryboard';
import PosterMockup from './PosterMockup';

interface Props {
  output: MessageOutput;
}

export default function OutputRenderer({ output }: Props) {
  switch (output.type) {
    case 'image_grid':
    case 'moodboard':
      return <ImageGrid images={output.images || []} />;

    case 'story_cards':
      return <StoryCards scenes={output.stories || []} />;

    case 'video_storyboard':
      return <VideoStoryboard scenes={output.videoScenes || []} />;

    case 'poster_mockup':
      return <PosterMockup data={output.posterData} text={output.text} />;

    case 'social_preview':
      return <PosterMockup data={output.posterData} text={output.text} />;

    case 'text':
    default:
      return null; // Text is rendered in the message bubble itself
  }
}
