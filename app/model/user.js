var Comments = new Schema({
    title     : String
  , body      : String
  , date      : Date
});

var games = new Schema({
    author    : ObjectId,
    title     : String,
    body      : String,
    buf       : Buffer,
    date      : Date,
    comments  : [Comments]
  }
});

var game = mongoose.model('Game', Game);

User = {
  getById: function(id, callback){
    
    callback(this);
  }
}