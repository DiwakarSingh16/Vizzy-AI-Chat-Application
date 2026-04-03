'use client';

import { motion } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import { useChatStore } from '@/store/chatStore';
import { samplePrompts } from '@/lib/prompts';
import { classifyIntent } from '@/lib/intent';
import { processCreativeRequest } from '@/lib/ai';
import { Message } from '@/lib/types';
import { getRandomLoadingMessage } from '@/lib/prompts';
import { useMemoryStore } from '@/store/memoryStore';

export default function PromptSuggestions() {
  const { mode, setCreativeBrainData, setPreviewPanelOpen } = useUIStore();
  const { addMessage, updateMessage, setIsGenerating, isGenerating, createConversation, activeConversationId } =
    useChatStore();
  const { addRecentPrompt, getPersonalizationContext } = useMemoryStore();

  const prompts = mode === 'home' ? samplePrompts.home : samplePrompts.business;

  const handlePromptClick = async (promptText: string) => {
    if (isGenerating) return;

    let convId = activeConversationId;
    if (!convId) {
      convId = createConversation(mode);
    }

    const intentResult = classifyIntent(promptText, mode);

    setCreativeBrainData({
      detectedIntent: intentResult.intent,
      styleApplied: intentResult.suggestedStyle,
      reasoning: intentResult.reasoning,
      confidence: intentResult.confidence,
    });

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: promptText,
      timestamp: new Date(),
      intent: intentResult.intent,
    };
    addMessage(convId, userMessage);
    addRecentPrompt(promptText);

    const aiMessageId = `msg-${Date.now()}-ai`;
    const loadingMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: getRandomLoadingMessage(),
      timestamp: new Date(),
      isLoading: true,
    };
    addMessage(convId, loadingMessage);
    setIsGenerating(true);

    try {
      const output = await processCreativeRequest(
        promptText,
        intentResult.intent,
        intentResult.suggestedStyle,
        mode
      );

      updateMessage(convId, aiMessageId, {
        content: output.text || '',
        output,
        isLoading: false,
        reasoning: {
          detectedIntent: intentResult.intent,
          styleApplied: intentResult.suggestedStyle,
          reasoning: intentResult.reasoning,
        },
      });

      if (output.type !== 'text') {
        setPreviewPanelOpen(true);
      }
    } catch {
      updateMessage(convId, aiMessageId, {
        content: 'Something went wrong. Please try again.',
        isLoading: false,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto" id="prompt-suggestions">
      {prompts.map((prompt, i) => (
        <motion.button
          key={prompt.text}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 * i }}
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handlePromptClick(prompt.text)}
          className="p-4 rounded-2xl glass-bright text-left group transition-all duration-300 hover:glow-sm cursor-pointer"
        >
          <span className="text-xl mb-2 block">{prompt.icon}</span>
          <p className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors leading-snug">
            {prompt.text}
          </p>
        </motion.button>
      ))}
    </div>
  );
}
