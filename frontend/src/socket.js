import { io } from "socket.io-client";
import config from "./config";

const URL =
  config.REACT_APP_PROJECT_STATE === "production"
    ? config.REACT_APP_PRODUCTION_BACKEND_WEBSOCKET
    : config.REACT_APP_DEVELOPMENT_BACKEND_WEBSOCKET;

const initializeSocket = () => {
  const socket = io(URL, {
    reconnection: true,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    secure: true,
    autoConnect: true,
    transports: ["websocket"],
    withCredentials: true,
    auth: {
      token: config.REACT_APP_SECRET
    }
  });
  socket.on("connect_error", (err) => {
    console.error(`Connection error: ${err}`);
  });
  return socket;
};

export const socket = initializeSocket();