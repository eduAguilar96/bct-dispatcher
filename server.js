let express = require( "express" );
var path = require('path');
let morgan = require( "morgan" );
let mongoose = require( "mongoose" );
let bodyParser = require( "body-parser" );
let app = express();
let jsonParser = bodyParser.json();
let { LobbyList } = require( "./models/lobby-model" );
let { PlayerList } = require( "./models/player-model" );
const { DATABASE_URL, PORT } = require( './config' );
const ejs = require('ejs');

mongoose.Promise = global.Promise;

// app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(morgan( "dev" ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set ("view engine", "ejs");
app.set('views', path.join(__dirname, '/public'));

//helpers
function databaseError(res, error){
  res.statusMessage = "Algo se cago con la DB";
  return res.status(500).json({
    code: 500,
    message: "Algo se cago con la DB"
  });
}

//Routes
app.get('/', (req,res) => {
  console.log("get home");
  res.render('index');
});
app.get('/about', (req,res) => {
  console.log("get about");
  res.render('about/index');
});
app.get('/game', (req, res) => {
  console.log("getting lobby with id:"+req.params.id);
  res.render('game/index', {
    lobby_id: req.params.lobby_id,
    player_id: req.params.player_id
  });
});

//Get all lobbies
app.get('/lobby', (req, res) => {
  console.log("getting all lobbies");
  LobbyList.getAll().then(lobbies => {
    return res.status(200).json(lobbies);
  })
  .catch(error => {
    databaseError(res, error);
  });
});

//start game
app.post('/gameStart', (req, res) => {
  let lobby_id = req.body.lobby_id;
  let available_roles = req.body.available_roles;
  LobbyList.start(lobby_id)
  .then(lobby => {
    return res.status(200).json(lobby);
  }).catch(error => {
    databaseError(res, error);
  });
});

//get game state
app.post('/gameState', (req, res) => {
  let player_id = req.body.player_id;
  let lobby_id = req.body.lobby_id;
  LobbyList.getOne(lobby_id)
  .then(lobby => {
    if(lobby != null){
      // if(player_id == 0){
      PlayerList.getLobbyPlayers(lobby_id)
      .then(players => {
        return res.status(200).json({
          code: 200,
          message: "Game state",
          role: "unassigned",
          started: lobby.started,
          extra: {},
          lobbyName: lobby.name,
          players: players,
          maxPlayerCount: lobby.maxPlayerCount
        });
      })
      .catch(error => {
        databaseError(error);
      });
      // }
      // else{
      //   return res.status(200).json({
      //     code: 200,
      //     message: "Game state",
      //     role: "unassigned",
      //     started: lobby.started,
      //     extra: {},
      //     lobbyName: lobby.name
      //   });
      // }
    }
    else{
      return res.status(404).json({
        code: 404,
        message: "Could'nt find game state"
      })
    }
  })
  .catch(error => {
    databaseError(error);
  });
});

//Create new lobby
app.post("/lobby", (req, res) => {
  console.log("creating lobby");
  let hostName = req.body.hostName;
  let name = req.body.name;
  let password = req.body.password;
  let maxPlayerCount = req.body.maxPlayerCount;
  let newLobby = {
    hostName: hostName,
    name: name,
    password: password,
    maxPlayerCount: maxPlayerCount
  }
  console.log(newLobby);
  LobbyList.post(newLobby).then(lobby => {
    if(Object.entries(lobby).length === 0){
      return res.status(400).json({
        code: 400,
        message: "La regaste con algo bruh"
      });
    }
    else{
      return res.status(200).json(lobby);
    }
  })
  .catch(error => {
    databaseError(res, error);
  });
});

//Log in player to lobby
app.post("/player", (req, res) => {
  let password = req.body.password;
  let name = req.body.username;
  let lobby_id = req.body.lobby_id;
  //get lobby to join
  LobbyList.getOne(lobby_id)
  .then(lobby =>{
    //check if found lobby
    let emptyLobbyResult = lobby == null;
    if(!emptyLobbyResult){
      //if password is ok
      if(lobby.password == password){
        //check if user is Host
        let playerIsHost = lobby.hostName == name;
        if(playerIsHost){
          return res.status(200).json({
            code: 200,
            message: "Player is Host",
            lobby_id: lobby_id,
            player_id: "0"
          });
        }
        //check if user is in room
        else{
          PlayerList.getOneLobby(name, lobby_id)
          .then(player => {
            let emptyPlayerResult = player == null;
            //user not in lobby and lobby is full
            if(emptyPlayerResult && lobby.playerCount >= lobby.maxPlayerCount){
              console.log("Room is full");
              return res.status(400).json({
                code: 400,
                message: "Esta lleno el lobby bruh"
              });
            }
            //there is space in lobby
            else if(emptyPlayerResult){
              //check if game has started
              if(lobby.started){
                console.log("Game has already started");
                return res.status(400).json({
                  code: 400,
                  message: "Ya empezo el juego bruh"
                });
              }
              //game has'nt started
              else{
                let newPlayer = {
                  name: name,
                  lobby_id: mongoose.Types.ObjectId(lobby_id)
                }
                PlayerList.post(newPlayer)
                .then(player => {
                  //if player not created
                  if(Object.entries(player).length === 0){
                    return res.status(400).json({
                      code: 400,
                      message: "La regaste con algo bruh"
                    });
                  }
                  else{
                    LobbyList.putPlayerCount(lobby_id, 1).then(() =>{
                      return res.status(200).json({
                        code: 200,
                        message: "Room in lobby, creating player",
                        lobby_id: lobby_id,
                        player_id: player._id
                      });
                    });
                  }
                })
                .catch(error => {
                  databaseError(res, error);
                });
              }
            }
            //player already in room, login
            else{
              console.log("player already in room");
              return res.status(200).json({
                code: 200,
                message: "Player in Room, logging in",
                lobby_id: lobby_id,
                player_id: player._id
              });
            }
          })
          .catch(error => {
            databaseError(res, error);
          });
        }
      }
      else{
        return res.status(400).json({
          code: 400,
          message: "Wrong password bruh"
        });
      }
    }
    else{
      return res.status(400).json({
        code: 404,
        message: "Lobby not found"
      });
    }
  })
  .catch(error => {
    databaseError(res, error);
  });
});

let server;

function runServer(port, databaseUrl){
	return new Promise( (resolve, reject ) => {
		mongoose.connect(databaseUrl, {useNewUrlParser: true, useUnifiedTopology: true}, response => {
			if ( response ){
				return reject(response);
			}
      else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
					}
					else{
						resolve();
					}
				});
			});
		});
}

runServer( PORT, DATABASE_URL )
	.catch( err => {
		console.log( err );
	});

module.exports = { app, runServer, closeServer };
