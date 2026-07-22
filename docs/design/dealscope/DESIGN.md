---
name: DealScope Intelligence
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e6'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f2ff'
  surface-container: '#ededfa'
  surface-container-high: '#e7e7f4'
  surface-container-highest: '#e1e1ee'
  on-surface: '#191b24'
  on-surface-variant: '#424656'
  inverse-surface: '#2e303a'
  inverse-on-surface: '#f0f0fd'
  outline: '#727687'
  outline-variant: '#c2c6d8'
  surface-tint: '#0054d6'
  primary: '#0050cb'
  on-primary: '#ffffff'
  primary-container: '#0066ff'
  on-primary-container: '#f8f7ff'
  inverse-primary: '#b3c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#d7dff9'
  on-secondary-container: '#5a6278'
  tertiary: '#a33200'
  on-tertiary: '#ffffff'
  tertiary-container: '#c54a1b'
  on-tertiary-container: '#fff7f5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae1ff'
  primary-fixed-dim: '#b3c5ff'
  on-primary-fixed: '#001849'
  on-primary-fixed-variant: '#003fa4'
  secondary-fixed: '#dae2fc'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3e465b'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59d'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#832600'
  background: '#faf8ff'
  on-background: '#191b24'
  surface-variant: '#e1e1ee'
  data-positive: '#10B981'
  data-warning: '#F59E0B'
  data-critical: '#EF4444'
  surface-subtle: '#F8FAFC'
  border-muted: '#E2E8F0'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-price:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  micro-label:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  container-max: 1280px
---

## Brand & Style
DealScope is a high-performance shopping intelligence platform designed for data-driven consumers. The brand personality is **precise, authoritative, and proactive**, blending the reliability of a fintech dashboard with the accessibility of modern e-commerce. 

The design style is **Corporate Modern with Glassmorphic accents**. It utilizes a "Fidelity" variant of Material 3 principles—prioritizing information density and clarity through a systematic layout. Subtle glassmorphism (backdrop blurs on navigation elements) and high-quality product imagery add a premium, tech-forward feel. The emotional response should be one of "effortless oversight"—giving users the confidence that they are seeing the full market picture at a glance.

## Colors
The palette is rooted in a "Vivid Blue" primary color, symbolizing intelligence and technology. 

- **Primary (#0066ff):** Used for core actions, focus states, and key data visualizations.
- **Surface System:** Employs a nuanced scale of off-whites and cool grays (`#faf8ff` to `#e1e2ee`) to create distinct functional zones without harsh lines.
- **Semantic Data Colors:** Critical for "Shopping Intelligence." 
    - **Positive (Emerald):** Indicates price drops and healthy market scores.
    - **Warning (Amber):** Indicates low stock or price premiums.
    - **Critical (Red):** Indicates price hikes or urgent alerts.
- **Glass Effects:** Use `rgba(255, 255, 255, 0.7)` with a `12px` backdrop blur for elevated cards or floating headers.

## Typography
The system uses **Inter** for all UI and reading roles to maintain a clean, neutral, and highly legible interface. **JetBrains Mono** is reserved strictly for pricing and financial data to emphasize the "data-science" aspect of the platform.

- **Headlines:** Use tight letter spacing for large titles to create a contemporary look.
- **Labels:** Uppercase labels with increased letter spacing are used for category tags and metadata headers.
- **Numbers:** Monospaced pricing ensures that tabular data or price comparisons remain vertically aligned and easy to scan.

## Layout & Spacing
The layout follows a **Fixed Grid with Bento-box containers**. 

- **Desktop (1024px+):** A 12-column grid within a 1280px container. Side navigation is fixed (256px), and main content uses a `40px` margin.
- **Tablet (768px - 1023px):** Side navigation collapses to a rail or hidden drawer. Gutters reduce to `16px`.
- **Mobile (<768px):** A single-column fluid layout with `16px` margins. Cards stack vertically.
- **Spacing Rhythm:** Based on an 8px base unit. `stack-md (16px)` is the default internal padding for containers.

## Elevation & Depth
Depth is created through **Tonal Layering** and **Subtle Shadows**. 

- **Base Layer:** `surface-subtle` (#F8FAFC) acts as the canvas.
- **Container Layer:** `surface-container-lowest` (#ffffff) for primary cards and content blocks, featuring a 1px border in `border-muted`.
- **Elevation 1:** Use `shadow-sm` for standard cards to provide a subtle lift.
- **Elevation 2 (Hover):** Transition to `shadow-lg` with a slight color tint (`primary/5`) to indicate interactivity.
- **Overlays:** Navigation headers use a backdrop-blur (`12px`) to stay legible while maintaining context of the content scrolling beneath.

## Shapes
The shape language is **Rounded and Systematic**. 

- **Standard Containers:** `rounded-xl` (1.5rem / 24px) for dashboard cards and major sections.
- **Interactive Elements:** `rounded-lg` (1rem / 16px) for buttons, input fields, and product thumbnails.
- **Indicator Elements:** `rounded-full` (9999px) for search bars, chips, and notification badges.
- **Icons:** Use Material Symbols Outlined with a default `24px` bounding box and `400` weight.

## Components
- **Buttons:** 
    - *Primary:* Solid `primary` background with white text, `rounded-lg`.
    - *Ghost/Icon:* Circular `rounded-full` with `surface-container-high` hover states.
- **Cards (Product):** Must include a `surface-subtle` image container, price sparkline (SVG), and a "Score" badge in the top right.
- **Input Fields:** Search bars should be `rounded-full`, using `surface-container-low` background and a subtle `border-muted`. Focus state adds a 2px `primary/20` ring.
- **Chips/Badges:** Use a 10% opacity background of the semantic color (e.g., `data-positive/10`) with full-opacity text for high legibility without visual clutter.
- **Sparklines:** Real-time data should be represented by 2px stroke-width SVGs, color-coded by trend (Primary for neutral/stable, Amber for rising, Green for falling).
- **Navigation:** Side-nav items use a "Scale-down" micro-interaction on click and a `surface-container-high` background for the active state.