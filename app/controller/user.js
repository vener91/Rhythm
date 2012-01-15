module.exports = function(app){
    //Import required models
    app.post('/user/signup', function(req, res){
        var User = app.mg.model('user');
        var resCarry = res;
        var reqCarry = req;
        User.find({ $or: [ { username: req.body.username } , { email: req.body.email } ] } , function(err, users) {
            if(err){
                app.fatalError(resCarry, err);
            }else{
                if(!users.length){
                    //Add user
                    var user = new User();
                    user.username = req.body.username;
                    user.password = User.hashPassword(req.body.password);
                    user.email    = req.body.email;
                    user.save(function (err) {
                        if(err){
                            app.fatalError(resCarry, err);
                        }else{
                            //Auto auth this user
                            app.passport.authenticate('local', { failureRedirect: '/err/login/Invalid Password or Username' })(req, res, function(req, res){
                                //Add notification to thank user for signing up
                                resCarry.redirect('/dash');
                                user.notifyUser(user, "msg", "Thanks for signing up");
                            });
                        }
                    });
                } else {
                    resCarry.redirect('/err/signup/Username or Email taken');
                }
            }
        });
    });
    app.get('/user/settings', app.passport.isLoggedIn, function(req, res){
        res.render('user', {
            layout: 'page-layout',
            scripts: [],
            styles: ['user'],
            title: app.title + ' - User Settings',
            settings: {},
            user: req.user
        });
    });

};