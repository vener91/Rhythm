
/**
 * Module dependencies.
 */

module.exports = function(app){
    app.get('/', function(req, res){
        res.render('dash', {
            title: 'Rhythm Project'
        });
    });
};