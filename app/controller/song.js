module.exports = function(app){
    //Rebuild song database
    app.fs.readdir( app.root + '/public/res/track', function(err, songDirs){
        
        if (err) throw err;
        var replaceSong = function(data, songName){
            var Song = app.mg.model('song');
            //Delete songs with the name
            Song.findOne({ path_name: songName } , function(err, song) {
                if(err){
                    app.fatalError(null, err);
                }else{
                    if(song){ //Have song already
                        //Update song
                        song.title = data.title;
                        song.author = data.author;
                        song.level = data.level;
                        song.bpm = data.bpm;
                        song.genre = data.genre;
                        song.tags = data.tags;
                        song.path_name = songName;
                        //Update song data
                        Song.update({ path_name: songName }, song, function(err){
                            if(err){
                                app.fatalError(null, err);
                            }
                        });
                    }else{
                        //New song
                        var song = new Song();
                        song.title = data.title;
                        song.author = data.author;
                        song.level = data.level;
                        song.bpm = data.bpm;
                        song.genre = data.genre;
                        song.tags = data.tags;
                        song.path_name = songName;
                        song.save(function (err) {
                            if(err){
                                app.fatalError(null, err);
                            }
                        });
                    }
                }
            });
        }
        //Wipe song database
        //I have no idea how to do this yet

        for(var i = 0; i < songDirs.length; i++){
            //Reads track.json
            data = JSON.parse(app.fs.readFileSync( app.root + '/public/res/track/' + songDirs[i] + '/track.json', 'utf8'));
            replaceSong(data,songDirs[i]);
        }
    });

    //Import required models
    app.get('/song', app.passport.isLoggedIn, function(req, res){
        res.render('song', {
            layout: 'page-layout',
            scripts: [],
            styles: ['song'],
            title: app.title + ' - Songs',
            user: req.user,
            
        });
    });

    app.get('/api/song', app.passport.isLoggedIn, function(req, res){
        req.body.query;
    });
};