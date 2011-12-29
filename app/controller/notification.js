/**
* Notification Socket and controllers
*/
module.exports = function(app){
    var notification = app.io
    .of('/notifications')
    .authorization(function (handshakeData, callback) {
        app.passport.isLoggedInByCookie(handshakeData.headers.cookie, function(err, sid){
            handshakeData.connectSid = sid;
            callback(err, sid);
        });
    })
    .on('connection', function (socket) {
        //Attach to session data
        app.mongoStore.get(socket.handshake.connectSid, function(err, session){
            if(err != null){
                socket.emit('error', {
                    'msg': 'Notification Error'
                });
                return;
            }
            var sid = socket.handshake.connectSid;
            if(typeof(session.sockets) === 'undefined'){
                session.sockets = [];
            }
            session.sockets.push(socket.id);
            app.mongoStore.set(sid, session, function(err){
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
            }); 
        });
    });
};

