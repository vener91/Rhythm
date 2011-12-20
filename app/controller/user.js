module.exports = function(app){
    //Import required models
    User = app.mg.model('user');

    app.post('/user/signup', function(req, res){
        User.findOne({email: req.body.email}, function(err, user) {
            if(!err && !user){
                //Add user
                var user = new User();
                user.username = req.body.username;
                user.password = User.hashPassword(req.body.password);
                user.email    = req.body.email;
                user.save(function (err) {
                    if(err == null){
                        //Auto auth this user
                        app.passport.authenticate('local', { failureRedirect: '/' })(req, res, function(req, res){
                            //Add notification to thank user for signing up
                            User.notifyUser(user, "Thanks for signing up");
                            res.redirect('/dash');
                        });
                    }else{
                        res.redirect('/err/');
                    }
                });
            }
        });
    });
};