import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vizzy Chat — AI Creative Assistant',
  description:
    'Your AI-powered creative companion. Generate stunning images, stories, marketing content, and more through natural conversation.',
  keywords: [
    'AI',
    'creative',
    'image generation',
    'storytelling',
    'marketing',
    'design',
    'chat',
  ],
  openGraph: {
    title: 'Vizzy Chat — AI Creative Assistant',
    description: 'Jarvis for creativity. ChatGPT + Midjourney + Canva combined.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
