
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
            app.user.add(req.body.username, req.body.password, req.body.email, function(){
                //Add user to session
                req.session.login = true;
                res.render('dash', {
                    title: 'Rhythm Project - Dashboard'
                });
            });
        }
    //Add notification to thanks user for signing up
    });
    
    app.user = function(username){
        return this.init(username);
        this.init = function(username){
            //Do initalization
            this.fn = this; //Forwards it so that fn.x can be used
            return this.fn;
        }
        this.fn.verifyUser = function(data){
            
        };
        this.fn.verify = function(data){
            
        };
        this.fn.add = function(data, callback){
            //Validation code goes here
            if(!this.fn.verify(data)){
                if(typeof(callback) === 'function'){
                    callback(VERIFY_FAILED);
                }
            }
            //Verified, ready to insert
            app.db.insert('users',{
                username: data.username,
                password: app.sha1(data.password),
                email: data.email
            });
            if(typeof(callback) === 'function'){
                callback();
            }
        };
    }
};