/*
 * Notification Model
 *
 */
module.exports = function(app){
  var Schema = app.mg.Schema
  , ObjectId = Schema.ObjectId;

  var Notification = new Schema({
    message: { type: String },
    date: { type: Date, default: Date.now },
    viewed: { type: Boolean, default: false },
    owner: { type: Schema.ObjectId }
  });
  var notificationModel = app.mg.model('notification', NotificationSchema);
  var crpyto = require('crypto');
  return notificationModel;
}