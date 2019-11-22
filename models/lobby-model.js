let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;
mongoose.Promise = global.Promise;

var LobbySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    default: "admin"
  },
  playerCount: {
    type: Number,
    default: 0
  },
  maxPlayerCount: {
    type: Number,
    max: 20,
    default: 10
  },
  hostName: {
    type: String,
    default: "admin"
  },
  started: {
    type: Boolean,
    default: false
  },
  updated: {
    type: Date,
    default: Date.now
  },
});

let Lobby = mongoose.model("Lobby", LobbySchema);

let LobbyList = {
  //Return all lobbies
  getAll : function(){
    return Lobby.find()
      .then(lobbies => {
        return lobbies;
      })
      .catch(error => {
        throw Error(error);
      });
  },

  //Get one Lobby
  getOne : function(lobby_id){
    return Lobby.findOne({"_id": mongoose.Types.ObjectId(lobby_id)})
      .then(lobby => {
        return lobby;
      })
      .catch(error => {
        throw Error(error);
      });
  },

  //Create new lobby
  post: function(newLobby){
    return Lobby.create(newLobby)
      .then(result => {
        return result;
      })
      .catch(error => {
        return Error(error);
      });
  },

  //Update player count
  putPlayerCount : function(lobby_id, increment){
    return Lobby.update(
      {"_id": mongoose.Types.ObjectId(lobby_id)},
      {
        $inc: {playerCount: increment},
        $set: { updated: new Date()}
      }
    ).then(result => {
      return result;
    })
    .catch(error => {
      return Error(error);
    });
  },

  start : function(lobby_id){
    return Lobby.update(
      {"_id": mongoose.Types.ObjectId(lobby_id)},
      {$set: { started: true, updated: new Date()}}
    ).then(result => {
      return result;
    })
    .catch(error => {
      return Error(error);
    });
  }

}

module.exports = {LobbyList}
