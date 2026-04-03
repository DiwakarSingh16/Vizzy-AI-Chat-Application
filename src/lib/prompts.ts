export const samplePrompts = {
  home: [
    {
      text: "Paint something that feels like my last year",
      icon: "🎨",
      category: "emotional",
    },
    {
      text: "Create a dreamlike vision board for success",
      icon: "✨",
      category: "vision",
    },
    {
      text: "Write a bedtime story about a brave little star",
      icon: "📖",
      category: "story",
    },
    {
      text: "Visualize my future in a surreal landscape",
      icon: "🌌",
      category: "art",
    },
    {
      text: "Turn this photo into a renaissance painting",
      icon: "🖼️",
      category: "transform",
    },
    {
      text: "Create something that feels like hope",
      icon: "🌅",
      category: "emotional",
    },
  ],
  business: [
    {
      text: "Design a luxury poster for a coffee brand",
      icon: "☕",
      category: "marketing",
    },
    {
      text: "Create social media visuals for a tech startup",
      icon: "🚀",
      category: "social",
    },
    {
      text: "Generate a branding kit for a wellness company",
      icon: "🌿",
      category: "branding",
    },
    {
      text: "Design an ad creative for a fashion launch",
      icon: "👗",
      category: "advertising",
    },
    {
      text: "Create product mockups for a minimalist watch",
      icon: "⌚",
      category: "product",
    },
    {
      text: "Generate a video storyboard for a product launch",
      icon: "🎬",
      category: "video",
    },
  ],
};

export const refinementOptions = [
  { label: "Refine", icon: "✏️", prompt: "Refine this result with more detail" },
  { label: "More cinematic", icon: "🎬", prompt: "Make this more cinematic and dramatic" },
  { label: "More minimal", icon: "◻️", prompt: "Make this more minimal and clean" },
  { label: "More emotional", icon: "💫", prompt: "Make this more emotional and evocative" },
  { label: "Different style", icon: "🎨", prompt: "Try a completely different artistic style" },
  { label: "Remix", icon: "🔄", prompt: "Remix this with unexpected creative choices" },
];

export const imageStyles: { label: string; value: string; preview: string }[] = [
  { label: "Renaissance", value: "renaissance", preview: "🏛️" },
  { label: "Anime", value: "anime", preview: "🎌" },
  { label: "Cinematic", value: "cinematic", preview: "🎬" },
  { label: "Dreamlike", value: "dreamlike", preview: "💭" },
  { label: "Minimal", value: "minimal", preview: "◻️" },
  { label: "Surreal", value: "surreal", preview: "🌀" },
  { label: "Watercolor", value: "watercolor", preview: "🎨" },
  { label: "Cyberpunk", value: "cyberpunk", preview: "🤖" },
];

export const loadingMessages = [
  "Painting your imagination…",
  "Designing something magical…",
  "Weaving pixels into dreams…",
  "Channeling creative energy…",
  "Sculpting digital masterpieces…",
  "Mixing colors of inspiration…",
  "Crafting visual poetry…",
  "Rendering your vision…",
  "Brewing creative alchemy…",
  "Composing visual symphonies…",
];

export const getRandomLoadingMessage = (): string => {
  return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
};
