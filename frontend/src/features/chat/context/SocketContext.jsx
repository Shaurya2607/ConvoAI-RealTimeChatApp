import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { io } from "socket.io-client";
import { useAuth } from "../../auth/context/AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [socket, setSocket] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const [typingUser, setTypingUser] = useState(null);

  const [connectionStatus, setConnectionStatus] =
    useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const socketUrl = import.meta.env.VITE_API_URL.replace(
      "/api",
      ""
    );

    const newSocket = io(socketUrl, {
      auth: {
        token: localStorage.getItem("token"),
      },
      transports: ["websocket"],
    });

    setSocket(newSocket);

    // ==========================
    // Connected
    // ==========================

    newSocket.on("connect", () => {
      console.log("✅ Socket Connected");
      setConnectionStatus(true);
    });

    // ==========================
    // Disconnected
    // ==========================

    newSocket.on("disconnect", () => {
      console.log("❌ Socket Disconnected");
      setConnectionStatus(false);
    });

    // ==========================
    // Online Users
    // ==========================

    newSocket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    // ==========================
    // Typing
    // ==========================

    newSocket.on("typing", (user) => {
      setTypingUser(user);
    });

    // ==========================
    // Stop Typing
    // ==========================

    newSocket.on("stopTyping", () => {
      setTypingUser(null);
    });

    return () => {
      newSocket.removeAllListeners();
      newSocket.disconnect();

      setSocket(null);
      setOnlineUsers([]);
      setTypingUser(null);
      setConnectionStatus(false);
    };
  }, [isAuthenticated]);

  // ==========================
  // Helper Functions
  // ==========================

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  const getConnectionStatus = () => {
    return connectionStatus;
  };

  return (
    <SocketContext.Provider
      value={{
        socket,

        onlineUsers,

        typingUser,

        connectionStatus,

        isUserOnline,

        getConnectionStatus,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};