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

app.get('/', function (req, res) {
  routeManage.show(req,res);
})

app.use('/console/refresh', function (req, res) {
  dynaRoute.refresh(req,res);
})

app.get("/console/show",function(req,res) {
  routeManage.show(req,res);
});

app.use("/console/updateRoute",function(req,res) {
  routeManage.updateRoute(req,res);
});

app.use("/console/addRoute",function(req,res) {
  routeManage.addRoute(req,res);
});

app.get("/console/delRoute",function(req,res) {
  routeManage.delRoute(req,res);
});

dynaRoute.init(app,'./app/config/route.json')

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
