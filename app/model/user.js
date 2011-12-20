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
    verified: { type: Boolean, default: false }
    
  });
  UserSchema.statics.hashPassword = function(text){
      return crpyto.createHash('sha1').update(text).digest('hex');
  };
  UserSchema.methods.notifyUser = function(user, message, callback){
    //Notifies uers
    var Notification = require(__dirname + '/../app/model/notification')(app);
    var notification = new Notification();
    notification.message = message;
    notification.owner = user._id;
    notification.save(function(err){
      if(typeof(callback) === 'function'){
        callback(err);
      }
    });
  };
  
  var userModel = app.mg.model('user', UserSchema);
  var crpyto = require('crypto');
  return userModel;

  var test = {
    create: function(data, callback){
      var UserInstance = new UserModel();
      UserInstance.name     = data.name;
      UserInstance.password = data.password;
      UserInstance.email    = data.email;
      UserInstance.save(function (err) {
        if(typeof(callback) == 'function'){
          callback(err, UserInstance);
        }
      });
    },
    findOne: UserSchema.findOne,
    find: UserSchema.find,
    getById: function(id, callback){
      callback(this);
    }
  }
}