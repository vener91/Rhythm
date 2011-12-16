/**
 * Returns an configured auth object
 * Passport
 * @return Array passportObject
 */
exports.configurePassport = function(passport){
    var FacebookStrategy = require('passport-facebook').Strategy;

    var FACEBOOK_APP_ID = "211982012211441";
    var FACEBOOK_APP_SECRET = "82526cb8ff9e61d2c0718439c2eab261";

    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost/auth/facebook/callback"
    }, function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }));
    return passport;
}