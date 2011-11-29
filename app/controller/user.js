
/**
 * Module dependencies.
 */

module.exports = function(app){
    app.post('/login', function(req, res){
        res.render('dash', {
            title: 'Rhythm Project - Dashboard'
        });
    });
    app.post('/signup', function(req, res){
        
        if(true){ //If user/email combo does not exist
            //Add user
            app.user.add(req.body.name, req.body.password, req.body.email, function(){
                res.render('dash', {
                    title: 'Rhythm Project - Dashboard'
                });
            });
        }
        //Add notification to thanks user for signing up
    });
    
    app.user = {
        add: function(name, password, email, callback){
            if(typeof(callback) === 'function'){
                callback();
            }
        }
    }
};