# Premium AI LinkedIn Post Generator - Landing Page

A production-ready, premium animated landing page for the AI LinkedIn Post Generator web app, built with **Next.js**, **Tailwind CSS**, **shadcn/ui**, and **Framer Motion**.

## 🎯 Features

### Landing Page Components

#### 1. **Hero Section** (`components/landing/hero.tsx`)
- Full-width gradient background (blue → purple)
- Animated headline: "Write Viral LinkedIn Posts in Seconds"
- Subheading with AI value proposition
- Primary CTA button with glowing hover animation
- Secondary ghost button for examples
- Animated LinkedIn-style post mockup with floating effect
- Responsive design with mobile-first approach

#### 2. **Features Grid** (`components/landing/features.tsx`)
- 6 animated feature cards
- Icons: Lightning, Sparkles, Target, PenTool, BarChart, Share
- Gradient border effects on hover
- Staggered animation on scroll
- Responsive 3-column grid (1 mobile, 2 tablet, 3 desktop)

#### 3. **How It Works** (`components/landing/how-it-works.tsx`)
- 6-step timeline with step numbers
- Vertical connector lines with gradient
- Staggered animations
- Hover pulse effects on step indicators
- Scroll-triggered visibility
- Mobile-responsive layout

#### 4. **Live AI Preview** (`components/landing/live-preview.tsx`)
- 3 sample generated posts with different styles
- LinkedIn-style engagement metrics
- Star ratings for social proof
- Interactive hover effects
- Statistics row showing 10K+ posts, 95% satisfaction, 3.2x engagement boost

#### 5. **Social Proof Carousel** (`components/landing/social-proof.tsx`)
- 4 professional testimonials
- 5-star ratings
- User initials in gradient circles
- Company and title information
- 2-column grid layout
- Hover gradient border effects

#### 6. **CTA Banner** (`components/landing/cta-banner.tsx`)
- Animated gradient background blobs
- Primary CTA: "Start Creating Free"
- Secondary CTA: "View Pricing"
- Limited-time offer badge
- Footer text: "No credit card required. First 5 posts free."
- Advanced animations with continuous background motion

#### 7. **Footer** (`components/landing/footer.tsx`)
- 4-column navigation (Product, Company, Legal)
- Social media links
- Copyright information
- Professional footer styling with opacity transitions

### Main Landing Page (`components/landing/index.tsx`)
- Composite component that brings all sections together
- Black background with white text for premium look
- Seamless section transitions

## 🎨 Design Features

### Animations
- **Scroll-based animations**: Fade-in effects as users scroll
- **Hover micro-interactions**: Gradient borders, scale transforms, glow effects
- **Floating elements**: Smooth up-down motion on components
- **Staggered animations**: Cascading reveal of grid items
- **Continuous motion**: Background blobs with infinite animations

### Color Palette
- **Primary**: Blue (from-blue-600 to-blue-500)
- **Secondary**: Purple (from-purple-600 to-purple-500)
- **Accent**: Pink/Orange for testimonials
- **Background**: Deep black (#000000) for premium feel
- **Text**: White and gray tones for contrast

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly button sizes (h-12, h-14)
- Optimal font sizes for readability across devices

## 📁 Project Structure

```
components/
├── landing/
│   ├── index.tsx          # Main landing page composite
│   ├── hero.tsx           # Hero section with CTA
│   ├── features.tsx       # Feature cards grid
│   ├── how-it-works.tsx   # Step-by-step timeline
│   ├── live-preview.tsx   # AI preview samples
│   ├── social-proof.tsx   # Testimonials carousel
│   ├── cta-banner.tsx     # Final CTA with animated bg
│   └── footer.tsx         # Footer navigation
├── ui/                    # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   └── ...
└── theme-provider.tsx     # Dark mode provider

app/
├── page.tsx               # Home page (uses landing page)
├── app/page.tsx          # App generator page
├── layout.tsx            # Root layout with theme
└── globals.css           # Global styles & animations
```

## 🚀 Getting Started

### Installation

1. **Install dependencies** (if Framer Motion isn't already installed):
```bash
pnpm install framer-motion
```

2. **Navigate to the project**:
```bash
cd d:\v0-ai-linked-in-post-generator
```

3. **Run development server**:
```bash
pnpm dev
```

4. **View in browser**:
Open [http://localhost:3000](http://localhost:3000)

### File Organization

All landing page components are located in `components/landing/`:
- Each component is self-contained with its own animations
- Uses Framer Motion for smooth, performant animations
- Follows shadcn/ui design patterns
- Tailwind CSS for styling

## 🎬 Animation Details

### Scroll-triggered Animations
```typescript
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.8 }}
```

### Hover Effects
```typescript
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
transition={{ duration: 0.3 }}
```

### Continuous Animations
```typescript
animate={{
  x: [0, 50, 0],
  y: [0, 50, 0],
}}
transition={{
  duration: 6,
  repeat: Infinity,
  ease: "easeInOut",
}}
```

## 🎯 Navigation

- **Home Page** (`/`) - Premium landing page
- **App Page** (`/app`) - Post generator interface
- Hero section has CTA buttons linking to `/app`

## 🛠 Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Mono
- **Theme**: next-themes (dark mode ready)

## 📊 Performance Optimizations

- CSS animations for background blobs (GPU-accelerated)
- Viewport-based animations (only animate visible elements)
- Optimized SVG icons
- Lazy loading of components
- Efficient Framer Motion configurations

## ✨ Customization

### Change Brand Colors
Edit `app/globals.css` CSS variables:
```css
--primary: oklch(0.65 0.25 270);  /* Change this value */
--accent: oklch(0.65 0.25 270);
```

### Modify Animation Speeds
Update transition durations in component files:
```typescript
transition={{ duration: 0.8 }}  // Adjust milliseconds
```

### Add/Remove Sections
Edit `components/landing/index.tsx`:
```typescript
<Hero />
<Features />
<HowItWorks />
<LivePreview />
<SocialProof />
<CTABanner />
<Footer />
```

### Update Content
- Hero text: `components/landing/hero.tsx`
- Features: `components/landing/features.tsx` (update `features` array)
- Testimonials: `components/landing/social-proof.tsx` (update `testimonials` array)

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Animations not showing
- Ensure Framer Motion is installed: `pnpm install framer-motion`
- Check browser console for errors
- Verify CSS animations in globals.css are loaded

### Dark mode not working
- Verify `ThemeProvider` is in `app/layout.tsx`
- Check `next-themes` is installed and configured

### Layout shifts
- Ensure `suppressHydrationWarning` on `<html>` tag
- Verify Tailwind CSS is properly configured

## 📝 License

This landing page is part of the AI LinkedIn Post Generator project.

---

**Built with ❤️ using Next.js, Tailwind CSS, shadcn/ui, and Framer Motion**
