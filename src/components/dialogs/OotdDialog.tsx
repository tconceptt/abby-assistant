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
import { Sparkles } from "lucide-react"

interface OotdDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuggest: (weather: string, settings: string[], context: string) => void
  isLoading: boolean
}

const weatherOptions = ["Sunny", "Cloudy", "Rainy", "Snowy", "Windy"]
const settingOptions = [
  "Casual",
  "Formal",
  "School",
  "Work",
  "Party",
  "Date Night",
  "Outdoors",
]

export function OotdDialog({
  open,
  onOpenChange,
  onSuggest,
  isLoading,
}: OotdDialogProps) {
  const [weather, setWeather] = React.useState("")
  const [settings, setSettings] = React.useState<string[]>([])
  const [context, setContext] = React.useState("")

  const handleSettingChange = (setting: string) => {
    setSettings(prev =>
      prev.includes(setting)
        ? prev.filter(s => s !== setting)
        : [...prev, setting],
    )
  }

  const handleSubmit = () => {
    if (!weather || settings.length === 0) {
      console.error("Please select weather and at least one setting.")
      return
    }
    onSuggest(weather, settings, context)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-white border-white/[0.1] bg-black/80 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Outfit Suggestion</DialogTitle>
          <DialogDescription className="text-white/60">
            Tell me about your day, and I&apos;ll suggest the perfect outfit.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">
              What&apos;s the weather like?
            </label>
            <select
              value={weather}
              onChange={e => setWeather(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 rounded-md px-3 py-2 text-sm text-white/90 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
            >
              <option value="" disabled>
                Select weather...
              </option>
              {weatherOptions.map(w => (
                <option key={w} value={w} className="bg-black">
                  {w}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">
              What&apos;s the setting?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {settingOptions.map(setting => (
                <label
                  key={setting}
                  className={`flex items-center gap-2 cursor-pointer p-3 rounded-md transition-colors ${
                    settings.includes(setting)
                      ? "bg-violet-500/20 border-violet-500/50"
                      : "bg-white/[0.05] border-white/10"
                  } border`}
                >
                  <input
                    type="checkbox"
                    checked={settings.includes(setting)}
                    onChange={() => handleSettingChange(setting)}
                    className="h-4 w-4 rounded-sm text-violet-500 bg-white/[0.1] border-white/20 focus:ring-violet-500/50"
                  />
                  <span className="text-sm">{setting}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="ootd-context"
              className="text-sm font-medium text-white/80"
            >
              Any other context? (Optional)
            </label>
            <textarea
              id="ootd-context"
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="e.g., I want to look chic and comfortable."
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
            Get Suggestions
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