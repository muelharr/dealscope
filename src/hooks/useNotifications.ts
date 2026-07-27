"use client";

import { useEffect, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSocket } from "@/lib/socket";
import { queryKeys } from "./queryKeys";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  NotificationItem,
} from "@/services/notification.service";

export function useNotifications() {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  // TanStack Query for notification state with 30s polling fallback when socket is disconnected
  const { data, refetch } = useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: fetchNotifications,
    refetchInterval: isConnected ? false : 30000, // 30s polling fallback if socket disconnected
  });

  const notifications = data?.items ?? [];
  const unreadCount = data?.unreadCount ?? notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onNewNotification = (notification: NotificationItem) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.info(notification.title, {
        description: notification.message,
      });
    };

    const onPriceAlertTriggered = (data: { title?: string; message?: string; productName?: string; currentPrice?: number }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success("🎉 Price Alert Triggered!", {
        description: data.message || `Price for ${data.productName} dropped to IDR ${data.currentPrice?.toLocaleString("id-ID")}`,
      });
    };

    const onNotificationUpdate = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("notification:new", onNewNotification);
    socket.on("price-alert:triggered", onPriceAlertTriggered);
    socket.on("notification:update", onNotificationUpdate);
    socket.on("notification:update-all", onNotificationUpdate);

    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("notification:new", onNewNotification);
      socket.off("price-alert:triggered", onPriceAlertTriggered);
      socket.off("notification:update", onNotificationUpdate);
      socket.off("notification:update-all", onNotificationUpdate);
    };
  }, [queryClient]);

  const markRead = useCallback(
    async (id: string) => {
      const socket = getSocket();
      if (socket.connected) {
        socket.emit("notification:read", { id }, (res: { success: boolean }) => {
          if (res?.success) {
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
          }
        });
      } else {
        await markNotificationAsRead(id);
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      }
    },
    [queryClient]
  );

  const markAllRead = useCallback(async () => {
    const socket = getSocket();
    if (socket.connected) {
      socket.emit("notification:read-all", (res: { success: boolean }) => {
        if (res?.success) {
          queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
        }
      });
    } else {
      await markAllNotificationsAsRead();
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    }
  }, [queryClient]);

  return {
    notifications,
    unreadCount,
    isConnected,
    markRead,
    markAllRead,
    refetch,
  };
}
