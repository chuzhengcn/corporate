
/**
 * Module dependencies.
 */
require('dotenv').load();
var express     = require('express'),
    init_routes = require('./routes'),
    http        = require('http'),
    path        = require('path'),
    app         = express();

// all environments
app.set('port', process.env.PORT || 18080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
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
