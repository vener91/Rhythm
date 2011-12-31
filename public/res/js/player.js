function rhythmGame(trackName, canvasObj, msgCanvasObj, isLoadedCallback) {  
    //Stats Counters
    this.gameLoopCount = 0;
    this.comboCount = 0;
    this.loadingStatus = {
        loadAudio: false,
        renderkeys: false
        
    };

    //Variables
    this.isLoadedCallback = isLoadedCallback;
    this.filesToLoad = 2;
    this.filesLoaded = 0;
    this.lastUpdateTime;
    this.startGameTime;
    this.hitMsg;
    this.comboScore = 0;
    this.comboY = 0;
    this.keyStack = [];
    this.clipLibrary = {};
    this.barHeight = 0;
    this.track;
    this.trackName = trackName;

    //Resources
    this.skinImg = this.loadImage('/res/skin/rhythm/rhythm-skin.png');;

    //Config
    this.speed = 2;
    this.gameCanvas = canvasObj;
    this.gameHeight = canvasObj.height;
    this.gameWidth = canvasObj.width;
    this.msgCanvas = msgCanvasObj;
    this.gameCanvasCtx = canvasObj.getContext("2d");
    //WebGL2D.enable(canvasObj); // adds "webgl-2d" context to cvs
    //this.gameCanvasCtx = canvasObj.getContext("webgl-2d")
    this.noteChartCanvas = document.createElement('canvas');
    this.keyboardState = null;

    //Start Loading resources
    $("#player-load img").attr('src', './res/track/' + this.trackName + '/album.jpg' );
    //Load Song
    var gameObj = this;
    $.getJSON('./res/track/kiss_the_rain/track.json', function(JSONtrack){
        gameObj.track = JSONtrack;
        //Load audio
        gameObj.filesToLoad += Object.keys(gameObj.track.clipchart).length;
        clipLibrary = {}; //Clear library
        for(clipName in gameObj.track.clipchart){
            gameObj.loadAudio(clipName, gameObj.track.clipchart[clipName], function(clipName, data){
               gameObj.clipLibrary[clipName] = data;
            });
        }
        gameObj.isResLoaded();
    });
}

rhythmGame.prototype.isResLoaded = function(callback){
    this.filesLoaded++;
    if (this.filesLoaded >= this.filesToLoad) {
        //Done loading resources, load game now
        this.loadGame();
    } 
}

rhythmGame.prototype.loadImage = function(uri){
    var img = new Image();
    img.onload = this.isResLoaded();
    img.src = uri;
    return img;
}

rhythmGame.prototype.loadAudio = function(clipName, fileName, callback){
    var gameObj = this;
    $.get("/player/getURI", {track: this.trackName, file: fileName}, function(data){
        callback(clipName, data);
        gameObj.isResLoaded();
    },"text");
}

rhythmGame.prototype.getAudio = function(clipName){
    var clip = new Audio();
    clip.src = this.clipLibrary[clipName];
    clip.preload = 'auto';
    return clip;
}

rhythmGame.prototype.loadGame = function() {

        //Start Stats
        //Run fps counter
        var framerateObj = $(".stats-framerate");
        var gameObj = this;
        window.setInterval(function(){
            framerateObj.text(gameObj.gameLoopCount);
            gameObj.gameLoopCount = 0;
        }, 1000);
        //Calcuate speed
        this.barHeight = this.gameHeight * 4 * this.speed / 5;
        this.heightPerMilisec = this.track.bpm / 60 * this.barHeight / 4000;
        this.timePerBar = (this.track.bpm / 60) * 4000 * this.speed;
        //Load song into memory;
        
        //Load keys
        this.keyStack = [] //Clear stack
        for(var i = 0; i < this.track.notechart.length; i++){
            var distancePerStep = this.barHeight / this.track.notechart[i].divisions;
            var currBar = this.track.notechart[i].data;
            for(var j = 0; j < currBar.length; j++){
                var currRow = currBar[j];
                if(currRow != null){
                    if(typeof(currRow.w1) != 'undefined'){
                        this.keyStack.push({spriteXPos: 0, spriteWidth: 50, x:0, y:-1 * ((i) * this.barHeight) - (j * distancePerStep) - 10, clip: currRow.w1 });
                    }
                    if(typeof(currRow.b1) != 'undefined'){
                        this.keyStack.push({spriteXPos: 50, spriteWidth: 40, x:51, y:-1 * ((i) * this.barHeight) - (j * distancePerStep) - 10, clip: currRow.b1 });
                    }
                    if(typeof(currRow.w2) != 'undefined'){
                        this.keyStack.push({spriteXPos: 0, spriteWidth: 50, x:92, y:-1 * ((i) * this.barHeight) - (j * distancePerStep) - 10, clip: currRow.w2 });
                    }
                    if(typeof(currRow.g) != 'undefined'){
                        this.keyStack.push({spriteXPos: 91, spriteWidth: 64, x:143, y:-1 * ((i) * this.barHeight) - (j * distancePerStep) - 10, clip: currRow.g }); 
                    }
                    if(typeof(currRow.w3) != 'undefined'){
                        this.keyStack.push({spriteXPos: 0, spriteWidth: 50, x:208, y:-1 * ((i) * this.barHeight) - (j * distancePerStep) - 10, clip: currRow.w3 }); 
                    }
                    if(typeof(currRow.b2) != 'undefined'){
                        this.keyStack.push({spriteXPos: 50, spriteWidth: 40, x:259, y:-1 * ((i) * this.barHeight) - (j * distancePerStep) - 10, clip: currRow.b2 }); 
                    }
                    if(typeof(currRow.w4) != 'undefined'){
                        this.keyStack.push({spriteXPos: 0, spriteWidth: 50, x:300, y:-1 * ((i) * this.barHeight) - (j * distancePerStep) - 10, clip: currRow.w4 }); 
                    }
                }
            }
        }

        
        //Pre render notechart
        var yOffset = this.keyStack[this.keyStack.length-1].y*-1;
        this.noteChartCanvas.width = this.gameWidth;
        this.noteChartCanvas.height = Math.ceil(yOffset)/4;
        var noteChartCanvasCtx = this.noteChartCanvas.getContext("2d");
        for(i = 0; i < this.keyStack.length; i++){
            var key = this.keyStack[i];
            noteChartCanvasCtx.drawImage(this.skinImg, key.spriteXPos, 90, key.spriteWidth, 10, key.x, Math.round(key.y + yOffset)/4, key.spriteWidth, 10);    
        }


        //Set up keyboard and keys
        keyboardState = {
            w1:{
                isPressed: false,
                clipObject: null,
                playSound: function(){
                    playSound(this.clipObject);
                },
                keyObject: $(".w1")   
            },
            b1:{
                isPressed: false,
                clipObject: null,
                playSound: function(){
                    playSound(this.clipObject);
                },
                keyObject: $(".b1")
            },
            w2:{
                isPressed: false,
                clipObject: null,
                playSound: function(){
                    playSound(this.clipObject);
                },
                keyObject: $(".w2")
            },
            g:{
                isPressed: false,
                clipObject: null,
                playSound: function(){
                    playSound(this.clipObject);
                },
                keyObject: $(".g")
            },
            w3:{
                isPressed: false,
                clipObject: null,
                playSound: function(){
                    playSound(this.clipObject);
                },
                keyObject: $(".w3")
            },
            b2:{
                isPressed: false,
                clipObject: null,
                playSound: function(){
                    playSound(this.clipObject);
                },
                keyObject: $(".b2")
            },
            w4:{
                isPressed: false,
                clipObject: null,
                playSound: function(){
                    playSound(this.clipObject);
                },
                keyObject: $(".w4")
            },
        };
        $(document).on('keydown', function(e){
            var currKeyIndex = null;
            switch(e.keyCode){
                case 81:
                currKeyIndex = 'w1';
                break;
                case 87:
                currKeyIndex = 'b1';
                break;
                case 69:
                currKeyIndex = 'w2';
                break;
                case 32:
                currKeyIndex = 'g';
                break;
                case 73:
                currKeyIndex = 'w3';
                break;
                case 79:
                currKeyIndex = 'b2';
                break;
                case 80:
                currKeyIndex = 'w4';
                break;
            }
            if(currKeyIndex != null){
                if(keyboardState[currKeyIndex].isPressed != true){
                    keyboardState[currKeyIndex].keyObject.addClass("pressed");
                    keyboardState[currKeyIndex].playSound();
                    keyboardState[currKeyIndex].isPressed = true;
                }else{
                }
            }
        }).on('keyup', function(e){
            var currKeyIndex = null;
            switch(e.keyCode){
                case 81:
                currKeyIndex = 'w1';
                break;
                case 87:
                currKeyIndex = 'b1';
                break;
                case 69:
                currKeyIndex = 'w2';
                break;
                case 32:
                currKeyIndex = 'g';
                break;
                case 73:
                currKeyIndex = 'w3';
                break;
                case 79:
                currKeyIndex = 'b2';
                break;
                case 80:
                currKeyIndex = 'w4';
                break;
            }
            if(currKeyIndex != null){
                if(keyboardState[currKeyIndex].isPressed == true){
                    keyboardState[currKeyIndex].isPressed = false;
                    keyboardState[currKeyIndex].keyObject.removeClass("pressed");
                }
            }
        });
        this.isLoadedCallback();
};

rhythmGame.prototype.startGame = function() {  
    window.requestAnimationFrame(this.gameLoop); //Start Game
};

rhythmGame.prototype.gameLoop = function(newTime){
    gameObj = window.game;
    gameObj.gameCanvasCtx.clearRect(0, 0, gameObj.gameWidth, gameObj.gameHeight);
    

    if(gameObj.lastUpdateTime == null){
        gameObj.lastUpdateTime = newTime;
        gameObj.startGameTime = newTime;
    }

    //Render Bars
    /*
    firstBarY = ((newTime - startGameTime) % timePerBar) * heightPerMilisec;
    var i = 0;
    gameCanvasCtx.strokeStyle = '#FFFFFF'
    gameCanvasCtx.beginPath();
    while(firstBarY + (i * barHeight ) < gameHeight){
        gameCanvasCtx.moveTo(0,firstBarY + (i * barHeight ));  
        gameCanvasCtx.lineTo(350,firstBarY + (i * barHeight ));  
        i++;       
    }
    i = 1
    while(firstBarY - (i * barHeight ) > 0){
        gameCanvasCtx.moveTo(0,firstBarY - (i * barHeight ));  
        gameCanvasCtx.lineTo(350,firstBarY - (i * barHeight ));  
        i++;   
    }
    gameCanvasCtx.closePath();
    gameCanvasCtx.stroke();
    */
    //Render Notes
    var stackLength = gameObj.keyStack.length;
    for(i = 0; i < stackLength; i++ ){
        key = gameObj.keyStack[i];
        //Paint
        var yPos = ((newTime - gameObj.startGameTime) * gameObj.heightPerMilisec) + key.y;
        if(yPos < gameObj.gameHeight){
            if(yPos > 0){
                //gameObj.gameCanvasCtx.drawImage(gameObj.noteChartCanvas, 0, 0, );
                gameObj.gameCanvasCtx.drawImage(gameObj.skinImg, key.spriteXPos, 90, key.spriteWidth, 10, key.x, Math.round(yPos), key.spriteWidth, 10);
                //Dynamically load Audio objects
                if(typeof(key.clip) === 'string'){
                    gameObj.keyStack[i].clip = gameObj.getAudio(key.clip);
                }
            } else {
                break;
            }
        } else {
            //Remove key
            gameObj.keyStack[i].clip.play();
            gameObj.keyStack.shift();
        }
    }

    //Render Msg
    if(gameObj.hitMsg != null){
        if(hitMsg.y < 140){
            msgCanvas.getContext("2d").clearRect(0,120, msgCanvas.width, 80); 
            if(hitMsg.y >= 0){
                msgCanvas.getContext("2d").drawImage(hitMsg.type, Math.floor((msgCanvas.width - hitMsg.type.width)/2), hitMsg.y);
            }
            hitMsg.y = Math.floor((newTime - gameObj.lastUpdateTime) * 0.5) + hitMsg.y; 
        }else{
            if(hitMsg.y < 400){
              hitMsg.y = Math.floor((newTime - gameObj.lastUpdateTime) * 0.5) + hitMsg.y;          
            }else{
                hitMsg = null;
                msgCanvas.getContext("2d").clearRect(0,0, msgCanvas.width, msgCanvas.height);
            }
        }
    }

    //Render Combo
    if(gameObj.comboScore != null && gameObj.comboScore > 1){
        if(gameObj.comboY < 20){
            gameObj.msgCanvas.getContext("2d").clearRect(0,0, msgCanvas.width, 120); 
            var comboString = gameObj.comboScore.toString();
            var i = 0;
            var x = Math.floor((msgCanvas.width - comboString.length * 50)/2) //Initial x
            for(var i = 0; i < comboString.length; i++){
                msgCanvas.getContext("2d").drawImage(comboImg[comboString[i]], x, comboY);
                x += 50;    
            }
            comboY = Math.floor((newTime - gameObj.lastUpdateTime) * 0.5) + comboY; 
        }
    }

    gameObj.lastUpdateTime = newTime;
    gameObj.gameLoopCount++;
    console.info(gameObj.keyStack.length);
    if(gameObj.keyStack.length > 0) {
        window.requestAnimationFrame(gameObj.gameLoop); //Start Game    
    }
}

function playSound(){
    
}

function animateLoader(){
    if($("#player-play-loading").is(":visible")){
        if($("#player-play-loading").css('left') == "100px"){
            $("#player-play-loading").animate({left: -100}, 1000, animateLoader); 
        }else{
            $("#player-play-loading").animate({left: 100}, 1000, animateLoader);
        } 
    }else{
        $("#player-play-loading").remove();
    }
}

$(document).ready(function(){

    animateLoader();
    $('.player-bg').setFluid(112, 1);
    $('.player-canvas').setFluid(115, 1, function(height){
        $('.player-canvas').get(0).height = height;
    }).get(0).width = 350;
    
    var msgCanvas = $(".player-msg-canvas").get(0)
    msgCanvas.width = 350;
    msgCanvas.height = 200;

    //Request animation frame shim
    window.requestAnimationFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
    //Start prequesting assets
    trackName = 'kiss_the_rain';
    window.game = new rhythmGame(trackName, $('.player-canvas').get(0), msgCanvas, function(playerRef){
        $("#player-play-loading").hide();
        $("#player-load-info > div").animate({ paddingRight: 0, opacity: 0, marginLeft: -135}, 1000, function(){
            $(this).remove();
        });
        $("#player-album-img").animate({marginRight: 0});
        $(document).bind("keydown", "return", function(){
            $("#player-play-btn").trigger("click");     
        });
        $("#player-play-btn").fadeIn().on("click", function(){
            $(".player-wrap").removeClass("hidden");
            $("#player-load").fadeOut(function(){
                $(this).remove();
                window.game.startGame();
            });
        });
    });
});