import { io } from 'socket.io-client';

const configuredApiUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  '';

const derivedHost = configuredApiUrl ? configuredApiUrl.replace(/\/api\/?$/, '') : '';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || derivedHost || 'http://localhost:5000';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('[Socket.IO] Connected to backend server:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket.IO] Disconnected from server:', reason);
    });

    socket.on('connect_error', (err) => {
      // Graceful silence on connection error if backend is offline
    });
  }
  return socket;
};

export const getSocket = () => socket || initSocket();

export const joinChatRoom = (repairId) => {
  const s = getSocket();
  if (s && s.connected) {
    s.emit('join:room', repairId);
  }
};

export const leaveChatRoom = (repairId) => {
  const s = getSocket();
  if (s && s.connected) {
    s.emit('leave:room', repairId);
  }
};
