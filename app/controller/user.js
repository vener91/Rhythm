
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
                //Add user to session
                req.session.login = true;
                res.render('dash', {
                    title: 'Rhythm Project - Dashboard'
                });
            });
        }
    //Add notification to thanks user for signing up
    });
    
    app.user = {
        add: function(name, password, email, callback){
            //Validation code goes here
            console.info(app.db);
            //Verified, ready to insert
            app.db.insert('users',{
                name: name,
                password: app.sha1(password),
                email: email
            });
            if(typeof(callback) === 'function'){
                callback();
            }
        }
    }
};