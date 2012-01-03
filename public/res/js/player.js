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
    this.speed = 1;
    this.gameCanvas = canvasObj;
    this.gameHeight = canvasObj.height;
    this.gameWidth = canvasObj.width;
    this.msgCanvas = msgCanvasObj;
    this.msgCanvasCtx = msgCanvasObj.getContext("2d");
    //this.gameCanvasCtx = canvasObj.getContext("2d");
    WebGL2D.enable(canvasObj); // adds "webgl-2d" context to cvs
    this.gameCanvasCtx = canvasObj.getContext("webgl-2d")
    this.noteCharts = [];
    this.keyboardState = null;

    //Start Loading resources
    $("#player-load img").attr('src', '/res/track/' + this.trackName + '/album.jpg' );
    //Load Song
    var gameObj = this;
    $.getJSON('/res/track/' + gameObj.trackName + '/track.json', function(JSONtrack){
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
            //Pre render notechart
            var barChartCanvas = document.createElement("canvas");
            barChartCanvas.width = this.gameWidth;
            barChartCanvas.height = this.barHeight;
            var barChartCtx = barChartCanvas.getContext("2d");
            //Draw barLine
            barChartCtx.strokeStyle = '#FFFFFF'
            barChartCtx.beginPath();
            barChartCtx.moveTo(0, 0);
            barChartCtx.lineTo(350, 0);
            barChartCtx.closePath();
            barChartCtx.stroke();
            for(var j = 0; j < currBar.length; j++){
                var currRow = currBar[j];
                
                if(currRow != null && Object.keys(currRow).length != 0){
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
                    var key = this.keyStack[this.keyStack.length - 1];
                    barChartCtx.drawImage(this.skinImg, key.spriteXPos, 90, key.spriteWidth, 10, key.x, Math.round(this.barHeight - (j * distancePerStep) - 10), key.spriteWidth, 10);
                }
            }
            this.noteCharts.push(barChartCanvas);
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
    //game.gameCanvasCtx.drawImage(game.noteCharts[3],0,0)
    var chartLength = gameObj.noteCharts.length;
    for(var i = 0; i < chartLength; i++){
        if(!(typeof(gameObj.noteCharts[i]) === "undefined")){
            var yPos = ((newTime - gameObj.startGameTime) * gameObj.heightPerMilisec) - ((i + 1) * gameObj.barHeight);
            
            if(yPos < gameObj.gameHeight){
                if(yPos > -1 * gameObj.barHeight){
                    gameObj.gameCanvasCtx.drawImage(gameObj.noteCharts[i], 0, yPos);
                } else {
                    break;
                }
            } else {
                //Remove key
                delete gameObj.noteCharts[i];
            }
        }
    }

    //Render Notes
    var stackLength = gameObj.keyStack.length;
    for(var i = 0; i < stackLength; i++ ){
        key = gameObj.keyStack[i];
        //Paint
        var yPos = ((newTime - gameObj.startGameTime) * gameObj.heightPerMilisec) + key.y;
        if(yPos < gameObj.gameHeight){
            if(yPos > 0){
                //gameObj.gameCanvasCtx.drawImage(gameObj.noteChartCanvas, 0, 0, );
                //gameObj.gameCanvasCtx.drawImage(gameObj.skinImg, key.spriteXPos, 90, key.spriteWidth, 10, key.x, Math.round(yPos), key.spriteWidth, 10);
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
    //breakprocess;
    //Render Msg
    //Render with gameObj.hitMsg = {spriteXPos:250, spriteYPos:160, y:120}
    if(gameObj.hitMsg != null){
        if(gameObj.hitMsg.y < 140){ //Distance
            gameObj.msgCanvasCtx.clearRect(0,120, gameObj.msgCanvas.width, 80); 
            if(gameObj.hitMsg.y >= 0){
                gameObj.msgCanvasCtx.drawImage(gameObj.skinImg, gameObj.hitMsg.spriteXPos, gameObj.hitMsg.spriteYPos, 250, 60, Math.floor((gameObj.msgCanvas.width - 250)/2), gameObj.hitMsg.y, 250, 60);
            }
            gameObj.hitMsg.y = Math.floor((newTime - gameObj.lastUpdateTime) * 0.5) + gameObj.hitMsg.y; 
        } else {
            if(gameObj.hitMsg.y < 400){
              gameObj.hitMsg.y = Math.floor((newTime - gameObj.lastUpdateTime) * 0.5) + gameObj.hitMsg.y;          
            } else {
                gameObj.hitMsg = null;
                gameObj.msgCanvasCtx.clearRect(0,0, gameObj.msgCanvas.width, gameObj.msgCanvas.height);
            }
        }
    }

    //Render Combo
    //Render with game.comboScore++; game.comboY = 0;
    if(gameObj.comboScore != null && gameObj.comboScore > 1){
        if(gameObj.comboY < 20){
            gameObj.msgCanvasCtx.clearRect(0,0, gameObj.msgCanvas.width, 120); 
            var comboString = gameObj.comboScore.toString();
            var i = 0;
            var x = Math.floor((gameObj.msgCanvas.width - comboString.length * 50)/2) //Initial x
            for(var i = 0; i < comboString.length; i++){
                gameObj.msgCanvasCtx.drawImage(gameObj.skinImg, parseInt(comboString[i]) * 50, 0, 50, 90, x, gameObj.comboY, 50, 90);
                x += 50;    
            }
            gameObj.comboY = Math.floor((newTime - gameObj.lastUpdateTime) * 0.5) + gameObj.comboY; 
        }
    }

    gameObj.lastUpdateTime = newTime;
    gameObj.gameLoopCount++;
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
    var trackName = $("#track-title").text();
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