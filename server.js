let express = require( "express" );
let morgan = require( "morgan" );
let mongoose = require( "mongoose" );
let bodyParser = require( "body-parser" );
let app = express();
let jsonParser = bodyParser.json();
let { LobbyList } = require( "./models/lobby-model" );
const { DATABASE_URL, PORT } = require( './config' );

mongoose.Promise = global.Promise;

// app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(morgan( "dev" ));
app.use(bodyParser.json());

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
    res.statusMessage = "Algo se cago con la DB";
    return res.status(500).json({
      code: 500,
      message: "Algo se cago con la DB"
    });
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
    }else{
      return res.status(200).json(lobby);
    }
  })
  .catch(error => {
    res.statusMessage = "Algo se cago con la DB";
    return res.status(500).json({
      code: 500,
      message: "Algo se cago con la DB"
    });
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
