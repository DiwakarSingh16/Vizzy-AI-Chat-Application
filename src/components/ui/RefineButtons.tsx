'use client';

import { motion } from 'framer-motion';
import { refinementOptions } from '@/lib/prompts';
import { useChatStore } from '@/store/chatStore';
import { useUIStore } from '@/store/uiStore';
import { classifyIntent } from '@/lib/intent';
import { processCreativeRequest } from '@/lib/ai';
import { Message } from '@/lib/types';
import { getRandomLoadingMessage } from '@/lib/prompts';

interface Props {
  messageId: string;
}

export default function RefineButtons({ messageId }: Props) {
  const { addMessage, updateMessage, setIsGenerating, isGenerating, activeConversationId } =
    useChatStore();
  const { mode, setCreativeBrainData, setPreviewPanelOpen } = useUIStore();

  const handleRefine = async (option: (typeof refinementOptions)[0]) => {
    if (isGenerating || !activeConversationId) return;

    const intentResult = classifyIntent(option.prompt, mode);

    setCreativeBrainData({
      detectedIntent: intentResult.intent,
      styleApplied: intentResult.suggestedStyle,
      reasoning: `Refinement: ${option.label}. ${intentResult.reasoning}`,
      confidence: intentResult.confidence,
    });

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: `${option.icon} ${option.label}`,
      timestamp: new Date(),
      intent: intentResult.intent,
    };
    addMessage(activeConversationId, userMessage);

    const aiMessageId = `msg-${Date.now()}-ai`;
    addMessage(activeConversationId, {
      id: aiMessageId,
      role: 'assistant',
      content: getRandomLoadingMessage(),
      timestamp: new Date(),
      isLoading: true,
    });
    setIsGenerating(true);

    try {
      const output = await processCreativeRequest(
        option.prompt,
        intentResult.intent,
        intentResult.suggestedStyle,
        mode
      );

      updateMessage(activeConversationId, aiMessageId, {
        content: output.text || '',
        output,
        isLoading: false,
        reasoning: {
          detectedIntent: intentResult.intent,
          styleApplied: intentResult.suggestedStyle,
          reasoning: `Refinement applied: ${option.label}`,
        },
      });

      if (output.type !== 'text') {
        setPreviewPanelOpen(true);
      }
    } catch {
      updateMessage(activeConversationId, aiMessageId, {
        content: 'Refinement failed. Please try again.',
        isLoading: false,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {refinementOptions.map((option, i) => (
        <motion.button
          key={option.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleRefine(option)}
          disabled={isGenerating}
          className="btn-secondary text-xs flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>{option.icon}</span>
          <span>{option.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
