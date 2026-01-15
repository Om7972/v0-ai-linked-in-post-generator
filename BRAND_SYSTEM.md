# AI LinkedIn Post Generator - Brand System

A comprehensive, production-ready brand identity and component system for the AI LinkedIn Post Generator SaaS product.

## 📦 Brand Components

### Logo System
- **Logo.tsx** - Primary logo with icon + text
- **LogoIcon.tsx** - Icon-only version (for favicons, avatars)
- **LogoFavicon.tsx** - Square favicon for app icons

```tsx
import { Logo, LogoIcon } from '@/components/brand'

// Full logo (horizontal)
<Logo size="md" variant="full" />

// Icon only
<LogoIcon size="lg" />
```

### Brand Elements
- **BrandBadge.tsx** - "AI Powered" badge with gradient and icon
- **BrandAvatar.tsx** - Circular profile avatar with optional AI badge overlay

```tsx
import { BrandBadge, BrandAvatar } from '@/components/brand'

<BrandBadge size="md" />
<BrandAvatar initials="JD" size="lg" showAIBadge />
```

## 🧭 Navigation System

### Header / Navigation Bar
- **Header.tsx** - Sticky navigation with glassmorphism
  - Logo navigation
  - Desktop/mobile responsive
  - Scroll shadow effect
  - Theme toggle
  - CTA buttons

- **MobileNav.tsx** - Slide-out drawer navigation
  - Hamburger menu trigger
  - Full navigation links
  - Large touch targets
  - CTA buttons at bottom

- **NavLink.tsx** - Individual navigation link
  - Animated underline on hover
  - Active state indicator
  - Accessibility-focused

- **ThemeToggle.tsx** - Light/dark mode toggle
  - Smooth transitions
  - Auto-detects system preference

```tsx
import { Header } from '@/components/brand'

// Automatically included in layout.tsx
// Renders on all pages except /app
<Header />
```

## 🎨 Color System

### Primary Colors
- **LinkedIn Blue**: `#0A66C2` - Main brand color for CTAs and highlights
- **AI Purple**: `#8B5CF6` - Secondary accent for AI features

### Semantic Colors
- **Success**: `#10B981` - Positive states
- **Warning**: `#F59E0B` - Cautionary states
- **Error**: `#EF4444` - Error/destructive states

### Usage
```tsx
import { brandColors } from '@/lib/brand-colors'

// Access color palette
const primaryBlue = brandColors.primary[600]
const gradientBg = brandColors.gradient.primary // Linear gradient
```

## 📐 Typography

Font stack optimized for readability:
- **Sans**: Geist Sans (primary body font)
- **Mono**: Geist Mono (code, technical text)

### Scale
- **H1** - 48px, 700 weight (hero headlines)
- **H2** - 36px, 700 weight (section headings)
- **H3** - 28px, 700 weight (subsection headings)
- **H4** - 20px, 600 weight (card titles)
- **Body** - 16px, 400 weight (paragraphs)
- **Small** - 14px, 400 weight (secondary text)
- **XS** - 12px, 400 weight (labels, metadata)

## 🎯 Usage in Components

### Import Brand Components
```tsx
import {
  Logo,
  LogoIcon,
  Header,
  BrandBadge,
  BrandAvatar,
  ThemeToggle,
  NavLink,
  MobileNav,
} from '@/components/brand'
```

### Header is Automatic
The `Header` component is included in the root layout and:
- ✅ Automatically renders on landing page
- ✅ Automatically hides on `/app` route
- ✅ Handles responsive behavior
- ✅ Manages scroll effects
- ✅ Supports light/dark mode

### Creating New Pages
Just use the brand components in your sections:

```tsx
export function Hero() {
  return (
    <section>
      <BrandBadge size="md" className="mb-4" />
      <h1>Your Headline Here</h1>
      <p>Subtext</p>
    </section>
  )
}
```

## 🎨 Design Principles

### Visual Style
- Clean, professional SaaS aesthetic
- Inspired by: LinkedIn × Notion × Modern AI startups
- Minimal use of effects - only where purposeful
- High contrast for accessibility

### Spacing
- **XS**: 4px (fine details)
- **SM**: 8px (small gaps)
- **MD**: 16px (standard spacing)
- **LG**: 24px (sections)
- **XL**: 32px (large sections)

### Interactions
- Smooth hover underline on nav links
- Gradient buttons with glow effect
- Subtle shadows on cards
- Scroll-based animations (Framer Motion)
- Focus rings for keyboard navigation

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 0-640px
- **Tablet**: 641-1024px
- **Desktop**: 1025px+

### Mobile Considerations
- Hamburger menu for navigation
- Touch-friendly buttons (44x44px minimum)
- Stacked layouts
- Readable text without horizontal scroll

## 🌓 Dark Mode

All components support light/dark mode:
- Automatic theme detection via `next-themes`
- User can toggle with `ThemeToggle` component
- Persisted in localStorage
- Respects system preference by default

## ✨ Animations

Powered by Framer Motion:
- Scroll-triggered animations (`whileInView`)
- Hover effects for interactivity
- Staggered cascading reveals
- Smooth transitions (150ms-500ms)

All animations respect `prefers-reduced-motion` preference.

## 📊 Brand Files Reference

```
lib/
├── brand-colors.ts          # Color constants and palette
├── brand-guidelines.ts      # Complete style guide

components/brand/
├── logo.tsx                 # Logo variants
├── badge.tsx                # Brand badge & avatar
├── header.tsx               # Main navigation bar
├── mobile-nav.tsx           # Mobile drawer
├── nav-link.tsx             # Navigation link component
├── theme-toggle.tsx         # Dark mode toggle
└── index.ts                 # Barrel exports
```

## 🚀 Implementation Checklist

- ✅ Logo system created (SVG, scalable)
- ✅ Color system defined
- ✅ Typography system set up
- ✅ Header navigation built
- ✅ Mobile navigation responsive
- ✅ Dark mode support
- ✅ Accessibility guidelines
- ✅ Brand guidelines documentation

## 🎯 Next Steps

1. **Customize Logo**: Update SVG in `logo.tsx` to your exact design
2. **Adjust Colors**: Modify `brand-colors.ts` for your palette
3. **Add Social Links**: Update footer/header social icons
4. **Create Style Guide Page**: Add `/brand-guide` page for internal reference
5. **Brand Assets**: Save logo variations as separate SVG files

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

---

Built with ❤️ for modern SaaS products.
