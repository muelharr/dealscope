'use client';

import * as React from 'react';
import { Product } from '@/types/domain';
import { ProductCard, ProductCardProps } from '@/components/shared/ProductCard';
import { Badge } from '@/components/ui/badge';

interface SearchProductCardProps extends Omit<ProductCardProps, 'product'> {
  product: Product;
  // Add search-specific props here in the future, e.g., aiVerdict
}

export function SearchProductCard({ product, ...props }: SearchProductCardProps) {
  // Mock data for search-specific UI elements.
  // In a real implementation, this would come from the `product` prop
  // if the API provided it.
  const aiVerdict = 'BUY NOW';

  return (
    <div className="relative">
      <ProductCard product={product} {...props} />
      <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
         {/* This is where search-specific badges would go */}
         <Badge variant="positive">{aiVerdict}</Badge>
      </div>
    </div>
  );
}
