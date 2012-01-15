module.exports = function(app){
    app.get('/dash', app.passport.isLoggedIn, function(req, res){
        res.render('dash', {
	        layout: 'page-layout',
            title: app.title + '- Dashboard',
            scripts: [],
            styles: ['dash'],
            user: req.user
        });
	});
};