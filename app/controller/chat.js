var chat = io
.of('/chat')
.on('connection', function (socket) {
  socket.emit('a message', {
    that: 'only'
    , '/chat': 'will get'
  });
  chat.emit('a message', {
    everyone: 'in'
    , '/chat': 'will get'
  });
});