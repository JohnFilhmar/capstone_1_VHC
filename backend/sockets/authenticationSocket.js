module.exports = function(socket) {

  socket.on('newMessage', (message) => {
    socket.broadcast.emit('message', `${message}`);
  });
}