import { Lightbulb, Shirt, Paintbrush } from "lucide-react"
import * as React from "react"

export interface CommandSuggestion {
  icon: React.ReactNode
  label: string
  description: string
  prefix: string
  action?: string
}

export const commandSuggestions: CommandSuggestion[] = [
  {
    icon: <Lightbulb className="w-4 h-4" />,
    label: "Help Me Decide",
    description: "Get help making a decision",
    prefix: "/decide",
    action: "open_decide_dialog",
  },
  {
    icon: <Shirt className="w-4 h-4" />,
    label: "OOTD",
    description: "Outfit of the day suggestion",
    prefix: "/ootd",
    action: "open_ootd_dialog",
  },
  {
    icon: <Paintbrush className="w-4 h-4" />,
    label: "Abby Potter",
    description: "Pottery assistance",
    prefix: "/pottery",
    action: "open_pottery_dialog",
  },
] 