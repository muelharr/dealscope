import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

let socket: Socket | null = null;

/**
 * Obtain or initialize the Socket.io client connection to /notifications namespace
 */
export function getSocket(token?: string): Socket {
  if (!socket) {
    const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("dealscope_token") : undefined);

    socket = io(`${SOCKET_URL}/notifications`, {
      auth: {
        token: authToken ? `Bearer ${authToken}` : undefined,
      },
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on("connect", () => {
      console.log("[WebSocket] Connected to /notifications namespace. Socket ID:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("[WebSocket] Disconnected from /notifications namespace. Reason:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("[WebSocket] Connection error:", error.message);
    });
  }

  return socket;
}

/**
 * Re-authenticate socket with a new JWT token
 */
export function updateSocketToken(newToken: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("dealscope_token", newToken);
  }

  if (socket) {
    socket.auth = { token: `Bearer ${newToken}` };
    if (socket.connected) {
      socket.disconnect().connect();
    } else {
      socket.connect();
    }
  } else {
    getSocket(newToken);
  }
}

/**
 * Gracefully disconnect socket on user logout
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
