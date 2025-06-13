"use client"

import { useChat } from "@ai-sdk/react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import {
  Paperclip,
  SendIcon,
  XIcon,
  LoaderIcon,
  Command,
  User,
  Sparkles,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import * as React from "react"
import { Textarea } from "@/components/ui/textarea"
import { HelpMeDecideDialog } from "@/components/dialogs/HelpMeDecideDialog"
import { OotdDialog } from "@/components/dialogs/OotdDialog"
import { AbbyPotterDialog } from "@/components/dialogs/AbbyPotterDialog"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"
import { TypingDots } from "@/components/chat/TypingDots"
import {
  commandSuggestions,
  type CommandSuggestion,
} from "@/lib/commands"
import { handleDecide, handleOotd, handlePottery } from "@/lib/chat-actions"

export default function AnimatedAIChat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
    append,
  } = useChat()
  const [attachments, setAttachments] = useState<string[]>([])
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  })
  const [inputFocused, setInputFocused] = useState(false)
  const commandPaletteRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [isHelpMeDecideOpen, setIsHelpMeDecideOpen] = useState(false)
  const [isOotdDialogOpen, setIsOotdDialogOpen] = useState(false)
  const [isAbbyPotterDialogOpen, setIsAbbyPotterDialogOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const onDecide = (options: string[], context: string) => {
    handleDecide(append, options, context)
    setIsHelpMeDecideOpen(false)
  }

  const onOotd = (weather: string, settings: string[], context: string) => {
    handleOotd(append, weather, settings, context)
    setIsOotdDialogOpen(false)
  }

  const onAskPottery = (question: string) => {
    handlePottery(append, question)
    setIsAbbyPotterDialogOpen(false)
  }

  const selectCommandSuggestion = (index: number) => {
    const selectedCommand = commandSuggestions[index]

    if (selectedCommand.action) {
      if (selectedCommand.action === "open_decide_dialog") {
        setIsHelpMeDecideOpen(true)
      } else if (selectedCommand.action === "open_ootd_dialog") {
        setIsOotdDialogOpen(true)
      } else if (selectedCommand.action === "open_pottery_dialog") {
        setIsAbbyPotterDialogOpen(true)
      }
    } else {
      setInput(selectedCommand.prefix + " ")
    }
    setShowCommandPalette(false)
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight
    }
  }, [messages, isLoading])

  useEffect(() => {
    if (input.startsWith("/") && !input.includes(" ")) {
      setShowCommandPalette(true)

      const matchingSuggestionIndex = commandSuggestions.findIndex(cmd =>
        cmd.prefix.startsWith(input),
      )

      if (matchingSuggestionIndex >= 0) {
        setActiveSuggestion(matchingSuggestionIndex)
      } else {
        setActiveSuggestion(-1)
      }
    } else {
      setShowCommandPalette(false)
    }
  }, [input, commandSuggestions])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const commandButton = document.querySelector("[data-command-button]")

      if (
        commandPaletteRef.current &&
        !commandPaletteRef.current.contains(target) &&
        !commandButton?.contains(target)
      ) {
        setShowCommandPalette(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveSuggestion(prev =>
          prev < commandSuggestions.length - 1 ? prev + 1 : 0,
        )
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveSuggestion(prev =>
          prev > 0 ? prev - 1 : commandSuggestions.length - 1,
        )
      } else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault()
        if (activeSuggestion >= 0) {
          selectCommandSuggestion(activeSuggestion)
        }
      } else if (e.key === "Escape") {
        e.preventDefault()
        setShowCommandPalette(false)
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) {
        handleSubmit(e as any)
      }
    }
  }

  const handleAttachFile = () => {
    const mockFileName = `file-${Math.floor(Math.random() * 1000)}.pdf`
    setAttachments(prev => [...prev, mockFileName])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <>
      <HelpMeDecideDialog
        open={isHelpMeDecideOpen}
        onOpenChange={setIsHelpMeDecideOpen}
        onDecide={onDecide}
        isLoading={isLoading}
      />
      <OotdDialog
        open={isOotdDialogOpen}
        onOpenChange={setIsOotdDialogOpen}
        onSuggest={onOotd}
        isLoading={isLoading}
      />
      <AbbyPotterDialog
        open={isAbbyPotterDialogOpen}
        onOpenChange={setIsAbbyPotterDialogOpen}
        onAsk={onAskPottery}
        isLoading={isLoading}
      />
      <div className="min-h-screen flex flex-col w-full items-center justify-center bg-transparent text-white p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
          <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full mix-blend-normal filter blur-[96px] animate-pulse delay-1000" />
        </div>

        <div className="w-full max-w-2xl mx-auto relative flex-1 flex flex-col">
          {messages.length === 0 && !isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                className="relative z-10 space-y-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-block"
                >
                  <h1 className="text-2xl sm:text-3xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/40 pb-1">
                    How can I help today?
                  </h1>
                  <motion.div
                    className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </motion.div>
                <motion.p
                  className="text-sm text-white/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Type a command or ask a question
                </motion.p>
              </motion.div>
            </div>
          ) : (
            <main
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-8"
            >
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role !== "user" && (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white/80" />
                    </div>
                  )}
                  <div
                    className={`max-w-md p-4 rounded-2xl prose prose-invert prose-p:my-0 ${
                      message.role === "user"
                        ? "bg-white/10 text-white/90"
                        : "bg-white/[0.05] text-white/90"
                    }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white/80" />
                  </div>
                  <div className="max-w-md p-4 rounded-2xl bg-white/[0.05] text-white/90">
                    <TypingDots />
                  </div>
                </div>
              )}
            </main>
          )}

          <div className="mt-auto">
            <motion.div
              className="relative backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-2xl"
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <AnimatePresence>
                {showCommandPalette && (
                  <motion.div
                    ref={commandPaletteRef}
                    className="absolute left-4 right-4 bottom-full mb-2 backdrop-blur-xl bg-black/90 rounded-lg z-50 shadow-lg border border-white/10 overflow-hidden"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="py-1 bg-black/95">
                      {commandSuggestions.map((suggestion, index) => (
                        <motion.div
                          key={suggestion.prefix}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer",
                            activeSuggestion === index
                              ? "bg-white/10 text-white"
                              : "text-white/70 hover:bg-white/5",
                          )}
                          onClick={() => selectCommandSuggestion(index)}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <div className="w-5 h-5 flex items-center justify-center text-white/60">
                            {suggestion.icon}
                          </div>
                          <div className="font-medium">{suggestion.label}</div>
                          <div className="text-white/40 text-xs ml-1">
                            {suggestion.prefix}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form
                onSubmit={e => {
                  e.preventDefault()
                  handleSubmit(e)
                }}
              >
                <div className="p-4">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={e => {
                      handleInputChange(e)
                      adjustHeight()
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder="Ask a question..."
                    containerClassName="w-full"
                    className={cn(
                      "w-full px-4 py-3",
                      "resize-none",
                      "bg-transparent",
                      "border-none",
                      "text-white/90 text-sm",
                      "focus:outline-none",
                      "placeholder:text-white/20",
                      "min-h-[60px]",
                    )}
                    style={{
                      overflow: "hidden",
                    }}
                    showRing={false}
                  />
                </div>

                <AnimatePresence>
                  {attachments.length > 0 && (
                    <motion.div
                      className="px-4 pb-3 flex gap-2 flex-wrap"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {attachments.map((file, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-2 text-xs bg-white/[0.03] py-1.5 px-3 rounded-lg text-white/70"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        >
                          <span>{file}</span>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="text-white/40 hover:text-white transition-colors"
                          >
                            <XIcon className="w-3 h-3" />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="p-4 border-t border-white/[0.05] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <motion.button
                      type="button"
                      onClick={handleAttachFile}
                      whileTap={{ scale: 0.94 }}
                      className="p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group"
                    >
                      <Paperclip className="w-4 h-4" />
                      <motion.span
                        className="absolute inset-0 bg-white/[0.05] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        layoutId="button-highlight-attach"
                      />
                    </motion.button>
                    <motion.button
                      type="button"
                      data-command-button
                      onClick={e => {
                        e.stopPropagation()
                        setShowCommandPalette(prev => !prev)
                      }}
                      whileTap={{ scale: 0.94 }}
                      className={cn(
                        "p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group",
                        showCommandPalette && "bg-white/10 text-white/90",
                      )}
                    >
                      <Command className="w-4 h-4" />
                      <motion.span
                        className="absolute inset-0 bg-white/[0.05] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        layoutId="button-highlight-command"
                      />
                    </motion.button>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading || !input.trim()}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      "flex items-center gap-2",
                      input.trim()
                        ? "bg-white text-[#0A0A0B] shadow-lg shadow-white/10"
                        : "bg-white/[0.05] text-white/40",
                    )}
                  >
                    {isLoading ? (
                      <LoaderIcon className="w-4 h-4 animate-[spin_2s_linear_infinite]" />
                    ) : (
                      <SendIcon className="w-4 h-4" />
                    )}
                    <span>Send</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {commandSuggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion.prefix}
                  onClick={() => selectCommandSuggestion(index)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg text-sm text-white/60 hover:text-white/90 transition-all relative group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {suggestion.icon}
                  <span>{suggestion.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {inputFocused && (
          <motion.div
            className="fixed w-[50rem] h-[50rem] rounded-full pointer-events-none z-0 opacity-[0.02] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 blur-[96px]"
            animate={{
              x: mousePosition.x - 400,
              y: mousePosition.y - 400,
            }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 150,
              mass: 0.5,
            }}
          />
        )}
      </div>
    </>
  )
}