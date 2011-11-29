
/**
 * Module dependencies.
 */

module.exports = function(app){
    app.get('/', function(req, res){
        res.render('site', {
            title: 'Rhythm Project',
            username: 'BeatsTap',
        });
    });
};