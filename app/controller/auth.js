
/**
* Module dependencies.
*/
module.exports = function(app){
  app.get('/auth/facebook', app.passport.authenticate('facebook'), function(req, res){} );

  app.get('/auth/facebook/callback', app.passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/dash');
    });
};