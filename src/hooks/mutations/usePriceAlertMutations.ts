"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { priceAlertService } from '@/services/priceAlert.service';

export function useCreatePriceAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      targetPrice,
      targetDiscountPercentage,
    }: {
      productId: string;
      targetPrice?: number | null;
      targetDiscountPercentage?: number | null;
    }) => priceAlertService.createAlert(productId, targetPrice, targetDiscountPercentage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priceAlerts', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useTogglePriceAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isEnabled }: { id: string; isEnabled: boolean }) =>
      priceAlertService.toggleAlert(id, isEnabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priceAlerts', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeletePriceAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => priceAlertService.deleteAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priceAlerts', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
