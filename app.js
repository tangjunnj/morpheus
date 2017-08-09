var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var dynaRoute = require('./app/src/controller/DynamicRouteController.js')
var routeManage = require('./app/src/controller/RouteManageController.js')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app/src/view'));
app.set('view engine', 'ejs');

//// uncomment after placing your favicon in /public
////app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

//
//app.use('/', index);
//app.use('/users', users);

//// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});
//
//// error handler
//app.use(function(err, req, res, next) {
//  // set locals, only providing error in development
//  res.locals.message = err.message;
//  res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//  // render the error page
//  res.status(err.status || 500);
//  res.render('error');
//});
// Add headers

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.route('/')
    .all(function (req, res) {
      routeManage.show(req,res);
    });

app.route('/console/refresh')
.all( function (req, res) {
  dynaRoute.refresh(req,res);
})

app.route("/console/show")
.all(function(req,res) {
  routeManage.show(req,res);
});

app.route("/console/addRoute")
    .all(function(req,res) {
  routeManage.addRoute(req,res);
});

app.route("/console/delRoute")
    .all(function(req,res) {
  routeManage.delRoute(req,res);
});

app.route("/console/updateRoute")
    .all(function(req,res) {
      routeManage.updateRoute(req,res);
    });

dynaRoute.init(app,'./app/config/route.json')

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
