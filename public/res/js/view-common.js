(function($){
	var viewOptions = {
        state: 'default', //Variations of view
    };

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

})(jQuery);