
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var team = require('./routes/team');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

team.init();

app.get('/', routes.index);
app.post('/addPlayer', team.addPlayer);
app.post('/changeComposition', team.changeComposition);
app.post('/updatePlayers', team.updatePlayers);
app.get('/getAmount', team.getAmount);
app.get('/playerList', team.getPlayerList);
app.post('/teamName', team.teamName);
//app.get('/addPlayer', team.addPlayer);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
