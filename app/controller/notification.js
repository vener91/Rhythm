/**
* Notification Socket and controllers
*/
var chat = io
.of('/notification')
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