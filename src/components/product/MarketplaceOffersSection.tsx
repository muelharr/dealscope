"use client";

import * as React from "react";
import { ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MarketplaceOffersSectionProps {
  className?: string;
}

export function MarketplaceOffersSection({ className }: MarketplaceOffersSectionProps) {
  const offers = [
    {
      id: "amazon",
      initial: "A",
      name: "Amazon",
      seller: "Amazon.com",
      price: "Rp 11.249.000",
      trust: "99%",
      isElite: true,
      badgeColor: "bg-ink-primary text-white",
    },
    {
      id: "bestbuy",
      initial: "B",
      name: "Best Buy",
      seller: "Best Buy Official",
      price: "Rp 11.399.000",
      trust: "98%",
      isElite: true,
      badgeColor: "bg-primary text-primary-foreground",
    },
    {
      id: "newegg",
      initial: "N",
      name: "Newegg",
      seller: "Newegg Global",
      price: "Rp 11.749.000",
      trust: "92%",
      isElite: false,
      badgeColor: "bg-[#ff6600] text-white",
    },
  ];

  return (
    <section className={cn("bg-card border border-border rounded-xl overflow-hidden shadow-sm", className)}>
      {/* Table Header block */}
      <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/20 select-none">
        <h3 className="font-sans font-bold text-base text-ink-primary">Marketplace Offers</h3>
        <span className="font-sans text-[10px] font-bold text-ink-muted uppercase tracking-wider">
          Live Data
        </span>
      </div>

      {/* Table listing */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/10 font-sans text-[10px] font-bold uppercase tracking-wider border-b border-border text-ink-muted select-none">
              <th className="px-6 py-4">Marketplace</th>
              <th className="px-6 py-4">Seller</th>
              <th className="px-6 py-4 text-right">Price</th>
              <th className="px-6 py-4">Trust</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-sans text-body-sm text-ink-primary">
            {offers.map((offer) => (
              <tr key={offer.id} className="hover:bg-muted/25 transition-colors group">
                <td className="px-6 py-4 flex items-center gap-2">
                  <div className={cn("w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold select-none", offer.badgeColor)}>
                    {offer.initial}
                  </div>
                  <span className="font-semibold">{offer.name}</span>
                </td>
                <td className="px-6 py-4 text-ink-muted">{offer.seller}</td>
                <td className="px-6 py-4 text-right font-mono font-bold">{offer.price}</td>
                <td className="px-6 py-4">
                  <div
                    className={cn(
                      "flex items-center gap-1 font-bold",
                      offer.isElite ? "text-positive" : "text-caution"
                    )}
                  >
                    {offer.isElite ? <ShieldCheck className="size-4" /> : <Info className="size-4" />}
                    <span>{offer.trust}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    className="px-4 py-1.5 h-auto rounded-full text-primary hover:bg-primary hover:text-white transition-all font-semibold font-sans text-xs border border-transparent hover:border-primary"
                  >
                    View Analysis
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
