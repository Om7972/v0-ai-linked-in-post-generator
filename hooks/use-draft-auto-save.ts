"use client"

import { useState, useCallback, useEffect } from "react"

interface Draft {
  id: string
  content: string
  topic: string
  audience: string
  tone: "Professional" | "Founder" | "Influencer" | "Casual"
  lastSaved: Date
  unsavedChanges: boolean
}

const DRAFT_KEY = "post-draft"

export function useDraftAutoSave(
  content: string,
  topic: string,
  audience: string,
  tone: "Professional" | "Founder" | "Influencer" | "Casual"
) {
  const [draft, setDraft] = useState<Draft | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Auto-save on interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (content.length > 10) {
        const newDraft: Draft = {
          id: "draft-1",
          content,
          topic,
          audience,
          tone,
          lastSaved: new Date(),
          unsavedChanges: false,
        }
        setIsSaving(true)
        // Simulate save delay
        setTimeout(() => {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(newDraft))
          setDraft(newDraft)
          setLastSaved(new Date())
          setIsSaving(false)
        }, 300)
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(interval)
  }, [content, topic, audience, tone])

  // Load draft on mount
  useEffect(() => {
    const stored = localStorage.getItem(DRAFT_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setDraft(parsed)
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY)
    setDraft(null)
  }, [])

  const saveDraftManually = useCallback(() => {
    const newDraft: Draft = {
      id: "draft-1",
      content,
      topic,
      audience,
      tone,
      lastSaved: new Date(),
      unsavedChanges: false,
    }
    setIsSaving(true)
    setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(newDraft))
      setDraft(newDraft)
      setLastSaved(new Date())
      setIsSaving(false)
    }, 300)
  }, [content, topic, audience, tone])

  return {
    draft,
    isSaving,
    lastSaved,
    clearDraft,
    saveDraftManually,
  }
}
