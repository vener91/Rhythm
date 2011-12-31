//Stats Counters
var gameLoopCount = 0;
var comboCount = 0;
var loadingStatus = {
    loadAudio: false,
    renderkeys: false
      
};

//Variables
var lastUpdateTime;
var startGameTime;
var hitMsg;
var comboScore = 0;
var comboY = 0;
var keyStack = [];
var clipLibrary = {};
var barHeight = 0;
var track;
var trackName;

//Config
var speed = 2;
var gameCanvas = null;
var gameCanvasCtx = null;
var gameHeight = null;
var gameWidth = null;
var keyboardState = null;

function preloadTrack(trackName, canvasObj, msgCanvasObj, callback){
    filesToLoad = 15;
    filesLoaded = 0;

    var isAppLoaded = function(callback){
        filesLoaded++;
        if (filesLoaded >= filesToLoad) {
          callback();  
        } 
    }

    var loadImage = function(uri){
        var img = new Image();
        img.onload = isAppLoaded(callback);
        img.src = uri;
        return img;
    }

    var loadAudio = function(trackName, clipName, fileName, callback){
        $.get("/player/getURI", {track: trackName, file: fileName}, function(data){
            callback(clipName, data);
        },"text");
    }
    $("#player-load img").attr('src', './res/track/' + trackName + '/album.jpg' );
    //Load Song
    $.getJSON('./res/track/kiss_the_rain/track.json', function(JSONtrack){
        track = JSONtrack;
        var framerateObj = $(".stats-framerate");

        gameCanvas = canvasObj;
        gameHeight = gameCanvas.height;
        gameWidth = gameCanvas.width;
        msgCanvas = msgCanvasObj;
        gameCanvasCtx = gameCanvas.getContext("2d")
        //WebGL2D.enable(gameCanvas); // adds "webgl-2d" context to cvs
        //gameCanvasCtx = gameCanvas.getContext("webgl-2d")
        skinImg = loadImage('/res/skin/rhythm/rhythm-skin.png');
        coolNoteImg = loadImage('res/skin/rhythm/cool.png');
        goodNoteImg = loadImage('res/skin/rhythm/good.png');
        badNoteImg = loadImage('res/skin/rhythm/bad.png');
        missNoteImg = loadImage('res/skin/rhythm/miss.png');
        comboImg = [];
        comboImg[0] = loadImage('res/skin/rhythm/combo0.png');
        comboImg[1] = loadImage('res/skin/rhythm/combo1.png');
        comboImg[2] = loadImage('res/skin/rhythm/combo2.png');
        comboImg[3] = loadImage('res/skin/rhythm/combo3.png');
        comboImg[4] = loadImage('res/skin/rhythm/combo4.png');
        comboImg[5] = loadImage('res/skin/rhythm/combo5.png');
        comboImg[6] = loadImage('res/skin/rhythm/combo6.png');
        comboImg[7] = loadImage('res/skin/rhythm/combo7.png');
        comboImg[8] = loadImage('res/skin/rhythm/combo8.png');
        comboImg[9] = loadImage('res/skin/rhythm/combo9.png');

        //Start Stats
        //Run fps counter
        window.setInterval(function(){
            framerateObj.text(gameLoopCount);
            gameLoopCount = 0;
        }, 1000);

        //Calcuate speed
        barHeight = canvasObj.height * 4 * speed / 5;
        heightPerMilisec = track.bpm / 60 * barHeight / 4000;
        timePerBar = (track.bpm / 60) * 4000 * speed;
        //Load song into memory;
        //Load keys
        clipLibrary = {}; //Clear library
        for(clipName in track.clipchart){
            loadAudio(trackName, clipName, track.clipchart[clipName], function(clipName, data){
               clipLibrary[clipName] = data; 
            });
        }
        //Load keys
        keyStack = [] //Clear stack
        for(var i = 0; i < track.notechart.length; i++){
            var distancePerStep = barHeight / track.notechart[i].divisions;
            var currBar = track.notechart[i].data;
            for(var j = 0; j < currBar.length; j++){

                var currRow = currBar[j];
                if(currRow != null){
                    if(typeof(currRow.w1) != 'undefined'){
                        keyStack.push({spriteXPos: 0, spriteWidth: 50, x:0, y:-1 * ((i) * barHeight) - (j * distancePerStep) - 10, clip: currRow.w1 });
                    }
                    if(typeof(currRow.b1) != 'undefined'){
                        keyStack.push({spriteXPos: 50, spriteWidth: 40, x:51, y:-1 * ((i) * barHeight) - (j * distancePerStep) - 10, clip: currRow.b1 });
                    }
                    if(typeof(currRow.w2) != 'undefined'){
                        keyStack.push({spriteXPos: 0, spriteWidth: 50, x:92, y:-1 * ((i) * barHeight) - (j * distancePerStep) - 10, clip: currRow.w2 });
                    }
                    if(typeof(currRow.g) != 'undefined'){
                        keyStack.push({spriteXPos: 91, spriteWidth: 64, x:143, y:-1 * ((i) * barHeight) - (j * distancePerStep) - 10, clip: currRow.g }); 
                    }
                    if(typeof(currRow.w3) != 'undefined'){
                        keyStack.push({spriteXPos: 0, spriteWidth: 50, x:208, y:-1 * ((i) * barHeight) - (j * distancePerStep) - 10, clip: currRow.w3 }); 
                    }
                    if(typeof(currRow.b2) != 'undefined'){
                        keyStack.push({spriteXPos: 50, spriteWidth: 40, x:259, y:-1 * ((i) * barHeight) - (j * distancePerStep) - 10, clip: currRow.b2 }); 
                    }
                    if(typeof(currRow.w4) != 'undefined'){
                        keyStack.push({spriteXPos: 0, spriteWidth: 50, x:300, y:-1 * ((i) * barHeight) - (j * distancePerStep) - 10, clip: currRow.w4 }); 
                    }
                }
            }
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
        
    });    
}

function getAudio(clipName){
    var clip = new Audio();
    clip.src = clipLibrary[clipName];
    clip.preload = 'auto';
    return clip;
}

function playSound(){
    
}

function changeSpeed(speed){
    
}

//Setup game loop
function rhythmGameLoop(newTime){
    gameCanvasCtx.clearRect(0, 0, gameCanvas.width, gameHeight);
    //Make notes readline.Interface(input, output, completer);
    //var newTime = new Date().getTime();
    if(lastUpdateTime == null){
        lastUpdateTime = newTime;
        startGameTime = newTime;
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
    var stackLength = keyStack.length;
    for(i = 0; i < stackLength; i++ ){
        key = keyStack[i];
        //Paint
        var yPos = ((newTime - startGameTime) * heightPerMilisec) + key.y;
        if(yPos < gameHeight){
            if(yPos > 0){
                gameCanvasCtx.drawImage(skinImg, key.spriteXPos, 90, key.spriteWidth, 10, key.x, Math.round(yPos), key.spriteWidth, 10);
                //Dynamically load Audio objects
                if(typeof(key.clip) === 'string'){
                    keyStack[i].clip = getAudio(key.clip);
                }
            } else {
                break;
            }
        } else {
            //Remove key
            keyStack.shift();
        }
    }

    //Render Msg
    if(hitMsg != null){
        if(hitMsg.y < 140){
            msgCanvas.getContext("2d").clearRect(0,120, msgCanvas.width, 80); 
            if(hitMsg.y >= 0){
                msgCanvas.getContext("2d").drawImage(hitMsg.type, Math.floor((msgCanvas.width - hitMsg.type.width)/2), hitMsg.y);
            }
            hitMsg.y = Math.floor((newTime - lastUpdateTime) * 0.5) + hitMsg.y; 
        }else{
            if(hitMsg.y < 400){
              hitMsg.y = Math.floor((newTime - lastUpdateTime) * 0.5) + hitMsg.y;          
            }else{
                hitMsg = null;
                msgCanvas.getContext("2d").clearRect(0,0, msgCanvas.width, msgCanvas.height);
            }
        }
    }

    //Render Combo
    if(comboScore != null && comboScore > 1){
        if(comboY < 20){
            msgCanvas.getContext("2d").clearRect(0,0, msgCanvas.width, 120); 
            var comboString = comboScore.toString();
            var i = 0;
            var x = Math.floor((msgCanvas.width - comboString.length * 50)/2) //Initial x
            for(var i = 0; i < comboString.length; i++){
                msgCanvas.getContext("2d").drawImage(comboImg[comboString[i]], x, comboY);
                x += 50;    
            }
            comboY = Math.floor((newTime - lastUpdateTime) * 0.5) + comboY; 
        }
    }

    lastUpdateTime = newTime;
    gameLoopCount++;
    if(keyStack.length > 0) {
        window.requestAnimationFrame(rhythmGameLoop); //Start Game    
    }
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
    preloadTrack(trackName, $('.player-canvas').get(0), msgCanvas, function(playerRef){
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
                 window.requestAnimationFrame(rhythmGameLoop); //Start Game
            });
        });
    });
});