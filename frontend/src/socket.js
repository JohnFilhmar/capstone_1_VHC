import { io } from 'socket.io-client';
import config from './config';

const URL = config.REACT_APP_PROJECT_STATE === 'production' ? config.REACT_APP_PRODUCTION_BACKEND_BASE_URL : config.REACT_APP_DEVELOPMENT_BACKEND_BASE_URL;

const initializeSocket = () => {
  const socket = io(URL, {
    reconnection: true,
    reconnectionDelay: 15000,
    reconnectionDelayMax: 10000,
    reconnectionAttempts: 20,
    secure: true,
    autoConnect: true,
  });
  socket.on('connect_error', (err) => {
    console.error(`Connection error: ${err}`);
  });
  return socket;
};

export const socket = initializeSocket();
