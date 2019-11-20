let express = require( "express" );
let app = express();
let morgan = require( "morgan" );
let mongoose = require( "mongoose" );
let bodyParser = require( "body-parser" );
let jsonParser = bodyParser.json();
// const { DATABASE_URL, PORT } = require( './config' );

mongoose.Promise = global.Promise;

// app.set('view engine', 'ejs')
app.use(express.static("public"));
// app.use(morgan( "dev" ));
app.use(bodyParser.json());

app.get('/', (req,res) => {
  console.log("get home");
  res.sendFile('/public/index.html', {root: __dirname});
});
app.get('/server-list', (req,res) => {
  console.log("get server list");
  res.sendFile('/public/index.html', {root: __dirname});
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

runServer( "8080", "mongodb://localhost/lobbyServer" )
	.catch( err => {
		console.log( err );
	});

module.exports = { app, runServer, closeServer };
