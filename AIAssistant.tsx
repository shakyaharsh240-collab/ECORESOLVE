/**
 * EcoResolve — AI Assistant Modal
 * Bottom-sheet chat interface powered by Gemini API via Firebase Cloud Functions.
 * Accessible from all screens via the floating AI button.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, PaperPlaneTilt, Robot } from 'phosphor-react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../constants';
import { useUIStore } from '../stores/ui.store';
import { useAIStore, ChatMessage } from '../stores/ai.store';
import { useAuthStore } from '../stores/auth.store';
import { FrostPanel } from './ui';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.75;

const QUICK_PROMPTS = [
  'Find drives near me',
  'How do tokens work?',
  'What waste should I collect?',
  'Help me earn more ECT',
];

export function AIAssistant() {
  const insets = useSafeAreaInsets();
  const { isAIAssistantOpen, closeAIAssistant } = useUIStore();
  const { messages, isTyping, addMessage, setTyping } = useAIStore();
  const { user } = useAuthStore();

  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const translateY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (isAIAssistantOpen) {
      translateY.value = withSpring(0, { mass: 0.8, damping: 18, stiffness: 200 });
      backdropOpacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withTiming(SHEET_HEIGHT, { duration: 250 });
      backdropOpacity.value = withTiming(0, { duration: 250 });
    }
  }, [isAIAssistantOpen]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
    pointerEvents: backdropOpacity.value > 0 ? 'auto' : 'none',
  }));

  const handleSend = async (text?: string) => {
    const message = text ?? input.trim();
    if (!message) return;

    setInput('');
    addMessage({ role: 'user', content: message });
    setTyping(true);

    // Scroll to bottom
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      // In production: call Firebase Cloud Function with Gemini API
      // For now, simulate AI response
      await new Promise((r) => setTimeout(r, 1200));

      const response = getSimulatedResponse(message, user?.activeRole ?? 'volunteer');
      addMessage({ role: 'assistant', content: response });
    } catch {
      addMessage({
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting. Please try again 🙏',
      });
    } finally {
      setTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  if (!isAIAssistantOpen) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeAIAssistant} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { height: SHEET_HEIGHT, paddingBottom: insets.bottom },
          sheetStyle,
        ]}
      >
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.aiAvatar}>
              <Robot size={20} color={Colors.voidBlack} weight="fill" />
            </View>
            <View>
              <Text style={styles.headerTitle}>EcoResolve AI</Text>
              <Text style={styles.headerSubtitle}>Your eco guide 🌱</Text>
            </View>
          </View>
          <TouchableOpacity onPress={closeAIAssistant} style={styles.closeButton}>
            <X size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          {/* Messages */}
          <ScrollView
            ref={scrollRef}
            style={styles.messages}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>♻️</Text>
                <Text style={styles.emptyTitle}>Hi! I'm your EcoResolve AI</Text>
                <Text style={styles.emptySubtitle}>
                  Ask me about drives, tokens, waste management, or anything eco-related!
                </Text>
              </View>
            )}

            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {isTyping && <TypingIndicator />}
          </ScrollView>

          {/* Quick prompts */}
          {messages.length === 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickPrompts}
            >
              {QUICK_PROMPTS.map((prompt) => (
                <TouchableOpacity
                  key={prompt}
                  style={styles.quickPrompt}
                  onPress={() => handleSend(prompt)}
                >
                  <Text style={styles.quickPromptText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask anything eco..."
              placeholderTextColor={Colors.textMuted}
              multiline
              maxLength={500}
              onSubmitEditing={() => handleSend()}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
              onPress={() => handleSend()}
              disabled={!input.trim()}
            >
              <PaperPlaneTilt
                size={20}
                color={input.trim() ? Colors.voidBlack : Colors.textMuted}
                weight="fill"
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
      {!isUser && (
        <View style={styles.aiAvatarSmall}>
          <Robot size={12} color={Colors.voidBlack} weight="fill" />
        </View>
      )}
      <View
        style={[
          styles.bubbleContent,
          isUser ? styles.userBubbleContent : styles.aiBubbleContent,
        ]}
      >
        <Text style={[styles.bubbleText, isUser ? styles.userBubbleText : styles.aiBubbleText]}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}

function TypingIndicator() {
  return (
    <View style={[styles.messageBubble, styles.aiBubble]}>
      <View style={styles.aiAvatarSmall}>
        <Robot size={12} color={Colors.voidBlack} weight="fill" />
      </View>
      <View style={[styles.bubbleContent, styles.aiBubbleContent, styles.typingBubble]}>
        <Text style={styles.typingDots}>• • •</Text>
      </View>
    </View>
  );
}

// Simulated AI responses for development
function getSimulatedResponse(message: string, role: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('drive') || lower.includes('cleanup')) {
    return '🌱 Found 3 drives near you!\n• Juhu Beach Cleanup — 1.2 km away\n• Bandra Recycle Run — 0.8 km (LIVE NOW!)\n• Powai Lake Drive — 3.5 km\n\nWant me to help you join the nearest one?';
  }
  if (lower.includes('token') || lower.includes('ect')) {
    return '⚡ Tokens work like this:\n• Join a drive → tokens reserved\n• Upload proof → verified\n• Waste gets sold → tokens released 💰\n\nTip: Clean + sorted waste = higher value!';
  }
  if (lower.includes('plastic') || lower.includes('waste')) {
    return '♻️ Plastic waste tips:\n• Rinse before collection\n• Separate by type (PET, HDPE)\n• Clean plastic = 2x more value\n\nNearest drop-off: 1.5 km away. Want directions?';
  }
  if (lower.includes('earn') || lower.includes('more')) {
    return '🔥 Top ways to earn more ECT:\n• Join active drives (double tokens today!)\n• Upload verified proof photos\n• Maintain a 7-day streak\n• Refer friends to EcoResolve\n\nYour next milestone: 10 drives badge!';
  }

  return `🌍 Great question! As a ${role}, here's what I suggest:\n• Check nearby drives for quick token earning\n• Keep your waste sorted for maximum value\n• Upload proof photos for faster verification\n\nAnything specific I can help with?`;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 100,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.depthLayer,
    borderTopLeftRadius: Radius.panel,
    borderTopRightRadius: Radius.panel,
    borderTopWidth: 1,
    borderColor: Colors.frostBorder,
    zIndex: 101,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.frostBorder,
    alignSelf: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.frostBorder,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.electricCyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.frostLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.base,
    gap: Spacing.md,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.xl,
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  aiBubble: {
    justifyContent: 'flex-start',
  },
  aiAvatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.electricCyan,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bubbleContent: {
    maxWidth: '80%',
    borderRadius: Radius.widget,
    padding: Spacing.md,
  },
  userBubbleContent: {
    backgroundColor: Colors.electricCyan,
    borderBottomRightRadius: 4,
  },
  aiBubbleContent: {
    backgroundColor: Colors.frostMid,
    borderWidth: 1,
    borderColor: Colors.frostBorder,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  userBubbleText: {
    color: Colors.voidBlack,
    fontWeight: FontWeight.medium,
  },
  aiBubbleText: {
    color: Colors.textPrimary,
  },
  typingBubble: {
    paddingVertical: Spacing.sm,
  },
  typingDots: {
    color: Colors.textMuted,
    fontSize: FontSize.base,
    letterSpacing: 4,
  },
  quickPrompts: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  quickPrompt: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.electricCyan,
    backgroundColor: Colors.cyanDim,
  },
  quickPromptText: {
    fontSize: FontSize.xs,
    color: Colors.electricCyan,
    fontWeight: FontWeight.medium,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.frostBorder,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.frostLight,
    borderWidth: 1,
    borderColor: Colors.frostBorder,
    borderRadius: Radius.widget,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.electricCyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.frostMid,
  },
});
