const dbModel = require('../models/database_model');

module.exports = function(socket) {
  // Connection event
  // socket.on('connect', () => {
  //   // console.log(`Client with socket_id ${socket.id} has connected`);
  // });

  // // Disconnection event
  // socket.on('disconnect', (reason) => {
  //   // console.log(`Client with socket_id ${socket.id} has disconnected. Reason: ${reason}`);
  // });

  // // Connection error event
  // socket.on('connect_error', (error) => {
  //   // console.error(`Connection error for socket_id ${socket.id}: ${error.message}`);
  // });

  // // Connection timeout event
  // socket.on('connect_timeout', () => {
  //   console.warn(`Connection attempt timed out for socket_id ${socket.id}`);
  // });

  // // Reconnection event
  // socket.on('reconnect', (attemptNumber) => {
  //   // console.log(`Client with socket_id ${socket.id} reconnected successfully after ${attemptNumber} attempts`);
  // });

  // // Reconnection attempt event
  // socket.on('reconnect_attempt', (attemptNumber) => {
  //   // console.log(`Reconnection attempt #${attemptNumber} for socket_id ${socket.id}`);
  // });

  // // Reconnecting event (alias for reconnect attempt)
  // socket.on('reconnecting', (attemptNumber) => {
  //   // console.log(`Client with socket_id ${socket.id} is attempting to reconnect (attempt #${attemptNumber})`);
  // });

  // // Reconnect error event
  // socket.on('reconnect_error', (error) => {
  //   // console.error(`Reconnection error for socket_id ${socket.id}: ${error.message}`);
  // });

  // // Reconnect failed event (after all attempts fail)
  // socket.on('reconnect_failed', () => {
  //   console.warn(`All reconnection attempts failed for socket_id ${socket.id}`);
  // });

  // // Ping event (sent to server to measure latency)
  // socket.on('ping', () => {
  //   // console.log(`Ping sent to server by socket_id ${socket.id}`);
  // });

  // // Pong event (response from server with latency)
  // socket.on('pong', (latency) => {
  //   // console.log(`Pong received by socket_id ${socket.id} with latency: ${latency}ms`);
  // });

  // // General error event
  // socket.on('error', (error) => {
  //   // console.error(`Error on socket_id ${socket.id}: ${error.message}`);
  // });
};
