/*
 * User controller
 *
 */
module.exports = function(app){
  var Schema = app.mg.Schema
  , ObjectId = Schema.ObjectId;

  var UserSchema = new Schema({
    username: { type: String, validate: [function(v){
      try{
        app.check(v).notContains(' '); 
      }catch(e){
        return false;    
      }
      return true;
    }, 'Invalid Username']},
    password: String,
    email_address: { type: String, validate: [function(v){ 
      try{
        app.check(v).isEmail(); 
      }catch(e){
        return false;    
      }
      return true;
      }, 'Invalid Email']},
    facebook_id: { type: String },
    join_date: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
    level: { type: Number, min: 0, max: 100, default: 1 }, //Max level of 100
    level_up_exp : { type: Number, min: 0, default: 0 },
    sockets: [String],
    recently_played: [String]
  });
  UserSchema.statics.hashPassword = function(text){
    return crpyto.createHash('sha1').update(text).digest('hex');
  };
  
  UserSchema.statics.getExp = function(level){
    return level * level * level; //Experince growth rate formula
  };

  UserSchema.methods.notifyUser = function(user, type, message, callback){
    //Notifies uers
    var Notification = require(__dirname + '/notification')(app);
    var notification = new Notification();
    notification.message = message;
    notification.owner = user._id;
    notification.type = type;
    notification.save(function(err){
      if(typeof(callback) === 'function'){
        //Sent notification via sockets
        //Get responsible sockets
        callback(err);
      }
    });
  };
  app.mg.model('user', UserSchema);
  var crpyto = require('crypto');
  return app.mg;
}