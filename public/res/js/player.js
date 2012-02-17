function rhythmGame(trackName, trackSpeed, canvasObj, msgCanvasObj, isLoadedCallback) {  
    //Constants
    this.scoreBar = 300;
    //Stats Counters
    this.gameLoopCount = 0;
    this.comboCount = 0;
    this.loadingStatus = {
        loadAudio: false,
        renderkeys: false
        
    };
    this.perfectCount = 0;
    this.goodCount = 0;
    this.badCount = 0;
    this.missCount = 0;
    this.pills = 0;

    this.loader = new PxLoader();

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
    this.skinImg = this.loader.addImage('/res/skin/rhythm/rhythm-skin.png');

    //Config
    this.end = false;
    this.speed = trackSpeed;
    this.scoreBarObj = $(".score-bar");
    this.gameCanvas = canvasObj;
    this.gameHeight = canvasObj.height;
    this.gameWidth = canvasObj.width;
    this.msgCanvas = msgCanvasObj;
    this.msgCanvasCtx = msgCanvasObj.getContext("2d");
    this.gameCanvasCtx = canvasObj.getContext("2d");
    //WebGL2D.enable(canvasObj); // adds "webgl-2d" context to cvs
    //this.gameCanvasCtx = canvasObj.getContext("webgl-2d")
    this.noteCharts = [];
    this.keyboardState = null;

    //Start Loading resources
    $("#player-load img").attr('src', '/res/track/' + this.trackName + '/album.jpg' );

    soundManager.url = '/res/swf';
    soundManager.flashVersion = 9; // optional: shiny features (default = 8)
    soundManager.useFlashBlock = false; // optionally, enable when you're ready to dive in
    soundManager.preferFlash = true;

    var gameObj = this;
    soundManager.onready(function() {
        //Load Song
        $.getJSON('/res/track/' + gameObj.trackName + '/track.json', function(JSONtrack){

            gameObj.track = JSONtrack;
            //Load audio
            gameObj.filesToLoad += Object.keys(gameObj.track.clipchart).length;
            gameObj.clipLibrary = {}; //Clear library
            for(clipName in gameObj.track.clipchart){
                gameObj.loader.addSound(clipName, '/res/track/' + gameObj.trackName + '/' + gameObj.track.clipchart[clipName]);
            }

            gameObj.loader.addCompletionListener(function() {
                gameObj.loadGame();
            });
            gameObj.loader.start();
        });
    });
}

rhythmGame.prototype.isResLoaded = function(callback){
    this.filesLoaded++;
    if (this.filesLoaded >= this.filesToLoad) {
        //Done loading resources, load game now
        this.loadGame();
    } 
};

rhythmGame.prototype.loadImage = function(uri){
    var img = new Image();
    img.onload = this.isResLoaded();
    img.src = uri;
    return img;
};

rhythmGame.prototype.loadAudio = function(clipName, fileName, callback){
    var gameObj = this;
    $.get("/player/getURI", {track: this.trackName, file: fileName}, function(data){
        callback(clipName, data);
        gameObj.isResLoaded();
    },"text");
};

rhythmGame.prototype.getAudio = function(clipName){
    var clip = new Audio();
    clip.src = this.clipLibrary[clipName];
    clip.preload = 'auto';
    return clip;
};

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
        //Calcualate judgement distance
        this.perfectJudgement = 0.3 * 10 * this.speed + 20; //10 is the height of the note piece
        this.goodJudgement = 0.5 * 10 * this.speed + 20; //10 is the height of the note piece
        this.badJudgement = 0.8 * 10 * this.speed + 20; //10 is the height of the note piece


        //Load song into memory;
        
        //Load keys
        this.keyStack = {}; //Clear stack
        this.keyStack.w1 = [];
        this.keyStack.b1 = [];
        this.keyStack.w2 = [];
        this.keyStack.g = [];
        this.keyStack.w3 = [];
        this.keyStack.b2 = [];
        this.keyStack.w4 = [];

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
                    if(typeof(currRow.w1) !== 'undefined'){
                        this.keyStack.w1.push({y:-1 * ((i) * this.barHeight) - (j * distancePerStep) - 10, clip: currRow.w1 });
                        barChartCtx.drawImage(this.skinImg, 0, 90, 50, 10, 0, Math.round(this.barHeight - (j * distancePerStep) - 10), 50, 10);    
                    }
                    if(typeof(currRow.b1) !== 'undefined'){
                        this.keyStack.b1.push({y:-1 * ((i) * this.barHeight) - (j * distancePerStep) - 10, clip: currRow.b1 });
                        barChartCtx.drawImage(this.skinImg, 50, 90, 40, 10, 51, Math.round(this.barHeight - (j * distancePerStep) - 10), 40, 10);    
                    }
                    if(typeof(currRow.w2) !== 'undefined'){
                        this.keyStack.w2.push({y:-1 * ((i) * this.barHeight) - (j * distancePerStep) - 10, clip: currRow.w2 });
                        barChartCtx.drawImage(this.skinImg, 0, 90, 50, 10, 92, Math.round(this.barHeight - (j * distancePerStep) - 10), 50, 10);
                    }
                    if(typeof(currRow.g) !== 'undefined'){
                        this.keyStack.g.push({y:-1 * ((i) * this.barHeight) - (j * distancePerStep) - 10, clip: currRow.g }); 
                        barChartCtx.drawImage(this.skinImg, 91, 90, 64, 10, 143, Math.round(this.barHeight - (j * distancePerStep) - 10), 64, 10);    
                    }
                    if(typeof(currRow.w3) !== 'undefined'){
                        this.keyStack.w3.push({y:-1 * ((i) * this.barHeight) - (j * distancePerStep) - 10, clip: currRow.w3 }); 
                        barChartCtx.drawImage(this.skinImg, 0, 90, 50, 10, 208, Math.round(this.barHeight - (j * distancePerStep) - 10), 50, 10);
                    }
                    if(typeof(currRow.b2) !== 'undefined'){
                        this.keyStack.b2.push({y:-1 * ((i) * this.barHeight) - (j * distancePerStep) - 10, clip: currRow.b2 }); 
                        barChartCtx.drawImage(this.skinImg, 50, 90, 40, 10, 259, Math.round(this.barHeight - (j * distancePerStep) - 10), 40, 10);    
                    }
                    if(typeof(currRow.w4) !== 'undefined'){
                        this.keyStack.w4.push({y:-1 * ((i) * this.barHeight) - (j * distancePerStep) - 10, clip: currRow.w4 }); 
                        barChartCtx.drawImage(this.skinImg, 0, 90, 50, 10, 300, Math.round(this.barHeight - (j * distancePerStep) - 10), 50, 10);
                    }
                    
                }
            }
            this.noteCharts.push(barChartCanvas);
        }

        //Set up keyboard and keys
        keyboardState = {
            w1:{
                isPressed: false,
                playSound: function(){
                    if(gameObj.keyStack.w1[0] !== 'undefined'){
                        soundManager.play(gameObj.keyStack.w1[0].clip);
                        gameObj.hitKey('w1');
                    }
                },
                keyObject: $(".w1")   
            },
            b1:{
                isPressed: false,
                playSound: function(){
                    if(gameObj.keyStack.b1[0] !== 'undefined'){
                        soundManager.play(gameObj.keyStack.b1[0].clip);
                        gameObj.hitKey('b1');
                    }
                },
                keyObject: $(".b1")
            },
            w2:{
                isPressed: false,
                playSound: function(){
                    if(gameObj.keyStack.w3[0] !== 'undefined'){
                        soundManager.play(gameObj.keyStack.w2[0].clip);
                        gameObj.hitKey('w2');
                    }
                },
                keyObject: $(".w2")
            },
            g:{
                isPressed: false,
                playSound: function(){
                    if(gameObj.keyStack.g[0] !== 'undefined'){
                        soundManager.play(gameObj.keyStack.g[0].clip);
                        gameObj.hitKey('g');
                    }
                },
                keyObject: $(".g")
            },
            w3:{
                isPressed: false,
                playSound: function(){
                    if(gameObj.keyStack.w3[0] !== 'undefined'){
                        soundManager.play(gameObj.keyStack.w3[0].clip);
                        gameObj.hitKey('w3');
                    }
                },
                keyObject: $(".w3")
            },
            b2:{
                isPressed: false,
                playSound: function(){
                    if(gameObj.keyStack.b2[0] !== 'undefined'){
                        soundManager.play(gameObj.keyStack.b2[0].clip);
                        gameObj.hitKey('b2');
                    }
                },
                keyObject: $(".b2")
            },
            w4:{
                isPressed: false,
                playSound: function(){
                    if(gameObj.keyStack.w4[0] !== 'undefined'){
                        soundManager.play(gameObj.keyStack.w4[0].clip);
                        gameObj.hitKey('w4');
                    }
                },
                keyObject: $(".w4")
            }
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
            if(currKeyIndex != null && keyboardState[currKeyIndex].isPressed != true){
                keyboardState[currKeyIndex].keyObject.addClass("pressed");
                keyboardState[currKeyIndex].playSound();
                keyboardState[currKeyIndex].isPressed = true;
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

rhythmGame.prototype.hitKey = function(key){
    //Judging Mechanism
    var newTime = new Date().getTime();
    var yPos = ((newTime - gameObj.startGameTime) * gameObj.heightPerMilisec) + gameObj.keyStack[key][0].y;
    if( yPos < gameObj.gameHeight - gameObj.goodJudgement - 20){
        return;
    }else {
        gameObj.keyStack[key][0].hit = true;
        if( yPos > gameObj.gameHeight - gameObj.perfectJudgement - 20){
            if( yPos > gameObj.gameHeight - 20 + gameObj.goodJudgement){
                if( yPos > gameObj.gameHeight - 20 + gameObj.badJudgement){
                    //Bad
                    gameObj.keyBad();
                }else{
                    //Lower good
                    gameObj.keyGood();
                }
            }else{
                //Perfect
                gameObj.keyPerfect();
            }
        }else{
            //Upper good
            gameObj.keyGood();
        }
    } 
};

rhythmGame.prototype.updateScoreBar = function(){
    var stage = this.scoreBar;
    this.scoreBarObj.css({
        "background-position-y": -1 * (300 - stage),
        "height": stage,
    })
    //this.gameWarp.css("-webkit-animation-name", "glow-" + stage);
};

rhythmGame.prototype.keyPerfect = function(){
    this.perfectCount++;
    this.hitMsg = {spriteXPos:0, spriteYPos:160, y:120};
    if(this.scoreBar > 297){
        this.scoreBar = 297;    
    }
    this.scoreBar += 2;
    this.updateScoreBar();
    this.comboScore++;
    this.comboY = 0;
    if(this.comboScore % 20 == 0){
        $(".stats-pills").text(this.pills);
        this.pills++;
    }
    $(".stats-cool").text(this.perfectCount);
};

rhythmGame.prototype.keyGood = function(){
    this.goodCount++;
    this.hitMsg = {spriteXPos:0, spriteYPos:100, y:120};
    if(this.scoreBar > 298){
        this.scoreBar = 298;    
    }
    this.scoreBar++;
    this.updateScoreBar();
    this.comboScore++;
    this.comboY = 0;
    if(this.comboScore % 20 == 0){
        $(".stats-pills").text(this.pills);
        this.pills++;
    }
    $(".stats-good").text(this.goodCount);
};

rhythmGame.prototype.keyBad = function(){
    //Check for pills
    if(this.pills != 0){
        this.keyPerfect();
        this.pills--;
        $(".stats-pills").text(this.pills);
        return;
    }
    this.badCount++;
    if(this.scoreBar < 0){
        this.endGame();
    }
    this.scoreBar -=2;
    this.updateScoreBar();
    gameObj.hitMsg = {spriteXPos:250, spriteYPos:160, y:120};
    this.comboScore = 0;
    $(".stats-bad").text(this.badCount);
};

rhythmGame.prototype.keyMiss = function(){
    this.missCount++;
    if(this.scoreBar < 0){
        this.endGame();
    }
    this.scoreBar -= 4;
    this.updateScoreBar();
    this.comboScore = 0;
    this.hitMsg = {spriteXPos:250, spriteYPos:100, y:120};
    $(".stats-miss").text(this.missCount);
};

rhythmGame.prototype.endGame = function(){
    this.end = true;
    var gameObj = this;
    $('.game-wrap').hide(500, function(){
        $('#player-end').show(500, function(){
            //Check if there is still keys
            if(this.scoreBar < 0){
                //Lost

            } else {
                //Complete
            }
            //Begin animation
            $('#player-end > h1').show('clip', 1000, function(){
                $('#player-end > table').show('clip', 1000, function(){
                    $(this).find(".perfect-count > td:eq(1)").countUp(gameObj.perfectCount, 1000);
                    $(this).find(".good-count > td:eq(1)").countUp(gameObj.goodCount, 1000);
                    $(this).find(".bad-count > td:eq(1)").countUp(gameObj.badCount, 1000);
                    $(this).find(".miss-count > td:eq(1)").countUp(gameObj.missCount, 1000);

                    $('#player-end > .button-bar').show('clip', 1000, function(){
                            
                    });
                });    
            });
        });
    });
}

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
        if(typeof(gameObj.noteCharts[i] !== "undefined")){
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

    //Remove old notes
    for(key in gameObj.keyStack){
        if(typeof(gameObj.keyStack[key][0]) !== 'undefined'){
            if(((newTime - gameObj.startGameTime) * gameObj.heightPerMilisec) + gameObj.keyStack[key][0].y > (gameObj.gameHeight + gameObj.badJudgement + 10)){
                if(typeof(gameObj.keyStack[key][0].hit) === 'undefined'){
                    gameObj.keyMiss();
                }
                gameObj.keyStack[key].shift();
            }
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
    if( (gameObj.keyStack.w1.length > 0 || 
        gameObj.keyStack.b1.length > 0 || 
        gameObj.keyStack.w2.length > 0 || 
        gameObj.keyStack.g.length > 0 || 
        gameObj.keyStack.w3.length > 0 || 
        gameObj.keyStack.b2.length > 0|| 
        gameObj.keyStack.w4.length > 0) && !gameObj.end) {
        window.requestAnimationFrame(gameObj.gameLoop); //Start Game    
    } else {
        gameObj.endGame();  
    }
};

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
    $('.player-bg').height(500);
    var playerCanvas = $('.player-canvas').get(0);
    playerCanvas.height = 500;
    playerCanvas.width = 350;
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
    var trackSpeed = $("#track-speed").text();
    window.game = new rhythmGame(trackName, trackSpeed,$('.player-canvas').get(0), msgCanvas, function(playerRef){
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