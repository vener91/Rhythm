
/**
* Module dependencies.
*/
module.exports = function(app){
  app.get('/auth/facebook', app.passport.authenticate('facebook'), function(req, res){} );

  app.get('/auth/facebook/callback', app.passport.authenticate('facebook', { failureRedirect: '/err/login/Facebook Auth Failed' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/dash');
  });

  app.post('/auth/local', app.passport.authenticate('local', { failureRedirect: '/err/login/Invalid Password or Username' }), function(req, res){
    // Successful authentication, redirect home.
    res.redirect('/dash');
  });

  app.get('/auth/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
};