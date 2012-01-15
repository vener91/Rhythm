/*
 * Notification Model
 *
 */
module.exports = function(app){
  var Schema = app.mg.Schema
  , ObjectId = Schema.ObjectId;

  var NotificationSchema = new Schema({
    title: { type: String },
    genre: {type: String, enum: ['Piano', 'followed', 'msg'] },
    tags: [String],
    path_name: { type: String }
  });
  var notificationModel = app.mg.model('notification', NotificationSchema);
  var crpyto = require('crypto');
  return notificationModel;
}