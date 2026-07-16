import React from "react";
import ReactDOM from "react-dom/client";

// App
import App from "./App";

// Context Providers
import { AuthProvider } from "./features/auth/context/AuthContext";
import { SocketProvider } from "./features/chat/context/SocketContext";
import { ConversationProvider } from "./features/chat/context/ConversationContext";

// Toast
import { Toaster } from "react-hot-toast";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

// Global Styles
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/typography.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <ConversationProvider>
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
              success: {
                iconTheme: {
                  primary: "#10B981",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#EF4444",
                  secondary: "#fff",
                },
              },
            }}
          />

          <App />
        </ConversationProvider>
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
);