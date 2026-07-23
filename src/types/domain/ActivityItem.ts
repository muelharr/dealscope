
export interface ActivityItem {
  id: string;
  type: 'search' | 'wishlist' | 'compare' | 'alert';
  summary: string;
  timestamp: string;
  link?: string;
}
