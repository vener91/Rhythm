/**
 * Returns an configured auth object
 * Passport
 * @return Array passportObject
 */
exports.configurePassport = function(app, passport){
    var FacebookStrategy = require('passport-facebook').Strategy;
    var LocalStrategy = require('passport-local').Strategy;
    var FACEBOOK_APP_ID = "211982012211441";
    var FACEBOOK_APP_SECRET = "82526cb8ff9e61d2c0718439c2eab261";

    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "http://rhythm.no.de/auth/facebook/callback"
    }, function(accessToken, refreshToken, profile, done) {
        var User = require(__dirname + '/../app/model/user')(app);
        User.findOne({ facebook_id: profile.id }, function (err, user) {
            if(!user){
              //Does not exists, create user
              //Add user
              var user = new User();
              user.facebook_id = profile.id;
              user.save(function (err) {
                if(!err){
                  res.redirect('/err/');
                }
                return done(err, user);
              });
            }else{
              return done(err, user);  
            }
        });
    }));

    passport.use(new LocalStrategy(
      function(username, password, done) {
        var User = app.mg.model('user');
        process.nextTick(function () {
          // Find the user by username.  If there is no user with the given
          // username, or the password is not correct, set the user to `false` to
          // indicate failure.  Otherwise, return the authenticated `user`.
          User.findOne({username: username, password: User.hashPassword(password)}, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user);
          });
        });
      }
    ));

    passport.serializeUser(function(user, done) {
      done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        var User = app.mg.model('user');
        User.findById(id, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user);
        });
    });

    passport.isLoggedIn = function(req, res, next) {
      if (req.isAuthenticated()) { return next(); }
      res.redirect('/');
    }

    return passport;
}