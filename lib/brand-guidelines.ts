/**
 * Brand Guidelines & Design System
 * AI LinkedIn Post Generator
 */

// ============================================================
// COLOR SYSTEM
// ============================================================

export const colorGuide = {
  primary: {
    name: "LinkedIn Blue",
    hex: "#0A66C2",
    description: "Main brand color. Used for primary CTAs, links, and key interactions.",
    usage: ["Buttons", "Links", "Primary highlights", "Logo"],
  },

  secondary: {
    name: "AI Purple",
    hex: "#8B5CF6",
    description: "AI-focused accent. Represents intelligence and innovation.",
    usage: ["AI actions", "Secondary CTAs", "Accent highlights", "Gradients"],
  },

  success: {
    name: "Success Green",
    hex: "#10B981",
    description: "Success states, confirmations, positive feedback.",
    usage: ["Success states", "Checkmarks", "Positive indicators"],
  },

  warning: {
    name: "Warning Amber",
    hex: "#F59E0B",
    description: "Warnings and cautionary states.",
    usage: ["Warning alerts", "Notice badges"],
  },

  error: {
    name: "Error Red",
    hex: "#EF4444",
    description: "Error states and destructive actions.",
    usage: ["Error messages", "Destructive buttons"],
  },
}

// ============================================================
// TYPOGRAPHY SYSTEM
// ============================================================

export const typographyGuide = {
  headings: {
    h1: {
      size: "48px",
      weight: 700,
      lineHeight: "1.2",
      usage: "Page titles, hero headlines",
    },
    h2: {
      size: "36px",
      weight: 700,
      lineHeight: "1.3",
      usage: "Section headings",
    },
    h3: {
      size: "28px",
      weight: 700,
      lineHeight: "1.4",
      usage: "Subsection headings",
    },
    h4: {
      size: "20px",
      weight: 600,
      lineHeight: "1.5",
      usage: "Card titles, feature names",
    },
  },

  body: {
    base: {
      size: "16px",
      weight: 400,
      lineHeight: "1.6",
      usage: "Body text, paragraphs",
    },
    small: {
      size: "14px",
      weight: 400,
      lineHeight: "1.5",
      usage: "Secondary text, captions",
    },
    xs: {
      size: "12px",
      weight: 400,
      lineHeight: "1.4",
      usage: "Labels, metadata",
    },
  },

  fonts: {
    sans: "Geist Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "Geist Mono, 'Courier New', monospace",
  },
}

// ============================================================
// SPACING & LAYOUT
// ============================================================

export const spacingGuide = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
  "4xl": "96px",

  containerWidth: "1280px",
  containerPadding: "32px",
  gridGap: "24px",
}

// ============================================================
// COMPONENT PATTERNS
// ============================================================

export const componentPatterns = {
  buttons: {
    primary: {
      bg: "Linear gradient from Blue-600 to Purple-600",
      text: "White",
      hover: "Darker gradient",
      padding: "12px 24px",
      radius: "8px",
    },
    secondary: {
      bg: "Transparent",
      border: "1px gray-300",
      text: "Gray-700",
      hover: "Gray-50 background",
      padding: "12px 24px",
      radius: "8px",
    },
  },

  cards: {
    background: "White / Dark-900",
    border: "1px solid gray-200/dark-800",
    radius: "12px",
    shadow: "subtle (0 1px 3px rgba(0,0,0,0.1))",
    padding: "24px",
    hover: "Border brightens, shadow increases slightly",
  },

  inputs: {
    background: "Gray-50 / Dark-950",
    border: "1px solid gray-300/dark-700",
    radius: "8px",
    padding: "12px 16px",
    focus: "Blue-500 border + Blue-500 ring",
  },
}

// ============================================================
// ANIMATION PRINCIPLES
// ============================================================

export const animationGuide = {
  duration: {
    fast: "150ms",
    standard: "300ms",
    slow: "500ms",
  },

  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    enter: "cubic-bezier(0, 0, 0.2, 1)",
    exit: "cubic-bezier(0.4, 0, 1, 1)",
  },

  principles: [
    "Use motion to guide attention",
    "Keep animations quick and purposeful",
    "Avoid unnecessary animations",
    "Ensure animations respect prefers-reduced-motion",
  ],
}

// ============================================================
// ACCESSIBILITY
// ============================================================

export const accessibilityGuidance = [
  "Minimum color contrast ratio: 4.5:1 for normal text, 3:1 for large text",
  "Focus indicators must be visible and at least 2px",
  "Interactive elements must be at least 44x44px on mobile",
  "All images must have descriptive alt text",
  "Use semantic HTML for navigation",
  "Ensure keyboard navigation works throughout",
  "Support screen readers with proper ARIA labels",
]

// ============================================================
// IMAGERY & ICONS
// ============================================================

export const imageryGuide = {
  style: "Modern, clean, minimal",
  icons: "Lucide React (consistent 24px stroke width)",
  illustrations: "Gradient backgrounds with geometric shapes",
  photography: "Professional, focused on people/success moments",
  colorUsage: "Brand colors as overlays or accents",
}

// ============================================================
// RESPONSIVE DESIGN
// ============================================================

export const responsiveGuide = {
  breakpoints: {
    mobile: "0px (max 640px)",
    tablet: "641px (max 1024px)",
    desktop: "1025px+",
  },

  principles: [
    "Mobile-first design approach",
    "Touch targets minimum 44x44px on mobile",
    "Collapse complex layouts on mobile",
    "Ensure readable text at all sizes",
    "Test on real devices",
  ],
}

// ============================================================
// TONE & VOICE
// ============================================================

export const toneAndVoice = {
  personality: ["Professional", "Trustworthy", "Innovative", "Helpful", "Clear"],

  examples: {
    CtaBraggyloud: "Transform Your LinkedIn Presence Today!",
    CtaClear: "Start Creating Free",
    ErrorSnarky: "Oops! Something went wrong.",
    ErrorClear: "Unable to generate post. Please try again.",
    FeatureBraggyloud: "The Most Powerful AI Post Generator Ever Built",
    FeatureClear: "AI-powered suggestions for better engagement",
  },

  principles: [
    "Be clear and direct",
    "Avoid marketing jargon",
    "Use active voice",
    "Address users as 'you'",
    "Show empathy in error messages",
  ],
}

export default {
  colorGuide,
  typographyGuide,
  spacingGuide,
  componentPatterns,
  animationGuide,
  accessibilityGuidance,
  imageryGuide,
  responsiveGuide,
  toneAndVoice,
}
