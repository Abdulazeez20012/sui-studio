# 🎨 Font Usage Guide - Quick Reference

## Font Classes in Tailwind

### Display Font - `font-display` (Syne)
**Use for**: Hero headlines, major brand statements, primary CTAs

```tsx
<h1 className="font-display text-8xl font-black">
  Build the Future of Web3
</h1>
```

**Characteristics**:
- Bold and geometric
- High visual impact
- Modern Web3 aesthetic
- Best at large sizes (48px+)

---

### Heading Font - `font-heading` (Space Grotesk)
**Use for**: Section titles, feature headings, card titles, navigation

```tsx
<h2 className="font-heading text-5xl font-bold">
  Everything you need to ship.
</h2>
```

**Characteristics**:
- Technical and clean
- Developer-friendly
- Excellent readability
- Works well at medium-large sizes (20px-60px)

---

### Body Font - `font-sans` (Inter)
**Use for**: Paragraphs, descriptions, UI text, buttons

```tsx
<p className="font-sans text-lg text-slate-300">
  The first Web3 IDE with built-in video collaboration.
</p>
```

**Characteristics**:
- Highly readable
- Optimized for screens
- Versatile for all sizes
- Industry standard for body text

---

### Monospace Font - `font-mono` (IBM Plex Mono)
**Use for**: Code snippets, terminal output, technical data

```tsx
<code className="font-mono text-sm">
  module nft::collection
</code>
```

**Characteristics**:
- Professional monospace
- Clear character distinction
- Developer-focused
- Perfect for code display

---

## Real Examples from Components

### Hero Section
```tsx
// Main headline - Display font
<h1 className="font-display text-8xl font-black">
  Build the Future of Web3
</h1>

// Subheadline - Body font
<p className="font-sans text-2xl text-slate-300">
  The first Web3 IDE with built-in video collaboration
</p>
```

### Features Section
```tsx
// Section title - Heading font
<h2 className="font-heading text-6xl font-bold">
  Everything you need to ship.
</h2>

// Feature title - Heading font
<h3 className="font-heading text-xl font-bold">
  Real-Time Video Collaboration
</h3>

// Feature description - Body font
<p className="font-sans text-slate-400">
  HD video calls with screen sharing.
</p>
```

### Stats Section
```tsx
// Section title - Display font
<h2 className="font-display text-5xl font-black uppercase">
  Built for Performance
</h2>

// Stat value - Display font
<div className="font-display text-3xl font-black">
  HD
</div>

// Stat label - Heading font
<div className="font-heading text-sm font-bold uppercase">
  Video Quality
</div>

// Description - Body font
<div className="font-sans text-xs">
  720p real-time collaboration
</div>
```

### Code Editor Preview
```tsx
// Code content - Monospace font
<div className="font-mono text-sm">
  <div className="text-purple-400">module</div>
  <div className="text-blue-400">nft::collection</div>
</div>
```

---

## Font Weight Guidelines

### Display Font (Syne)
- **400**: Regular (rarely used)
- **500**: Medium (rarely used)
- **600**: Semi Bold (secondary headlines)
- **700**: Bold (primary headlines)
- **800**: Extra Bold (hero headlines)

### Heading Font (Space Grotesk)
- **300**: Light (subtle headings)
- **400**: Regular (small headings)
- **500**: Medium (card titles)
- **600**: Semi Bold (section titles)
- **700**: Bold (major headings)

### Body Font (Inter)
- **300**: Light (subtle text)
- **400**: Regular (body text)
- **500**: Medium (emphasized text)
- **600**: Semi Bold (strong emphasis)
- **700**: Bold (very strong emphasis)

### Monospace Font (IBM Plex Mono)
- **400**: Regular (code)
- **500**: Medium (emphasized code)
- **600**: Semi Bold (headings in code)
- **700**: Bold (very important code)

---

## Size Recommendations

### Display Font
- Hero: `text-6xl` to `text-8xl` (60px-96px)
- Major CTA: `text-4xl` to `text-6xl` (36px-60px)

### Heading Font
- H1: `text-5xl` to `text-6xl` (48px-60px)
- H2: `text-4xl` to `text-5xl` (36px-48px)
- H3: `text-2xl` to `text-3xl` (24px-30px)
- H4: `text-xl` to `text-2xl` (20px-24px)

### Body Font
- Large: `text-xl` to `text-2xl` (20px-24px)
- Regular: `text-base` to `text-lg` (16px-18px)
- Small: `text-sm` to `text-base` (14px-16px)
- Tiny: `text-xs` to `text-sm` (12px-14px)

### Monospace Font
- Code blocks: `text-sm` to `text-base` (14px-16px)
- Inline code: `text-xs` to `text-sm` (12px-14px)

---

## Color Pairing

### Display Font Colors
```tsx
// White on dark
className="font-display text-white"

// Gradient
className="font-display bg-gradient-to-r from-sui-cyan to-blue-500 bg-clip-text text-transparent"

// Accent
className="font-display text-sui-cyan"
```

### Heading Font Colors
```tsx
// White
className="font-heading text-white"

// Slate
className="font-heading text-slate-200"

// Accent
className="font-heading text-sui-cyan"
```

### Body Font Colors
```tsx
// Primary
className="font-sans text-slate-300"

// Secondary
className="font-sans text-slate-400"

// Muted
className="font-sans text-slate-500"
```

---

## Common Patterns

### Hero Pattern
```tsx
<div>
  <h1 className="font-display text-8xl font-black text-white">
    Main Headline
  </h1>
  <p className="font-sans text-2xl text-slate-300">
    Supporting description text
  </p>
</div>
```

### Feature Card Pattern
```tsx
<div>
  <h3 className="font-heading text-xl font-bold text-white">
    Feature Title
  </h3>
  <p className="font-sans text-slate-400">
    Feature description explaining the benefit
  </p>
</div>
```

### Stat Pattern
```tsx
<div>
  <div className="font-display text-4xl font-black text-white">
    50k+
  </div>
  <div className="font-heading text-sm font-bold uppercase text-slate-400">
    Deployments
  </div>
</div>
```

### Button Pattern
```tsx
<button className="font-sans text-lg font-bold">
  Get Started
</button>
```

---

## Don't Mix These

❌ **Avoid**:
- Display font for body text (too bold)
- Body font for hero headlines (not impactful enough)
- Monospace for regular UI text (hard to read)
- Multiple display fonts in same section

✅ **Do**:
- Use display for major headlines
- Use heading for section titles
- Use body for descriptions
- Use mono only for code

---

## Accessibility Notes

1. **Minimum sizes**:
   - Body text: 14px minimum
   - Headings: 20px minimum
   - Code: 12px minimum

2. **Contrast**:
   - White text on dark: AAA rating
   - Slate-300 on dark: AA rating
   - Slate-400 on dark: AA rating (large text)

3. **Line height**:
   - Display: 1.1-1.2
   - Heading: 1.2-1.3
   - Body: 1.5-1.7
   - Code: 1.5

---

## Quick Decision Tree

**Is it the main hero headline?**
→ Use `font-display`

**Is it a section title or feature heading?**
→ Use `font-heading`

**Is it code or technical data?**
→ Use `font-mono`

**Is it anything else (description, UI text, etc.)?**
→ Use `font-sans`

---

**Remember**: Consistency is key. Stick to these patterns across all components for a cohesive design.
