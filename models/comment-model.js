let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;
mongoose.Promise = global.Promise;

var CommentSchema = new mongoose.Schema({
  player_name: {
    type: String,
    required: true
  },
  by_host: {
    type: Boolean,
    required: true,
    default: false
  },
  lobby_id: {
    type: ObjectId,
    required: true
  },
  desc: {
    type: String,
    required: true
  }
});

let Comment = mongoose.model("Comment", CommentSchema);

let CommentList = {

  getAll : function(){
    return Comment.find()
      .then(comments => {
        return comments;
      })
      .catch(error => {
        throw Error(error);
      });
  },

  getAllLobby : function(lobby_id){
    return Comment.find({lobby_id: mongoose.Types.ObjectId(lobby_id)})
      .then(comments => {
        return comments;
      })
      .catch(error => {
        throw Error(error);
      });
  },
}

module.exports = {CommentList}
