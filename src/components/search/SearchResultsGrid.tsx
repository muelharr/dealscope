import { Product } from '@/types/domain';
import { cn } from "@/lib/utils";
import { ProductCard } from '@/components/shared/ProductCard';

export interface SearchResultsGridProps {
  products: Product[];
  favoritedIds?: string[];
  onFavoriteToggle?: (id: string) => void;
  onCompareToggle?: (id: string) => void;
  comparedIds?: string[];
  className?: string;
}

export function SearchResultsGrid({
  products,
  favoritedIds = [],
  onFavoriteToggle,
  onCompareToggle,
  comparedIds = [],
  className,
}: SearchResultsGridProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isWishlisted={favoritedIds.includes(product.id)}
          onWishlist={onFavoriteToggle}
          onCompare={onCompareToggle}
          isCompared={comparedIds.includes(product.id)}
          aiVerdict="BUY NOW"
        />
      ))}
    </div>
  );
}
