
/**
 * Module dependencies.
 */

module.exports = function(app){
    app.get('/', function(req, res){
        res.render('site', {
            title: 'Rhythm Project',
            scripts: [],
            styles: ['site'],
            username: 'BeatsTap',
        });
    });
};