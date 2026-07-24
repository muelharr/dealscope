# DealScope Design System

This document is the single source of truth for the DealScope design foundation and standardization system. All components, layouts, and style updates must adhere to the rules outlined below.

---

## 1. Brand Philosophy
DealScope is a premium, data-dense Shopping Intelligence and Price Analytics platform.
*   **Visual Tone**: Structured, analytical, clean, and highly legible. It avoids excess decoration or generic consumer "fluff" in favor of dense layouts, clear charts, and structured metrics grids.
*   **Core Purpose**: To deliver instant, actionable data insights—such as Price Intelligence, Deal Confidence, and historical tracking—with zero clutter.

---

## 2. Design Principles
*   **Data Density & Legibility**: Information should be compact but easily readable. Margins, text spacing, and layouts are designed to make tables, sparklines, and metric sheets readable at a glance.
*   **Consistency over Polish**: Visual details (gaps, border radii, shadows, typography hierarchies) must be standardized. There should never be two different visual styles for the same concept.
*   **Accessibility as a Priority**: Readable contrast in both light and dark modes, explicit keyboard focus rings, and screen-reader tags (ARIA) are required for all interactive elements.
*   **Composition over Configuration**: Do not build giant monolithic elements with complex parameter logic. Instead, compose interfaces out of smaller, reusable building blocks.

---

## 3. Color Palette

### Light Mode Variables
| Variable | Value | Description |
| :--- | :--- | :--- |
| `--paper` | `#F8FAFC` | Page background color |
| `--surface` | `#ffffff` | Card and modular container background |
| `--border-custom` | `#E2E8F0` | Default border separator line color |
| `--border-interactive` | `#c2c6d8` | Interactive border color (inputs/select elements) |
| `--ink-primary` | `#191b24` | Primary high-contrast text |
| `--ink-muted` | `#727687` | Muted descriptions and secondary text labels |
| `--accent-custom` | `#0050cb` | Primary brand accent color |
| `--accent-subtle` | `#0066ff` | Hover interactive highlight color |
| `--positive` | `#10B981` | Success metrics, price drops, positive ratings |
| `--caution` | `#F59E0B` | Warning states, price hikes, neutral trends |
| `--negative` | `#EF4444` | Price spikes, high trust alert states, inventory issues |
| `--ai-bg` | `#F5F3FF` | Background color for AI assistant widget |
| `--ai-border` | `#E9D5FF` | Border color for AI assistant widget |

### Dark Mode Variables (Corrected Contrast)
| Variable | Value | Description |
| :--- | :--- | :--- |
| `--paper` | `#2e303a` | Dark page background |
| `--surface` | `#20222a` | Dark container surface (resolves readability contrast issues) |
| `--border-custom` | `#383b48` | Dark mode separator line color |
| `--border-interactive` | `#4d5162` | Interactive elements boundary color |
| `--ink-primary` | `#eff0fd` | High-contrast text on dark backgrounds |
| `--ink-muted` | `#9da1b0` | Secondary description and meta-text (resolves low contrast issues) |
| `--accent-custom` | `#b3c5ff` | Primary brand highlight in dark mode |
| `--accent-subtle` | `#003fa4` | Dark mode interactive accent color |
| `--positive` | `#10B981` | Success metrics |
| `--caution` | `#F59E0B` | Warning states |
| `--negative` | `#EF4444` | High-risk elements |
| `--ai-bg` | `#1E1B4B` | Dark AI assistant background |
| `--ai-border` | `#581C87` | Dark AI assistant boundary |

---

## 4. Typography Scale

Fonts are structured to scale consistently using standard sizes:
*   **Micro Label** (`text-[9px] font-bold uppercase tracking-wider`): Used for brand headers, sub-badges, and sparkline subtitles.
*   **Extra Small** (`text-xs`): Used for helper text, details tables metadata, and small labels.
*   **Body Small** (`text-sm`): Default reading size for table content, paragraph blocks, and text inputs.
*   **Body Medium** (`text-base`): Main text body, menu links, and actions items.
*   **Headline Small** (`text-lg font-bold`): Standard sub-section titles, dialog headers, and small card headers.
*   **Headline Medium** (`text-xl font-bold` or `text-2xl font-bold`): Main page subtitles and widget headers.
*   **Headline Large** (`text-3xl font-bold`): Main page titles and analytics overview labels.
*   **Display Large** (`text-4xl font-bold` to `text-6xl font-bold`): Hero typography on landing pages.

---

## 5. Spacing Scale

To maintain a consistent layout layout, all padding, margins, and gaps must follow the spacing scale below:
*   `--spacing-1` (`4px` / `space-1`): Micro offsets, badge borders.
*   `--spacing-2` (`8px` / `space-2`): Small input borders, sub-elements.
*   `--spacing-3` (`12px` / `space-3`): Button content gaps, badge margins.
*   `--spacing-4` (`16px` / `space-4`): Card inner padding, list item gaps, small widget padding.
*   `--spacing-6` (`24px` / `space-6`): Layout column gaps, card spacing, standard container padding.
*   `--spacing-8` (`32px` / `space-8`): Large section dividers, marketing banners.

---

## 6. Border Radius

*   `rounded-sm` (`4px`): Micro inputs, checkboxes, detail rows highlight.
*   `rounded-md` (`8px`): Small buttons, interactive items, active navigation pills.
*   `rounded-lg` (`12px`): Input containers, textareas, main navigation dropdown cards.
*   `rounded-xl` (`16px`): Primary card containers, dashboard widget cards.
*   `rounded-full`: Badges, tags, filter buttons, search history pills.

---

## 7. Elevation (Shadow Rules)

*   `shadow-sm`: Default card boundary shadow in light mode.
*   `shadow-md`: Interactive card hover state shadow.
*   `shadow-lg`: Popover displays and center screen modals.
*   `shadow-none`: Dark mode container state (all separation is handled by borders).

---

## 8. Motion Guidelines

*   **Standard Transition**: `transition-all duration-200 ease-in-out` is used for all theme switches, button hovers, and focus transitions.
*   **Click Scale Effect**: `active:scale-98` is applied to primary buttons and tabs to provide clear interaction feedback.
*   **Reduced Motion**: Respect client-side system configurations by disabling translations:
    `motion-reduce:transform-none motion-reduce:transition-none`

---

## 9. Container Width & Responsive Breakpoints

*   **Max Container Width**: `max-w-container` (defined as `1280px`).
*   **Responsive Breakpoints**:
    *   `sm`: `640px`
    *   `md`: `768px`
    *   `lg`: `1024px` (Main desktop layouts toggle - sidebar shifts from drawers to sticky sidebar).
    *   `xl`: `1280px`

---

## 10. Accessibility (A11y) Guidelines

*   **Focus Ring**: All interactive inputs, buttons, and custom triggers must show a focus ring when active:
    `focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none`
*   **Contrast Standards**: Contrast must be at least WCAG AA compliance (4.5:1 ratio for regular text, 3:1 for large text).
*   **ARIA Accessibility**: Icons must use `aria-hidden="true"`, and screen reader labels (`aria-label`) are required on icon-only buttons (such as the favorites toggle and close buttons).

---

## 11. Component Hierarchy & Conventions

Component folders are structured to group elements by layout type, and file names must use PascalCase (e.g. `ProductCard.tsx`):
*   `src/components/ui/`: Base layout elements (e.g., `button.tsx`, `badge.tsx`, `card.tsx`).
*   `src/components/layout/`: Global navigation containers (`Sidebar.tsx`, `Navbar.tsx`, `Footer.tsx`).
*   `src/components/shared/`: Reusable multi-page components (`ProductCard.tsx`, `WidgetError.tsx`).

---

## 12. Reuse & Registry Rules

*   **Never Duplicate**: Writing multiple versions of the same component (such as separate skeletons or widgets) is prohibited. Extend standard components through composition.
*   **Registry Requirement**: Any new shared component must be documented in the Reusable Component Registry below.

---

## 13. Reusable Component Registry

### Reusable Primitives Registry Catalog

#### 1. `PriceSparkline`
*   **Purpose**: Renders a compact, SVG line chart showing a 90-day price trend.
*   **Responsibilities**: Processes historical values and maps trend vectors to positive (falling prices) or caution (rising prices) colors.
*   **Props (Public API)**:
    *   `prices: number[]` - Historical pricing data.
    *   `width: number` - Pixels layout width.
    *   `height: number` - Pixels layout height.
    *   `trend: "rising" | "falling"` - Trend indicator.
*   **Composition**: Nested within the product cards structure.

#### 2. `DealScore`
*   **Purpose**: Visual confidence score badge.
*   **Responsibilities**: Maps confidence percentage to corresponding colors (positive for scores 80+, caution for scores 50-79, negative for scores < 50).
*   **Props**:
    *   `score: number` - Score value (0-100).
    *   `className?: string` - Layout styling overrides.
*   **Composition**: Nested within media and headers wrappers.

---

## 14. Component Inventory

Below is the classification of all existing UI components in the codebase as of Phase 1.5, which guides all future refactoring and deprecation strategies:

### Reusable Components (To Be Retained)
*   `PriceSparkline` (`src/components/shared/PriceSparkline.tsx`): Shared trend mini-sparkline component.
*   `DealScore` (`src/components/shared/DealScore.tsx`): Shared confidence badge.
*   `MarketplaceOfferList` (`src/components/shared/MarketplaceOfferList.tsx`): List wrapper for third-party marketplace offers.
*   `OfferRow` (`src/components/shared/OfferRow.tsx`): Individual merchant row template.
*   `SearchBar` (`src/components/search/SearchBar.tsx`): Search input box logic.
*   `SearchFilters` (`src/components/search/SearchFilters.tsx`): Sidebar facets panel for search query adjustments.
*   `SearchResultsGrid` (`src/components/search/SearchResultsGrid.tsx`): Standard multi-column results display wrapper.
*   `SearchResultsHeader` (`src/components/search/SearchResultsHeader.tsx`): Header showing query summary and count labels.
*   `SearchResultsSkeleton` (`src/components/search/SearchResultsSkeleton.tsx`): Grid loading state skeleton.
*   `WishlistAddCard` (`src/components/wishlist/WishlistAddCard.tsx`): Card to select lists to append item.
*   `WishlistEmptyState` (`src/components/wishlist/WishlistEmptyState.tsx`): State displayed when user wishlist database query returns empty.
*   `WishlistGrid` (`src/components/wishlist/WishlistGrid.tsx`): Multi-column dashboard-aligned container.
*   `WishlistHeader` (`src/components/wishlist/WishlistHeader.tsx`): Header element showing favorites statistics.
*   `WishlistSkeleton` (`src/components/wishlist/WishlistSkeleton.tsx`): Loading placeholder grid items.

### Duplicate Components (To Be Standardized & Merged)
*   `DashboardWidgetError` (`src/components/dashboard/DashboardWidgetError.tsx`)
*   `SearchError` (`src/components/search/SearchError.tsx`)
*   `WishlistError` (`src/components/wishlist/WishlistError.tsx`)
*   `ComparisonError` (`src/components/comparison/ComparisonError.tsx`)
    *   *Standardization Path*: In Phase 3, consolidate all page-specific error states into a single unified `WidgetError` component located in `src/components/shared/WidgetError.tsx`.

### Legacy Components (Standardize styling variables in place)
*   `AIComparisonInsights` (`src/components/comparison/AIComparisonInsights.tsx`)
*   `ComparisonMatrix` (`src/components/comparison/ComparisonMatrix.tsx`)
*   `ComparisonSummaryCards` (`src/components/comparison/ComparisonSummaryCards.tsx`)
*   `MarketplaceComparisonSection` (`src/components/comparison/MarketplaceComparisonSection.tsx`)
*   `PriceHistoryComparisonSection` (`src/components/comparison/PriceHistoryComparisonSection.tsx`)
*   `SelectedProductsSection` (`src/components/comparison/SelectedProductsSection.tsx`)
*   `AISummarySection` (`src/components/product/AISummarySection.tsx`)
*   `MarketplaceOffersSection` (`src/components/product/MarketplaceOffersSection.tsx`)
*   `PriceHistorySection` (`src/components/product/PriceHistorySection.tsx`)
*   `PriceOverviewSection` (`src/components/product/PriceOverviewSection.tsx`)
*   `SimilarProductsSection` (`src/components/product/SimilarProductsSection.tsx`)
*   `SpecificationsSection` (`src/components/product/SpecificationsSection.tsx`)
*   `VerifiedSellersSection` (`src/components/product/VerifiedSellersSection.tsx`)
*   `KeyMetrics` (`src/components/dashboard/widgets/KeyMetrics.tsx`)
*   `Activity` (`src/components/dashboard/widgets/Activity.tsx`)
*   `Insights` (`src/components/dashboard/widgets/Insights.tsx`)
*   `Watchlist` (`src/components/dashboard/widgets/Watchlist.tsx`)

### Deprecated Components (Scheduled for Deletion)
*   `WishlistCard` (`src/components/wishlist/WishlistCard.tsx`): Standardized in Phase 2 using composite `ProductCard`.
*   `SearchProductCard` (`src/components/search/SearchProductCard.tsx`): Replaced in Phase 2 with polymorphic `ProductCard`.
*   `SearchResultCard` (`src/components/search/SearchResultCard.tsx`): Orphaned card, replaced by `ProductCard` in Phase 2.
