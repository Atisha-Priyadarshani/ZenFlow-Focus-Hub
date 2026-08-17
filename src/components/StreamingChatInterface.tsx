'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { Send, Square, ArrowDown, Bot, User, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { TaskToolResultCard, ToolState } from './TaskToolResultCard';

export function StreamingChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, append, error, reload } = useChat({
    api: '/api/chat',
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const userHasScrolledUpRef = useRef(false);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = React.useState(false);

  const sampleOnboardingPrompts = [
    {
      title: '🍅 Generate Pomodoro Focus Plan',
      prompt: 'Create a focus plan for completing my React assignment (Estimated 120 mins, high difficulty).',
    },
    {
      title: '📈 Habit Consistency Review',
      prompt: 'Give me 3 actionable recommendations to improve my daily meditation habit.',
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
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-[80dvh] max-h-[700px] w-full max-w-4xl mx-auto rounded-2xl bg-[var(--bg-app)] border border-[var(--border-app)] shadow-2xl overflow-hidden font-sans transition-colors duration-300">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border-app)] bg-[var(--bg-app)]/95 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Sparkles className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">ZenFlow AI Assistant</h2>
            <p className="text-xs text-[var(--text-secondary)] font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Live SSE Streaming (Vercel AI SDK)
            </p>
          </div>
        </div>
      </div>

      {/* Chat History Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 scroll-smooth space-y-6 relative"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[var(--text-secondary)] opacity-80 animate-in fade-in duration-700">
            <Bot className="w-16 h-16 mb-4 text-indigo-500/40" />
            <p className="text-sm font-medium">Hello! I am your productivity AI assistant.</p>
            <p className="text-xs mt-1">Try triggering the focus plan tool below.</p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
              {sampleOnboardingPrompts.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => append({ role: 'user', content: sample.prompt })}
                  className="p-3 text-left border border-[var(--border-app)] rounded-xl hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all text-xs group"
                >
                  <p className="font-bold text-[var(--text-primary)] mb-1 group-hover:text-indigo-500 transition-colors">
                    {sample.title}
                  </p>
                  <p className="text-[var(--text-secondary)] truncate line-clamp-2 white-space-normal">
                    {sample.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}
            >
              <div
                className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1 border ${
                    message.role === 'user'
                      ? 'bg-[var(--text-primary)] text-[var(--bg-app)] border-[var(--border-app)]'
                      : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30'
                  }`}
                >
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble & Tool Calls */}
                <div className="flex flex-col gap-2 w-full">
                  
                  {/* Tool Call Lifecycle Rendering (FE-07) */}
                  {message.toolInvocations?.map((toolInvocation, index) => {
                    const toolCallId = toolInvocation.toolCallId;
                    
                    let mappedState: ToolState = 'input-streaming';
                    if (toolInvocation.state === 'partial-call') mappedState = 'input-streaming';
                    if (toolInvocation.state === 'call') mappedState = 'input-available';
                    if (toolInvocation.state === 'result') mappedState = 'output-available';

                    return (
                      <div key={toolCallId} className="w-full">
                        <TaskToolResultCard
                          state={mappedState}
                          input={toolInvocation.args as any}
                          result={'result' in toolInvocation ? toolInvocation.result as any : undefined}
                          error={'error' in toolInvocation ? String(toolInvocation.error) : undefined}
                        />
                      </div>
                    );
                  })}

                  {/* Text Content */}
                  {message.content && (
                    <div
                      className={`relative px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm break-words whitespace-pre-wrap ${
                        message.role === 'user'
                          ? 'bg-[var(--text-primary)] text-[var(--bg-app)] rounded-tr-sm font-medium'
                          : 'bg-[var(--bg-app)] border border-[var(--border-app)] text-[var(--text-primary)] rounded-tl-sm'
                      }`}
                    >
                      {message.content}
                    </div>
                  )}

                </div>
              </div>
            </div>
          ))
        )}

        {/* Global Error State with Retry */}
        {error && (
          <div className="flex w-full justify-start animate-in fade-in duration-300 mt-4">
            <div className="flex gap-3 max-w-[85%] md:max-w-[75%]">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1 border bg-rose-500/10 text-rose-500 border-rose-500/30">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-3 w-full">
                <div className="relative px-5 py-4 rounded-2xl text-[14px] leading-relaxed shadow-sm break-words whitespace-pre-wrap bg-rose-500/5 border border-rose-500/20 text-rose-400 font-medium">
                  <p className="mb-2">⚠️ Connection Interrupted or API Error</p>
                  <p className="text-xs text-rose-400/80 mb-4">{error.message}</p>
                  <button
                    onClick={() => reload()}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-lg text-xs font-bold transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scroll to bottom button */}
        {showScrollBottomBtn && (
          <button
            onClick={() => scrollToBottom(true)}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 dark:bg-white/90 text-white dark:text-black p-2 rounded-full shadow-xl hover:scale-110 transition-transform z-10 border border-white/10"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[var(--border-app)] bg-[var(--bg-app)]">
        <form
          onSubmit={handleSubmit}
          className="flex relative items-end gap-2 bg-[var(--bg-app)] border-2 border-[var(--border-app)] rounded-2xl p-1.5 focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all shadow-sm"
        >
          <textarea
            value={input || ''}
            onChange={handleInputChange}
            placeholder="Ask ZenFlow AI to analyze your focus sessions..."
            className="w-full max-h-32 min-h-[44px] bg-transparent border-none focus:outline-none resize-none py-2.5 px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 scrollbar-hide"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
          />
          <div className="flex shrink-0 p-1">
            {isLoading ? (
              <button
                type="button"
                onClick={() => stop()}
                className="w-9 h-9 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 flex items-center justify-center transition-all border border-rose-500/20"
                aria-label="Stop generating"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!(input || '').trim()}
                className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 disabled:opacity-40 disabled:hover:bg-indigo-500 transition-all shadow-md disabled:shadow-none"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            )}
          </div>
        </form>
        <p className="text-[10px] text-center text-[var(--text-secondary)]/60 mt-3 font-medium">
          ZenFlow AI uses Generative UI Tool Calling. Stay focused!
        </p>
      </div>
    </div>
  );
}
