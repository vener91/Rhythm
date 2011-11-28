//Main start point
var express = require('express');
var app = module.exports = express.createServer();

//Set up views
app.register('.html', require('ejs'));
app.set('views', __dirname + '/app/view');
app.set('view engine', 'html');

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
if (!module.parent) {
    app.listen(80);
    console.log('Rhythm server started');
}
