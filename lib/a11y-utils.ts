/**
 * Accessibility utilities for enhanced keyboard navigation and screen reader support
 */

import { ReactNode } from "react"

export interface A11yProps {
  "aria-label"?: string
  "aria-describedby"?: string
  "aria-expanded"?: boolean
  "aria-selected"?: boolean
  "aria-pressed"?: boolean
  "aria-disabled"?: boolean
  "aria-live"?: "polite" | "assertive"
  "aria-atomic"?: boolean
  role?: string
}

/**
 * Create consistent ARIA attributes for interactive elements
 */
export function createA11yProps(
  type: "button" | "link" | "heading" | "status" | "alert",
  label: string,
  options: Partial<A11yProps> = {}
): A11yProps {
  const baseProps: A11yProps = {
    "aria-label": label,
    ...options,
  }

  switch (type) {
    case "button":
      return {
        role: "button",
        "aria-pressed": false,
        ...baseProps,
      }
    case "status":
      return {
        role: "status",
        "aria-live": "polite",
        "aria-atomic": true,
        ...baseProps,
      }
    case "alert":
      return {
        role: "alert",
        "aria-live": "assertive",
        "aria-atomic": true,
        ...baseProps,
      }
    default:
      return baseProps
  }
}

/**
 * Keyboard shortcut handler helper
 */
export function createKeyboardHandler(
  callback: () => void,
  keys: string[] = ["Enter", " "]
): (event: React.KeyboardEvent) => void {
  return (event: React.KeyboardEvent) => {
    if (keys.includes(event.key)) {
      event.preventDefault()
      callback()
    }
  }
}

/**
 * Focus management utilities
 */
export function manageFocus(elementId: string, action: "focus" | "blur" = "focus") {
  const element = document.getElementById(elementId)
  if (element) {
    if (action === "focus") {
      element.focus()
    } else {
      element.blur()
    }
  }
}

/**
 * Announce to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
) {
  const announcement = document.createElement("div")
  announcement.setAttribute("role", "status")
  announcement.setAttribute("aria-live", priority)
  announcement.setAttribute("aria-atomic", "true")
  announcement.className = "sr-only"
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Keyboard navigation hint for users
 */
export function createKeyboardHint(
  shortcut: string,
  description: string
): string {
  return `${description} (${shortcut})`
}
