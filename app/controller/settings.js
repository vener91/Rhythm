module.exports = function(app){
    app.post('/settings', app.passport.isLoggedIn, function(req, res){
        res.render('settings', {
            layout: 'page-layout',
            scripts: [],
            styles: ['settings'],
            title: app.title + ' - Settings',
            settings: {}
        });
    });
};