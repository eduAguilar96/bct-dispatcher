let express = require( "express" );
let morgan = require( "morgan" );
let mongoose = require( "mongoose" );
let bodyParser = require( "body-parser" );
let app = express();
let jsonParser = bodyParser.json();
let { LobbyList } = require( "./models/lobby-model" );
let { PlayerList } = require( "./models/player-model" );
const { DATABASE_URL, PORT } = require( './config' );

mongoose.Promise = global.Promise;

// app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(morgan( "dev" ));
app.use(bodyParser.json());

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
  res.sendFile('/public/index.html', {root: __dirname});
});

//Gets
app.get('/lobby/:id', (req, res) => {
  console.log("getting lobby with id:"+req.params.id);
});

app.get('/lobby', (req, res) => {
  console.log("getting all lobbies");
  LobbyList.getAll().then(lobbies => {
    return res.status(200).json(lobbies);
  })
  .catch(error => {
    databaseError(res, error);
  });
});

//post
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

app.post("/player", (req, res) => {
  let password = req.body.password;
  console.log("req.password: "+ password);
  let name = req.body.username;
  console.log("req.name: "+ name);
  let lobby_id = req.body.lobby_id;
  console.log("req.lobby_id: "+ lobby_id);
  //get lobby to join
  LobbyList.getOne(lobby_id)
    .then(lobby =>{
      //check if found lobby
      let emptyLobbyResult = lobby == null;
      console.log("got lobby: "+ lobby);

      if(!emptyLobbyResult){
        //if password is ok
        if(lobby.password == password){
          //check if user in room
          console.log(lobby.hostName +" == "+name);
          let playerIsHost = lobby.hostName == name;
          if(playerIsHost){
            return res.status(200).json({
              code: 200,
              message: "Player is Host",
              lobby_id: lobby_id,
              player_id: "0"
            });
          }else{
            console.log("gonna search for player");
            PlayerList.getOneLobby(name, lobby_id)
              .then(player => {
                console.log("got player: "+player);
                let emptyPlayerResult = player == null;
                console.log("emptyPlayerResult: "+ emptyPlayerResult);
                if(emptyPlayerResult && lobby.playerCount >= lobby.maxPlayerCount){
                  //user not in lobby and lobby is full
                  console.log("Room is full");
                  return res.status(400).json({
                    code: 400,
                    message: "Esta lleno el lobby bruh"
                  });
                }
                else if(emptyPlayerResult){
                  //there is space in lobby
                  console.log("space in room");
                  let newPlayer = {
                    name: name,
                    lobby_id: mongoose.Types.ObjectId(lobby_id)
                  }
                  PlayerList.post(newPlayer)
                    .then(player => {
                      return res.status(200).json({
                        code: 200,
                        message: "Player in Room, logging in",
                        lobby_id: lobby_id,
                        player_id: player._id
                      });
                    })
                    .catch(error => {
                      databaseError(res, error);
                    });

                }else{
                  //player already in room, login
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
      }else{
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
