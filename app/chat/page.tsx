
"use client";

import { Fragment, useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";

export default function Chat() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text?.trim()) return;

    sendMessage({
      text: message.text,
    });

    setInput("");
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto flex h-[calc(100vh-4rem)] w-full max-w-5xl flex-col px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
    
        {/* Conversation */}
        <div className="relative min-h-0 flex-1">
          <Conversation className="h-full">
            <ConversationContent className="mx-auto w-full max-w-3xl gap-6 py-8">
              
              {/* Empty State */}
              {messages.length === 0 && (
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border bg-muted/50 shadow-sm">
                    <span className="text-2xl">✦</span>
                  </div>

                  <h2 className="text-2xl font-semibold tracking-tight">
                    How can I help you?
                  </h2>

                  <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    Ask a question about your documents and I&apos;ll find the
                    relevant information for you.
                  </p>

                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {[
                      "Summarize my documents",
                      "Find important information",
                      "Explain a concept",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setInput(suggestion)}
                        className="rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.parts.map((part, i) => {
                    if (part.type !== "text") return null;

                    return (
                      <Fragment key={`${msg.id}-${i}`}>
                        <Message from={msg.role}>
                          <MessageContent
                            className={
                              msg.role === "user"
                                ? "rounded-2xl rounded-br-md px-4 py-3 shadow-sm"
                                : "px-1 py-2"
                            }
                          >
                            <MessageResponse>
                              {part.text}
                            </MessageResponse>
                          </MessageContent>
                        </Message>
                      </Fragment>
                    );
                  })}
                </div>
              ))}

              {/* Loading */}
              {isLoading && (
                <div className="flex items-center gap-2 px-2 py-3">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:300ms]" />
                  </div>

                  <span className="text-xs text-muted-foreground">
                    Assistant is thinking...
                  </span>
                </div>
              )}
            </ConversationContent>

            <ConversationScrollButton />
          </Conversation>
        </div>

        {/* Input */}
        <div className="mx-auto w-full max-w-3xl pb-5 pt-3">
          <PromptInput
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl border bg-background shadow-sm transition-shadow focus-within:shadow-md"
          >
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your documents..."
                className="min-h-[56px] resize-none border-0 px-4 py-3 text-sm outline-none focus:ring-0"
              />
            </PromptInputBody>

            <PromptInputFooter className="border-t bg-muted/20 px-3 py-2">
              <div className="text-xs text-muted-foreground">
                RAG Assistant
              </div>

              <PromptInputTools>
                <PromptInputSubmit
                  disabled={!input.trim() || isLoading}
                />
              </PromptInputTools>
            </PromptInputFooter>
          </PromptInput>

          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            AI can make mistakes. Check important information.
          </p>
        </div>
      </div>
    </main>
  );
}