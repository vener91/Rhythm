(function($){
	var viewOptions = {
        state: 'default', //Variations of view
    };

    $.fn.countUp = function(value, duration, callback) {
        $(this).text(value);
        /*
        var id = setInterval(100, function(){
            $(this).text(value);
        });
        */
    }
    /*
     * @var offset value of offset against the window
     */
    $.fn.setFluid = function(offset, count, callback) {
        var resizeObj = $(this);
        if(typeof(offset) == 'undefined'){
            offset = 0;
        }
        if(typeof(count) == 'undefined'){
            count = resizeObj.length;
        }
        resizeElement(resizeObj, offset, count, callback);
        $(window).bind('resize').bind('resize',function(){
            resizeElement(resizeObj, offset, count, callback);
        });
        return resizeObj;
    }

    function resizeElement(resizeObj, offset, count, callback){
        var height = Math.floor($(window).height() - offset)/count;
        resizeObj.css('height', height);
        if ( count == 2 && ($(window).height()-offset)%2 == 1){
            $('iframe:visible:first').css('height',($('iframe:visible:first').height()+1));
        }
        if(typeof(callback) === 'function'){
            callback(height);
        }
    }

    $.setBGM = function(name){
        soundManager.url = '/res/swf';
        bgm = new Audio('/res/bgm/' + name + '.mp3'); 
        bgm.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
        bgm.play();
        $("#bgm-toggle").show().on("click", function(){ 
            if(bgm.paused){
                bgm.play();
            }else{
                bgm.pause();
            }
        });
    }

})(jQuery);
