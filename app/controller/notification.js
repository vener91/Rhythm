/**
* Notification Socket and controllers
*/
module.exports = function(app){
    var notification = app.io
    .of('/notifications')
    .authorization(function (handshakeData, callback) {
        app.passport.isLoggedInByCookie(handshakeData.headers.cookie, function(err, data){
            handshakeData.connectSid = data.sid;
            handshakeData.userId = data.session.passport.user;
            callback(err, true);
        });
    })
    .on('connection', function (socket) {
        //Attach to session data
        var User = app.mg.model('user');
        User.update({_id: socket.handshake.userId}, {$push: { sockets: socket.id }}, {}, function(err){
           if(err != null){
                socket.emit('error', {
                    'msg': 'Notification Error'
                });
                return;
            }
            //Do initial stuff here

            //Sent last 5 notifications
            socket.emit('init', {
                test: 'test'    
            });
            //console.info(app.io.sockets);
        });
    })
    .on('disconnect', function(socket){
        //console.info(socket)
    });
};

