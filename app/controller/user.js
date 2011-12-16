/**
 * Module dependencies.
 */
module.exports = function(app){
    app.post('/auth/local', app.passport.authenticate('local', { failureRedirect: '/' }), function(req, res){
        res.redirect('/dash');
    });

    app.post('/signup', function(req, res){
        
        if(true){ //If user/email combo does not exist
            //Add user
            app.user.add(req.body.username, req.body.password, req.body.email, function(){
                //Add user to session
                req.session.login = true;
                res.redirect('/dash');
                res.render('dash', {
                    title: 'Rhythm Project - Dashboard'
                });
                //Add notification to thank user for signing up
                app.user(req.body.username).notify("Thanks for signing up")
            });
        }
    });
};