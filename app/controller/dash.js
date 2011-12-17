
/**
 * Module dependencies.
 */

module.exports = function(app){
    app.post('/dash',passport.authenticate('local', { failureRedirect: '/' }), function(req, res){
        res.render('dash', {
            title: app.title + '- Dashboard'
        });
    });
};
        