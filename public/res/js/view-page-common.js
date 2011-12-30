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
        $("#notification-panel").on('click', '.delete_btn', function(){
            $(this).parent().hide('fade', {duration: 300}, function(){ 
                $(this).remove();
                var noOfNotification = $("#notification-panel > li").length;
                if(noOfNotification == 1){ //Remember to count the hidden no notification thing
                    $("#notification-panel > li#notification-panel-empty").show();
                    $("header .ui-red-badge").hide();    
                }else{
                    //Update badge
                    $("header .ui-red-badge > div").text(noOfNotification - 1);
                }
            });
        });
    }
    //Socket.io connection
    //Notifications
    notifications = io.connect('/notifications');
    notifications.on('connect', function (socket) {
        //Update badge
        var noOfNotification = $("#notification-panel > li").length;
        if(noOfNotification > 1){ //Remember to count the hidden no notification thing
            //Update badge
            $("header .ui-red-badge").show().find("div").text(noOfNotification - 1);
        }
    });

});