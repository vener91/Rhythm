module.exports = function(app){
    app.get('/dash', app.passport.isLoggedIn, function(req, res){
        res.render('dash', {
            title: app.title + '- Dashboard',
            scripts: [],
            styles: [],
        });
	});
};