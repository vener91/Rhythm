/**
* Notification Socket and controllers
*/
module.exports = function(app){
    var chat = app.io
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
};

