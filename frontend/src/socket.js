import { io } from "socket.io-client";
import config from "./config";
// import { openDB } from "idb";

const URL =
  config.REACT_APP_PROJECT_STATE === "production"
    ? config.REACT_APP_PRODUCTION_BACKEND_WEBSOCKET
    : config.REACT_APP_DEVELOPMENT_BACKEND_WEBSOCKET;
    
// const dbPromise = openDB("Database", undefined, {
//   upgrade(db) {
//     ["tokens"].forEach((storeName) => {
//       if (!db.objectStoreNames.contains(storeName)) {
//         db.createObjectStore(storeName);
//       }
//     });
//   },
// });
// const getAllItems = async () => {
//   try {
//     const db = await dbPromise;
//     const tx = db.transaction("tokens", "readonly");
//     const store = tx.objectStore("tokens");
//     const keys = await store.getAllKeys();
//     const values = await store.getAll();
//     await tx.done;
//     const result = {};
//     keys.forEach((key, index) => {
//       result[key] = values[index];
//     });
//     return result;
//   } catch (error) {
//     console.error("Failed to get all items:", error);
//   }
// };

const initializeSocket = () => {
  const socket = io(URL, {
    reconnection: true,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    secure: true,
    autoConnect: true,
  });
  socket.on("connect_error", (err) => {
    console.error(`Connection error: ${err}`);
  });
  return socket;
};

export const socket = initializeSocket();

/* 
const initializeSocket = async () => {
  const { accessToken } = await getAllItems();
  if (accessToken) {
    const socket = io(URL, {
      reconnection: true,
      reconnectionDelay: 15000,
      reconnectionDelayMax: 10000,
      reconnectionAttempts: 20,
      secure: true,
      autoConnect: true,
      transports: ["websocket"],
      withCredentials: true,
      extraHeaders: {
        Authorization: Bearer ${accessToken},
      },
    });
    socket.on("connect_error", (err) => {
      console.error(Connection error: ${err});
    });
    return socket;
  }
  return null;
};

export const socket = await initializeSocket();
*/