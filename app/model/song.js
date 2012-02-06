/*
 * Song Model
 *
 */
module.exports = function(app){
  var Schema = app.mg.Schema
  , ObjectId = Schema.ObjectId;

  var SongSchema = new Schema({
    title: { type: String },
    author: { type: String },
    level: {type: Number, min: 1, },
    bpm: {type: Number, min: 0, },
    genre: {type: String, enum: ['Piano', 'Classical', 'msg'] },
    tags: [String],
    path_name: { type: String },
    play_count: {type: Number, min: 0,}
  });
  var songModel = app.mg.model('song', SongSchema);
  return songModel;
}