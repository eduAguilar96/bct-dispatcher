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

  //Create new lobby
  post: function(newLobby){
    return Lobby.create(newLobby)
      .then(result => {
        console.log("model - result");
        return result;
      })
      .catch(error => {
        console.log("model - error");
        return Error(error);
      });
  }

}

module.exports = {LobbyList}
