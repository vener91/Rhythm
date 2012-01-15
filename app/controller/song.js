module.exports = function(app){
    //Import required models
    app.get('/song', app.passport.isLoggedIn, function(req, res){
        res.render('song', {
            layout: 'page-layout',
            scripts: [],
            styles: ['song'],
            title: app.title + ' - Songs',
            user: req.user
        });
    });
};