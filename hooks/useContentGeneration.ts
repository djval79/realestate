
import { useState } from 'react';
import { Property, Message, Language } from '../types';
import { ContentChatService, generatePropertyImage, generateHashtags } from '../services/geminiService';
import { useToast } from './useToast';

export const useContentGeneration = (referralCode: string, language: Language) => {
  const { addToast } = useToast();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Chat state
  const [chatService, setChatService] = useState<ContentChatService | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Image state
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  // Hashtag state
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
    setMessages([]);
    setGeneratedImageUrl(null);
    setChatService(null);
    setHashtags([]);
    setIsGeneratingHashtags(false);
  };

  const fetchHashtags = async (content: string, property: Property) => {
    if (!content.trim()) return;
    setIsGeneratingHashtags(true);
    setHashtags([]);
    try {
        const generated = await generateHashtags(content, property, language);
        setHashtags(generated);
    } catch (err) {
        console.error("Failed to fetch hashtags.", err);
        // Silently fail as it's a non-critical feature.
    } finally {
        setIsGeneratingHashtags(false);
    }
  };
  
  const handleGenerateImage = async (property: Property) => {
    setIsGeneratingImage(true);
    try {
      const imageUrl = await generatePropertyImage(property);
      setGeneratedImageUrl(imageUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      addToast(errorMessage, 'error');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const startGeneration = async (property: Property) => {
    if (!referralCode) {
      addToast("Please set your referral code first.", "error");
      return;
    }
    setSelectedProperty(property);
    setIsModalOpen(true);
    
    // Reset all content states
    setGeneratedImageUrl(null);
    setHashtags([]);
    setIsGeneratingHashtags(false);
    
    const service = new ContentChatService(property, referralCode, language);
    setChatService(service);

    setIsGenerating(true);
    setMessages([{ author: 'ai', text: '' }]); // Placeholder for streaming

    let finalAiText = '';
    try {
      const stream = await service.startConversationStream();
      for await (const chunk of stream) {
        finalAiText += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length > 0) newMessages[newMessages.length - 1].text = finalAiText;
          return newMessages;
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      addToast(errorMessage, 'error');
      setMessages([]);
    } finally {
      setIsGenerating(false);
      if (finalAiText) fetchHashtags(finalAiText, property);
    }
    
    handleGenerateImage(property);
  };

  const sendMessage = async (messageText: string) => {
    if (!chatService || isGenerating || !selectedProperty) return;

    setIsGenerating(true);
    setHashtags([]);
    setIsGeneratingHashtags(false);
    
    const userMessage: Message = { author: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage, { author: 'ai', text: '' }]);

    let finalAiText = '';
    try {
      const stream = await chatService.sendMessageStream(messageText);
      for await (const chunk of stream) {
        finalAiText += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length > 0) newMessages[newMessages.length - 1].text = finalAiText;
          return newMessages;
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      addToast(errorMessage, 'error');
      setMessages(prev => prev.slice(0, -1)); 
    } finally {
      setIsGenerating(false);
      if(finalAiText) fetchHashtags(finalAiText, selectedProperty);
    }
  };
  
  const startOver = async () => {
    if (!chatService || isGenerating || !selectedProperty) return;

    setIsGenerating(true);
    setHashtags([]);
    setIsGeneratingHashtags(false);
      
    chatService.resetChat();
    setMessages([{ author: 'ai', text: '' }]);

    let finalAiText = '';
    try {
      const stream = await chatService.startConversationStream();
      for await (const chunk of stream) {
        finalAiText += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length > 0) newMessages[newMessages.length - 1].text = finalAiText;
          return newMessages;
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      addToast(errorMessage, 'error');
      setMessages([]);
    } finally {
      setIsGenerating(false);
      if(finalAiText) fetchHashtags(finalAiText, selectedProperty);
    }
  };
  
  const regenerateImage = () => {
      if (selectedProperty) {
          handleGenerateImage(selectedProperty);
      }
  }

  return {
    modalState: {
      isOpen: isModalOpen,
      property: selectedProperty,
      messages,
      isLoading: isGenerating,
      imageUrl: generatedImageUrl,
      isImageLoading: isGeneratingImage,
      hashtags,
      isGeneratingHashtags,
    },
    modalHandlers: {
      startGeneration,
      sendMessage,
      startOver,
      regenerateImage,
      closeModal,
    }
  };
};
