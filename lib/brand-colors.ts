/**
 * Brand color system for AI LinkedIn Post Generator
 * Professional, modern SaaS color palette
 */

export const brandColors = {
  // Primary - LinkedIn Blue
  primary: {
    50: "#f0f8ff",
    100: "#e0f0ff",
    200: "#bae3ff",
    300: "#7ec9ff",
    400: "#3ba3f5",
    500: "#0a66c2", // Main LinkedIn Blue
    600: "#004fa3",
    700: "#003d82",
    800: "#002d61",
    900: "#001d40",
  },

  // Secondary - AI Purple/Indigo
  secondary: {
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6", // Main AI Purple
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#3f0f92",
  },

  // Neutrals
  neutral: {
    0: "#ffffff",
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712",
  },

  // Semantic colors
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",

  // Gradients
  gradient: {
    primary: "linear-gradient(135deg, #0a66c2 0%, #8b5cf6 100%)",
    purple: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    cool: "linear-gradient(135deg, #0a66c2 0%, #3b82f6 100%)",
  },
}

/**
 * CSS custom properties for Tailwind
 * Defined in globals.css, this is the mapping
 */
export const tailwindColorMap = {
  primary: "var(--primary)",
  secondary: "var(--secondary)",
  background: "var(--background)",
  foreground: "var(--foreground)",
  card: "var(--card)",
  border: "var(--border)",
  input: "var(--input)",
  muted: "var(--muted)",
  accent: "var(--accent)",
}
