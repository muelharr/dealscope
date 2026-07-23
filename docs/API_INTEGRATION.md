# API Integration Guide

This document outlines backend integration strategies.

## Endpoints
- `GET /api/wishlist`: Fetch user wishlist.
- `DELETE /api/wishlist/:id`: Remove item.
- `GET /api/notifications`: Fetch alerts.
- `PATCH /api/notifications/:id`: Mark read.

## TanStack Query Strategy
All data-fetching components should use TanStack Query hooks to handle caching, background refetching, and optimistic UI updates for removal actions.
