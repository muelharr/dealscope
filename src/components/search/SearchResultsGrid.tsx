import { Product } from '@/types/domain';
import { cn } from "@/lib/utils";
import { SearchProductCard } from './SearchProductCard';

export interface SearchResultsGridProps {
  products: Product[];
  favoritedIds?: string[];
  onFavoriteToggle?: (id: string) => void;
  className?: string;
}

export function SearchResultsGrid({
  products,
  favoritedIds = [],
  onFavoriteToggle,
  className,
}: SearchResultsGridProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {products.map((product) => (
        <SearchProductCard
          key={product.id}
          product={product}
          isWishlisted={favoritedIds.includes(product.id)}
          onWishlist={onFavoriteToggle}
          // Pass other props as needed
        />
      ))}
    </div>
  );
}
