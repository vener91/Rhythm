$(document).ready(function(){
    //Header stuff
    //UI interaction
    if($("#user-link").length){
        $("#user-link").on("click" ,function(){
            if($("#user-panel").is(":visible")){
                $("#user-panel").fadeOut(200);
                $("#user-link").removeClass('user-panel-link-select'); 
            }else{
                $("#user-panel").fadeIn(200);
                $("#user-link").addClass('user-panel-link-select'); 
            }
        });
    }
    //Socket.io connection
    //Notifications
    notifications = io.connect('/notifications');

    notifications.on('connect', function (test) {
        notifications.emit('hi!');
    });

});