# Component Guide

This guide documents reusable components in the DealScope project.

## Shared UI Primitives
- **Button:** Standard action trigger. Use `variant` prop for styling.
- **Badge:** Status tags. Use `variant` for semantic colors.
- **Card:** Base container for bento boxes.

## Feature Components
- **DashboardSection:** Reusable shell for dashboard panels.
  - *Props:* `title`, `icon`, `headerAction`, `children`.
- **SearchResultCard:** Displays product summary, sparkline, and AI analysis.
- **ComparisonMatrix:** Side-by-side data comparison table.
- **WishlistCard:** Individual card displaying product metadata and price trends.
