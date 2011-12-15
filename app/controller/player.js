
/**
 * Module dependencies.
 */

module.exports = function(app){
    app.get('/player', function(req, res){
        res.render('player', {
	        layout: 'page-layout',
            scripts: ['player', 'webgl-2d'],
            styles: ['player'],
            title: 'Rhythm Project'
        });
    });
};