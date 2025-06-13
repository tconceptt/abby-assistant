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
import { PlusIcon, XIcon, Sparkles } from "lucide-react"

interface HelpMeDecideDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDecide: (options: string[], context: string) => void
  isLoading: boolean
}

export function HelpMeDecideDialog({
  open,
  onOpenChange,
  onDecide,
  isLoading,
}: HelpMeDecideDialogProps) {
  const [options, setOptions] = React.useState(["", ""])
  const [context, setContext] = React.useState("")

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const addOption = () => {
    setOptions([...options, ""])
  }

  const removeOption = (index: number) => {
    if (options.length <= 2) return
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
  }

  const handleSubmit = () => {
    const filteredOptions = options.filter(opt => opt.trim() !== "")
    if (filteredOptions.length < 2) {
      console.error("Please provide at least two options.")
      return
    }
    onDecide(filteredOptions, context)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-white border-white/[0.1] bg-black/80 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Help Me Decide</DialogTitle>
          <DialogDescription className="text-white/60">
            Provide a few options, and I&apos;ll help you pick one.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={e => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-md px-3 py-2 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                />
                {options.length > 2 && (
                  <button onClick={() => removeOption(index)} className="p-2 text-white/50 hover:text-white">
                    <XIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addOption}
              className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Add Option
            </button>
          </div>

          <div className="space-y-2">
            <label htmlFor="context" className="text-sm font-medium text-white/80">Context (Optional)</label>
            <textarea
              id="context"
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="e.g., I'm looking for a casual outfit for a sunny day."
              className="w-full h-24 bg-white/[0.05] border border-white/10 rounded-md px-3 py-2 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50 resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex-col gap-2">
           <motion.button
            onClick={handleSubmit}
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 bg-white text-[#0A0A0B] shadow-lg shadow-white/10 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            Decide
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