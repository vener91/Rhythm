//Main start point
var express = require('express')
, app = module.exports = express.createServer()
, io = require('socket.io').listen(app)
, fs = require('fs')

//Libraries
, passport = require('passport')
, auth = require('./lib/auth.js')
, mongoose = require('mongoose')
, validator = require('validator')
, config = require('./config.js')

//Set up constant
const VERIFY_FAILED = 1;
const CONNETION_FAILED = 2;

//Set up views
app.register('.html', require('ejs'));
app.set('views', __dirname + '/app/view');
app.set('view engine', 'html');
app.set("view options", { layout: "layout" });

//Set up fatalError
app.error(function(err, req, res){
    app.fatalError(res, err);
});
app.fatalError = function(res, err){
    console.log(err);
    if(typeof(err) == undefined || err == null){
        err = {};
    }
    res.render('site/500', {
        title: ' - Server Fatal Error',
        scripts: [],
        styles: [],
        err: JSON.stringify(err)
    });
}
//Set up ExpressJS
app.configure(function(){
    app.title = 'Rhythm Project';
    app.use(express.logger('\x1b[33m:method\x1b[0m \x1b[32m:url\x1b[0m :response-time'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'rhythm'
    }));

    //Database MongoDB
    app.mg = mongoose;
    app.mg.connect('mongodb://localhost/rhythm');

    //Validator
    app.check = validator.check;
    app.sanitize = validator.sanitize;

    //Passport
    app.passport = auth.configurePassport(app, passport);
    app.use(app.passport.initialize());
    app.use(app.passport.session());
    
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({
        dumpExceptions: true, 
        showStack: true
    }));
});

//View helpers
app.helpers({
    renderScripts: function(scripts){ 
        var scriptsStr = '';
        for(var i = 0; i < scripts.length; i++){
            scriptsStr += '<script src="/res/js/' + scripts[i] + '.js" type="text/javascript"></script>';
        }
        return scriptsStr;
    },
    renderStyles: function(styles){
        var stylesStr = '';
        for(var i = 0; i < styles.length; i++){
            stylesStr += '<link rel="stylesheet" href="/res/css/' + styles[i] + '.css" type="text/css">';
        }
        return stylesStr;
    }
});

//Include models
fs.readdir(__dirname + '/app/model', function(err, files){
  if (err) throw err;
  files.forEach(function(file){
    require(__dirname + '/app/model/' + file)(app);
  });
});

//Include Controllers here
require(__dirname + '/app/controller/site')(app);
require(__dirname + '/app/controller/player')(app);
require(__dirname + '/app/controller/dash')(app);
require(__dirname + '/app/controller/auth')(app);
require(__dirname + '/app/controller/user')(app);

if (!module.parent) {
    app.listen(80);
    console.log('Rhythm server started');
}
