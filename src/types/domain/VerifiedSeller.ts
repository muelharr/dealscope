export interface VerifiedSeller {
  id: string;
  name: string;
  marketplace: string;
  trustScore: number;
  rating: number;
  verified: boolean;
  shipping: string;
  isOutOfStock?: boolean;
}
