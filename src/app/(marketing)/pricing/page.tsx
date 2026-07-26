"use client";

import * as React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-container px-4 py-16 lg:px-8 text-center flex flex-col items-center">
      {/* Page Header */}
      <h1 className="font-sans font-bold text-4xl tracking-tight text-ink-primary">
        Smart Shopping Plans for Everyone
      </h1>
      <p className="mt-3 text-lg text-ink-muted max-w-xl">
        Get premium shopping intelligence tools to help you save more on every single purchase.
      </p>

      {/* Pricing Cards 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl w-full text-left items-stretch">
        {/* 1. Free Tier */}
        <Card className="border border-border bg-surface shadow-sm rounded-2xl p-6 flex flex-col justify-between">
          <CardContent className="p-0 flex flex-col h-full justify-between">
            <div>
              <span className="text-xs font-bold font-sans text-ink-muted uppercase tracking-wider">Free</span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="font-mono font-bold text-4xl text-ink-primary">$0</span>
                <span className="text-sm text-ink-muted font-sans">/mo</span>
              </div>
              <p className="mt-3 text-xs text-ink-muted leading-relaxed">
                Essential deal score checks and search capabilities.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-ink-primary">
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-positive shrink-0" />
                  <span>Up to 10 active tracks</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-positive shrink-0" />
                  <span>Daily price refreshes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-positive shrink-0" />
                  <span>Browser extension access</span>
                </li>
                <li className="flex items-center gap-2.5 text-ink-muted/50 line-through">
                  <XCircle className="h-4 w-4 text-ink-muted/40 shrink-0" />
                  <span>AI Deal Insights</span>
                </li>
              </ul>
            </div>

            <Button variant="outline" className="w-full mt-8 h-11 font-sans font-bold text-xs uppercase tracking-wider rounded-xl border-border">
              Start for Free
            </Button>
          </CardContent>
        </Card>

        {/* 2. Pro Tier (Featured) */}
        <Card className="border-2 border-primary bg-surface shadow-xl rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden transform md:-translate-y-2">
          <Badge className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            MOST POPULAR
          </Badge>
          <CardContent className="p-0 flex flex-col h-full justify-between">
            <div>
              <span className="text-xs font-bold font-sans text-primary uppercase tracking-wider">Pro Intelligence</span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="font-mono font-bold text-4xl text-ink-primary">$12</span>
                <span className="text-sm text-ink-muted font-sans">/mo</span>
              </div>
              <p className="mt-3 text-xs text-ink-muted leading-relaxed">
                Precision price tracking & AI analysis for serious shoppers.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-ink-primary">
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>Unlimited active tracks</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>Real-time price drop alerts</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>AI Market Opportunity Insights</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>Priority Push & Email Alerts</span>
                </li>
              </ul>
            </div>

            <Button className="w-full mt-8 h-11 bg-primary text-primary-foreground font-sans font-bold text-xs uppercase tracking-wider rounded-xl shadow-md">
              Go Pro Now
            </Button>
          </CardContent>
        </Card>

        {/* 3. Elite Tier */}
        <Card className="border border-border bg-surface shadow-sm rounded-2xl p-6 flex flex-col justify-between">
          <CardContent className="p-0 flex flex-col h-full justify-between">
            <div>
              <span className="text-xs font-bold font-sans text-ink-muted uppercase tracking-wider">Elite Reseller</span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="font-mono font-bold text-4xl text-ink-primary">$29</span>
                <span className="text-sm text-ink-muted font-sans">/mo</span>
              </div>
              <p className="mt-3 text-xs text-ink-muted leading-relaxed">
                Advanced market data for volume buyers & power users.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-ink-primary">
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-positive shrink-0" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-positive shrink-0" />
                  <span>API Data Access & Export</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-positive shrink-0" />
                  <span>Historical Price CSV Exports</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-positive shrink-0" />
                  <span>24/7 Dedicated Support</span>
                </li>
              </ul>
            </div>

            <Button variant="outline" className="w-full mt-8 h-11 font-sans font-bold text-xs uppercase tracking-wider rounded-xl border-border">
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Social Proof Stats Banner */}
      <div className="mt-16 bg-secondary/50 rounded-2xl p-8 border border-border max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h2 className="font-sans font-bold text-2xl text-ink-primary">Unrivaled Market Visibility</h2>
          <p className="text-xs text-ink-muted mt-1 max-w-lg">
            Join thousands of smart shoppers scanning connected marketplaces every minute.
          </p>
        </div>

        <div className="flex items-center gap-8 shrink-0">
          <div>
            <div className="font-mono text-2xl font-bold text-primary">50k+</div>
            <div className="text-[11px] font-sans text-ink-muted uppercase tracking-wider">Active Users</div>
          </div>
          <div className="h-8 w-px bg-border"></div>
          <div>
            <div className="font-mono text-2xl font-bold text-positive">$12M</div>
            <div className="text-[11px] font-sans text-ink-muted uppercase tracking-wider">User Savings</div>
          </div>
        </div>
      </div>
    </div>
  );
}
