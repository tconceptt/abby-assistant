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
import { Sparkles, Check } from "lucide-react"
import { AnimatePresence } from "framer-motion"

interface OotdDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuggest: (
    weather: string,
    settings: string[],
    context: string,
    isWalking: boolean,
  ) => void
  isLoading: boolean
}

const weatherOptions = ["Sunny", "Cloudy", "Rainy", "Windy"]
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
  const [isWalking, setIsWalking] = React.useState(false)

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
    onSuggest(weather, settings, context, isWalking)
  }

  const CustomCheckbox = ({
    label,
    checked,
    onChange,
  }: {
    label: string
    checked: boolean
    onChange: () => void
  }) => (
    <label
      className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border transition-colors ${
        checked
          ? "bg-violet-500/20 border-violet-500/50"
          : "bg-white/[0.05] border-white/10 hover:bg-white/5"
      }`}
    >
      <input type="checkbox" className="sr-only" onChange={onChange} />
      <div
        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
          checked
            ? "bg-violet-500 border-violet-400"
            : "border-white/20 bg-white/10"
        }`}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Check className="w-3.5 h-3.5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="text-sm select-none">{label}</span>
    </label>
  )

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
                <CustomCheckbox
                  key={setting}
                  label={setting}
                  checked={settings.includes(setting)}
                  onChange={() => handleSettingChange(setting)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">
              Extra Details
            </label>
            <CustomCheckbox
              label="Walking to Ropack"
              checked={isWalking}
              onChange={() => setIsWalking(!isWalking)}
            />
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