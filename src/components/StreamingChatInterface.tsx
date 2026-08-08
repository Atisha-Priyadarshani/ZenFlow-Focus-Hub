'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, ArrowDown, Bot, User, Sparkles, AlertCircle, RefreshCw, Zap } from 'lucide-react';
import { TaskToolResultCard, ToolState } from './TaskToolResultCard';
import { executeTaskPriorityAnalysis, TaskPriorityResult } from '@/lib/tools';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  isError?: boolean;
  toolCall?: {
    state: ToolState;
    input?: { taskTitle: string; estimatedMinutes: number; difficultyLevel: 'low' | 'medium' | 'high' | 'critical' };
    result?: TaskPriorityResult;
    error?: string;
  };
}

export function StreamingChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const [sabotageMode, setSabotageMode] = useState<'none' | 'rate-limit' | 'mid-stream-break'>('none');

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const userHasScrolledUpRef = useRef(false);

  const sampleOnboardingPrompts = [
    {
      title: '⚡ Generate Pomodoro Plan (Deep Code Audit)',
      prompt: 'Generate Pomodoro focus plan for task: Deep Code Audit, estimated 120 minutes, difficulty high.',
      isToolCall: true,
    },
    {
      title: '🧘 Mindful Productivity Advice',
      prompt: 'How can I maintain focus during 4-hour study sessions without burning out?',
      isToolCall: false,
    },
    {
      title: '🚨 Test FE-08 Error & Retry Boundary',
      prompt: 'Test mid-stream error recovery.',
      isSabotageTest: true,
    },
  ];

  const scrollToBottom = (smooth = true) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 60;

    userHasScrolledUpRef.current = !isAtBottom;
    setShowScrollBottomBtn(!isAtBottom);
  };

  useEffect(() => {
    if (!userHasScrolledUpRef.current) {
      scrollToBottom(false);
    }
  }, [messages, isThinking]);

  const handleStopStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    setIsThinking(false);

    setMessages((prev) =>
      prev.map((msg) => (msg.isStreaming ? { ...msg, isStreaming: false } : msg))
    );
  };

  const executeChatFlow = async (textToSend: string, isRetry = false) => {
    if (!textToSend.trim() || isGenerating) return;

    userHasScrolledUpRef.current = false;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
    };

    const assistantMsgId = `assistant-${Date.now()}`;
    const isToolTrigger = textToSend.toLowerCase().includes('generate pomodoro') || textToSend.toLowerCase().includes('task');

    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      isStreaming: true,
      toolCall: isToolTrigger
        ? {
            state: 'input-streaming',
            input: { taskTitle: 'Deep Code Audit', estimatedMinutes: 120, difficultyLevel: 'high' },
          }
        : undefined,
    };

    if (isRetry) {
      setMessages((prev) => [...prev.filter((m) => !m.isError), userMsg, initialAssistantMsg]);
    } else {
      setMessages((prev) => [...prev, userMsg, initialAssistantMsg]);
    }

    setIsGenerating(true);
    setIsThinking(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (sabotageMode === 'rate-limit') {
        await new Promise((r) => setTimeout(r, 600));
        throw new Error('429 Too Many Requests: API rate limit exceeded. Please retry in a moment.');
      }

      if (isToolTrigger) {
        await new Promise((r) => setTimeout(r, 800));
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  toolCall: {
                    state: 'input-available',
                    input: { taskTitle: 'Deep Code Audit', estimatedMinutes: 120, difficultyLevel: 'high' },
                  },
                }
              : m
          )
        );

        await new Promise((r) => setTimeout(r, 1000));
        const toolResult = executeTaskPriorityAnalysis({
          taskTitle: 'Deep Code Audit',
          estimatedMinutes: 120,
          difficultyLevel: 'high',
          userEnergyLevel: 'high',
        });

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  toolCall: {
                    state: 'output-available',
                    input: { taskTitle: 'Deep Code Audit', estimatedMinutes: 120, difficultyLevel: 'high' },
                    result: toolResult,
                  },
                }
              : m
          )
        );
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: textToSend }],
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error('Streaming server error (500 Internal Server Error)');
      }

      setIsThinking(false);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let chunkCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunkCount++;
        if (sabotageMode === 'mid-stream-break' && chunkCount > 5) {
          controller.abort();
          throw new Error('Stream interrupted: Network connection killed mid-stream.');
        }

        const token = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? { ...msg, content: msg.content + token }
              : msg
          )
        );
      }
    } catch (err: any) {
      if (err.name === 'AbortError' && sabotageMode === 'none') {
        console.log('Stream stopped by user.');
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content: msg.content + `\n\n*(Error: ${err.message || 'Connection Interrupted'})*`,
                  isError: true,
                  toolCall: msg.toolCall
                    ? { ...msg.toolCall, state: 'output-error', error: err.message }
                    : undefined,
                }
              : msg
          )
        );
      }
    } finally {
      setIsGenerating(false);
      setIsThinking(false);
      abortControllerRef.current = null;
      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg))
      );
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    const text = input.trim();
    setInput('');
    executeChatFlow(text);
  };

  return (
    <div className="flex flex-col h-[80dvh] max-h-[700px] w-full max-w-4xl mx-auto rounded-2xl bg-slate-900/95 border border-indigo-500/30 shadow-2xl overflow-hidden font-sans">
      <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-indigo-400 flex items-center gap-2">
              ZenFlow Generative UI & Focus Assistant <Sparkles className="w-4 h-4 text-purple-400" />
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              FE-07 Zod Tools & FE-08 Error Recovery (Checkpoint 1)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-indigo-300 flex items-center gap-1">
            <Zap className="w-3 h-3 text-purple-400" /> Sabotage Mode:
          </span>
          <select
            value={sabotageMode}
            onChange={(e) => setSabotageMode(e.target.value as any)}
            className="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-400"
          >
            <option value="none">Off (Normal)</option>
            <option value="rate-limit">Test 429 Error</option>
            <option value="mid-stream-break">Test Mid-Stream Break</option>
          </select>

          {isGenerating && (
            <button
              onClick={handleStopStream}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold hover:bg-red-500/30 transition-all"
            >
              <Square className="w-3.5 h-3.5 fill-current" /> Stop
            </button>
          )}
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-4 relative scrollbar-thin scrollbar-thumb-indigo-900"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col justify-center items-center text-center space-y-6 max-w-md mx-auto py-12 animate-fade-in">
            <div className="p-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-10 h-10 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-indigo-300">
                Welcome to ZenFlow Generative Focus Coach
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Ask a focus question or click a prompt below to trigger FE-07 Generative UI Zod tools and FE-08 error boundaries.
              </p>
            </div>

            <div className="w-full space-y-2 text-left">
              {sampleOnboardingPrompts.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (card.isSabotageTest) setSabotageMode('mid-stream-break');
                    executeChatFlow(card.prompt);
                  }}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800/80 transition-all group cursor-pointer"
                >
                  <div className="text-xs font-bold text-indigo-300 group-hover:text-white flex items-center justify-between">
                    <span>{card.title}</span>
                    <span className="text-[10px] text-indigo-400 font-mono">Click to Run &rarr;</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-medium truncate">
                    {card.prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-slate-950 border border-indigo-800 flex items-center justify-center text-indigo-400 shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed space-y-3 ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white font-semibold rounded-br-none shadow-md'
                  : msg.isError
                  ? 'bg-red-950/70 border border-red-500/40 text-red-200 rounded-bl-none shadow-md'
                  : 'bg-slate-950/80 text-slate-200 border border-slate-800 rounded-bl-none shadow-inner'
              }`}
            >
              {msg.toolCall && (
                <TaskToolResultCard
                  state={msg.toolCall.state}
                  input={msg.toolCall.input}
                  result={msg.toolCall.result}
                  error={msg.toolCall.error}
                  onRetry={() => executeChatFlow(messages[messages.length - 2]?.content || 'Generate Pomodoro plan', true)}
                />
              )}

              {isThinking && msg.isStreaming && !msg.content && !msg.toolCall ? (
                <div className="space-y-2 animate-pulse">
                  <div className="flex items-center gap-2 text-indigo-300 font-medium">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                    <span>Drafting focus blocks & mindfulness recommendations...</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                </div>
              ) : (
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content}
                  {msg.isStreaming && (
                    <span className="inline-block w-2 h-4 ml-1 bg-indigo-400 animate-pulse align-middle" />
                  )}
                </div>
              )}

              {msg.isError && (
                <div className="pt-2 border-t border-red-500/30 flex items-center justify-between">
                  <span className="text-[11px] text-red-300 flex items-center gap-1 font-bold">
                    <AlertCircle className="w-3.5 h-3.5" /> Message failed to complete
                  </span>
                  <button
                    onClick={() => executeChatFlow(messages[messages.length - 2]?.content || msg.content, true)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retry Message
                  </button>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {showScrollBottomBtn && (
          <button
            onClick={() => {
              userHasScrolledUpRef.current = false;
              scrollToBottom(true);
            }}
            className="sticky bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white font-extrabold text-xs rounded-full shadow-lg border border-indigo-400 hover:bg-indigo-500 transition-all z-20 animate-bounce"
          >
            <ArrowDown className="w-3.5 h-3.5" /> Jump to Latest
          </button>
        )}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isGenerating
              ? 'Streaming response in progress...'
              : 'Ask ZenFlow AI or type "Generate Pomodoro plan"...'
          }
          disabled={isGenerating}
          className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />

        {isGenerating ? (
          <button
            type="button"
            onClick={handleStopStream}
            aria-label="Stop generation"
            className="p-3 bg-red-500/20 border border-red-500/40 text-red-400 rounded-xl hover:bg-red-500/30 transition-all"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send message"
            className="p-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
}
