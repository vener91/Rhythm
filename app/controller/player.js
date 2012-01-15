module.exports = function(app){
    app.get('/player/play/:track', app.passport.isLoggedIn, function(req, res){
        res.render('player', {
	        layout: 'page-layout',
            scripts: ['player', 'webgl-2d'],
            styles: ['player'],
            title: app.title + ' - Player',
            user: req.user,
            track: {
                title: req.params.track
            }
        });
    });
    app.get("/player/getURI", function(req, res){
        request = require("request");
        BufferList = require("bufferlist").BufferList;
        if(req.param("track") && req.param("file")){
            url = "http://localhost/res/track/" + req.param("track") + "/" + req.param("file");
            request({uri: url, encoding: 'binary'}, function(err, response, body){
                if(!err && response.statusCode == 200){
                  //data_uri_prefix = "data:" + response.headers["content-type"] + ";base64,";
                  data = "data:audio/ogg;base64," + new Buffer(body.toString(), "binary").toString("base64");
                  //data = data_uri_prefix + data;
                  res.send(data);
              }  
            });
        }
    });

};