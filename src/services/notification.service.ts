export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  status: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationResponse {
  items: NotificationItem[];
  unreadCount: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export async function fetchNotifications(): Promise<NotificationResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("dealscope_token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE_URL}/notifications`, { headers });
    if (!res.ok) {
      throw new Error(`Failed to fetch notifications: ${res.statusText}`);
    }
    const data = await res.json();
    return data.data || { items: [], unreadCount: 0 };
  } catch {
    return { items: [], unreadCount: 0 };
  }
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  const token = typeof window !== "undefined" ? localStorage.getItem("dealscope_token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers,
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function markAllNotificationsAsRead(): Promise<boolean> {
  const token = typeof window !== "undefined" ? localStorage.getItem("dealscope_token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: "PATCH",
      headers,
    });
    return res.ok;
  } catch {
    return false;
  }
}
