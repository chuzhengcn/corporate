
/**
 * Module dependencies.
 */
require('dotenv').load();

var express     = require('express'),
    init_routes = require('./routes'),
    http        = require('http'),
    path        = require('path'),
    config      = require('./config/index'),
    mongoose    = require('mongoose'),
    app         = express();

var connect = function () {
    var options = { server: { socketOptions: { keepAlive: 1 } } }
    mongoose.connect(config.db, options)
}
connect()

mongoose.connection.on('open', function() {
    console.log('db connected')
})

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err)
})

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  connect()
})

// all environments
app.set('port', process.env.PORT || 18080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname }))
app.use(express.methodOverride());
app.use(express.cookieParser('feiyesoft'))
app.use(express.cookieSession({key : 'xiaoxiong'}))
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// routes info
init_routes(app)

http.createServer(app).listen(app.get('port'), function(){
    console.log('feiyesoft server listening on port ' + app.get('port'));
});
