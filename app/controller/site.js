
/**
 * Module dependencies.
 */

module.exports = function(app){
    app.get('/', function(req, res, next) { if (req.isAuthenticated()) { res.redirect('/dash') }}, function(req, res){
        res.render('site', {
            title: 'Rhythm Project',
            scripts: [],
            styles: ['site'],
            username: 'BeatsTap',
        });
    });
    app.get('/err', function(req, res){
    	res.render('site', {
            title: 'Rhythm Project',
            scripts: [],
            styles: ['site'],
            err: '',
            username: 'BeatsTap',
        });
    });
};