let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;
mongoose.Promise = global.Promise;

var PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    min: 0,
    max: 22,
    default: 0
  },
  lobby_id: {
    type: ObjectId,
    required: true
  }
});

let Player = mongoose.model("Player", PlayerSchema);

let PlayerList = {
  //Return all
  getAll : function(){
    return Player.find()
      .then(players => {
        return players;
      })
      .catch(error => {
        throw Error(error);
      });
  },

  getLobby : function(lobby_id){
    return Player.find({lobby_id: lobby_id})
      .then(players => {
        return players;
      })
      .catch(error => {
        throw Error(error);
      });
  },

  getOne : function(player_id){
    return Player.findOne({_id: player_id})
      .then(player => {
        return player;
      })
      .catch(error => {
        throw Error(error);
      });
  },

  getOneLobby : function(player_name, lobby_id){
    return Player.findOne({name: player_name, lobby_id: lobby_id})
      .then(player => {
        return player;
      })
      .catch(error => {
        throw Error(error);
      });
  },

  post : function(newPlayer){
    return Player.create(newPlayer)
      .then(result => {
        return result;
      })
      .catch(error => {
        return Error(error);
      });
  }
}

module.exports = {PlayerList}
