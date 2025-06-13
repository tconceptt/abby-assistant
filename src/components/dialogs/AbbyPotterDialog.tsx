"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { Paintbrush } from "lucide-react"

interface AbbyPotterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAsk: (question: string) => void
  isLoading: boolean
}

export function AbbyPotterDialog({
  open,
  onOpenChange,
  onAsk,
  isLoading,
}: AbbyPotterDialogProps) {
  const [question, setQuestion] = React.useState("")

  const handleSubmit = () => {
    if (!question.trim()) {
      return
    }
    onAsk(question)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-white border-white/[0.1] bg-black/80 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Abby Potter</DialogTitle>
          <DialogDescription className="text-white/60">
            This is a pottery assistant tailored for your setup (air-dry clay,
            manual wheel). Ask me anything!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="e.g., What are some good beginner projects for a manual wheel?"
            className="w-full h-32 bg-white/[0.05] border border-white/10 rounded-md px-3 py-2 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50 resize-none"
          />
        </div>

        <DialogFooter className="flex-col gap-2">
          <motion.button
            onClick={handleSubmit}
            disabled={isLoading || !question.trim()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 bg-white text-[#0A0A0B] shadow-lg shadow-white/10 disabled:opacity-50"
          >
            <Paintbrush className="w-4 h-4" />
            Ask Assistant
          </motion.button>
          <DialogClose asChild>
            <button className="px-4 py-2 rounded-md text-sm font-medium text-white/70 hover:bg-white/5 transition-colors">
              Cancel
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 