
/**
 * Module dependencies.
 */

module.exports = function(app){
    app.get('/', function(req, res, next) { if (req.isAuthenticated()) { res.redirect('/dash'); } else { next(); } }, function(req, res){
        res.render('site', {
            title: 'Rhythm Project',
            scripts: [],
            styles: ['site'],
            err: {
                login: '',
                signup: ''
            },
        });
    });
    app.get('/err/*', function(req, res){
        var errorMsg = req.params[0].split(/\//);
        res.render('site', {
            title: 'Rhythm Project',
            scripts: [],
            styles: ['site'],
            err: {
                login: (errorMsg[0] == 'login') ? errorMsg[1] : '',
                signup: (errorMsg[0] == 'signup') ? errorMsg[1] : ''
            },
        });
    });
    app.get('/fatalerror', function(req, res){
       app.fatalError(res); 
    });
};