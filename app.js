//Main start point
var express = require('express');
var app = module.exports = express.createServer();

//Set up constant
const VERIFY_FAILED = 1;
const CONNETION_FAILED = 2;


//Set up views
app.register('.html', require('ejs'));
app.set('views', __dirname + '/app/view');
app.set('view engine', 'html');
app.set("view options", { layout: "layout" });

//Set up ExpressJS
app.configure(function(){
    app.use(express.logger('\x1b[33m:method\x1b[0m \x1b[32m:url\x1b[0m :response-time'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'rhythm'
    }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({
        dumpExceptions: true, 
        showStack: true
    }));
});
//Include Controllers here
require('./app/controller/site')(app);
require('./app/controller/user')(app);

//Include libraries
app.db = require('./lib/mysql').db;
app.crpyto = require('crypto');
app.sha1 = function(text){
    return this.crpyto.createHash('sha1').update(text).digest('hex');
}
if (!module.parent) {
    app.listen(80);
    console.log('Rhythm server started');
}
