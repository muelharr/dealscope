"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SearchBar } from "@/components/search/SearchBar";
import { SearchFilters, FilterState } from "@/components/search/SearchFilters";
import { SearchResultsHeader, ActiveFilter } from "@/components/search/SearchResultsHeader";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { SearchResultsGrid } from "@/components/search/SearchResultsGrid";
import { SearchResultsSkeleton } from '@/components/search/SearchResultsSkeleton';
import { SearchError } from '@/components/search/SearchError';
import { EmptyState } from '@/components/ui/empty-state';
import { Search as SearchIcon } from 'lucide-react';

import { useSearchProducts } from '@/hooks/queries/useSearchProducts';
import { SearchRequestParams } from '@/types/api/requests';

export default function SearchPage() {
  return (
    <React.Suspense fallback={<SearchResultsSkeleton />}>
      <Search />
    </React.Suspense>
  );
}

function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = React.useMemo((): SearchRequestParams => {
    return {
      search_query: searchParams.get('q') ?? 'RTX 5070',
      marketplace: searchParams.getAll('market'),
      brand_id: searchParams.getAll('brand'),
      price_min: Number(searchParams.get('price_min')) || undefined,
      price_max: Number(searchParams.get('price_max')) || undefined,
      sort_by: (searchParams.get('sort_by') as SearchRequestParams['sort_by']) ?? 'best_deal',
      page: Number(searchParams.get('page')) || 1,
    };
  }, [searchParams]);

  const {
    products,
    pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useSearchProducts(params);

  const updateSearchParams = React.useCallback(
    (newParams: Partial<SearchRequestParams>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
          current.delete(key);
        } else if (Array.isArray(value)) {
          current.delete(key);
          value.forEach(v => current.append(key, v));
        } else {
          current.set(key, String(value));
        }
      });

      if (!('page' in newParams)) {
        current.set('page', '1');
      }

      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.push(`${pathname}${query}`);
    },
    [pathname, router, searchParams],
  );

  const handleSearch = (query: string) => {
    updateSearchParams({ search_query: query });
  };

  const handleApplyFilters = (filters: FilterState) => {
     updateSearchParams({
        marketplace: filters.marketplaces,
        brand_id: filters.brands,
        price_min: Number(filters.minPrice) || undefined,
        price_max: Number(filters.maxPrice) || undefined,
     });
  };

  const handleRemoveFilter = (filterId: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (filterId.startsWith('market-')) {
      const marketToRemove = filterId.replace('market-', '');
      const markets = current.getAll('market').filter((m) => m !== marketToRemove);
      current.delete('market');
      markets.forEach((m) => current.append('market', m));
    } else if (filterId.startsWith('brand-')) {
      const brandToRemove = filterId.replace('brand-', '');
      const brands = current.getAll('brand').filter((b) => b !== brandToRemove);
      current.delete('brand');
      brands.forEach((b) => current.append('brand', b));
    } else if (filterId === 'priceRange') {
      current.delete('price_min');
      current.delete('price_max');
    }

    current.set('page', '1');
    router.push(`${pathname}?${current.toString()}`);
  };

  const handleSortChange = (sortBy: string) => {
    updateSearchParams({ sort_by: sortBy as SearchRequestParams['sort_by'] });
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page });
  };

  const getHeaderFilters = React.useCallback((): ActiveFilter[] => {
    const list: ActiveFilter[] = [];
    const { marketplace, brand_id, price_min, price_max } = params;

    const markets = Array.isArray(marketplace) ? marketplace : [marketplace].filter(Boolean);
    for (const market of markets) {
      list.push({ id: `market-${market}`, label: market as string});
    }

    const brands = Array.isArray(brand_id) ? brand_id : [brand_id].filter(Boolean);
    for (const brand of brands) {
      list.push({ id: `brand-${brand}`, label: `Brand: ${brand as string}` });
    }

    if (price_min || price_max) {
      const minStr = price_min ? `$${price_min}` : '$0';
      const maxStr = price_max ? `$${price_max}` : 'Any';
      list.push({ id: 'priceRange', label: `Price: ${minStr}-${maxStr}` });
    }

    return list;
  }, [params]);

  return (
    <div className="flex flex-col gap-spacing-6 w-full max-w-container mx-auto">
      <div className="flex flex-col gap-spacing-2">
        <h1 className="font-sans font-bold text-3xl tracking-tight text-ink-primary">Search</h1>
        <p className="text-ink-muted text-body-md">Find products and compare prices across all connected marketplaces.</p>
      </div>

      <div className="w-full">
        <SearchBar onSearch={handleSearch} defaultValue={params.search_query} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-spacing-6 items-start mt-spacing-4">
        <div className="md:col-span-1">
          <SearchFilters onApplyFilters={handleApplyFilters} />
        </div>

        <div className="md:col-span-3 space-y-6">
          <SearchResultsHeader
            count={pagination?.total ?? 0}
            query={params.search_query}
            activeFilters={getHeaderFilters()}
            onRemoveFilter={handleRemoveFilter}
            sortBy={params.sort_by ?? 'best_deal'}
            onSortChange={handleSortChange}
            isFetching={isFetching}
          />

          <div className="pt-4">
            {isLoading ? (
              <SearchResultsSkeleton />
            ) : isError ? (
              <SearchError error={error as Error} onRetry={refetch} />
            ) : products.length > 0 ? (
              <SearchResultsGrid products={products} />
            ) : (
              <EmptyState
                icon={SearchIcon}
                title="No products found"
                description="Try adjusting your search query or filters to find what you're looking for."
              />
            )}
            {pagination && pagination.totalPages > 1 && !isLoading && !isError && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); handlePageChange(pagination.currentPage - 1); }}
                      className={pagination.currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">{pagination.currentPage}</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); handlePageChange(pagination.currentPage + 1); }}
                      className={pagination.currentPage === pagination.totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
