/*
 * Notification Model
 *
 */
module.exports = function(app){
  var Schema = app.mg.Schema
  , ObjectId = Schema.ObjectId;

  var NotificationSchema = new Schema({
    message: { type: String },
    type: { type: String, enum: ['invite', 'followed', 'msg'] },
    date: { type: Date, default: Date.now },
    viewed: { type: Boolean, default: false },
    owner: { type: Schema.ObjectId }
  });
  var notificationModel = app.mg.model('notification', NotificationSchema);
  return notificationModel;
}