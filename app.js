var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto');

/* passport */
    var passport = require('passport');
    var FacebookStrategy = require('passport-facebook').Strategy;
    var GoogleStrategy = require('passport-google-oauth20');
    var config = require('./auth/conf');

var routes = require('./routes/index');
var facebook = require('./routes/facebook');
var instagram = require('./routes/instagram');
var shopify = require('./routes/shopify');
var events = require('./routes/event');
var external = require('./routes/external');
var google = require('./routes/google');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());

//for shopify webhook - check hmac
// app.use(bodyParser.json({
//   verify: function(req, res, buf, encoding) {
//       if (req.url.search('events/webhook') >= 0) {
//         const app_secret = '7bf755b98f7370a67dceb75742bf4fff';
//         var calculated_signature = crypto.createHmac('sha256', app_secret)
//             .update(buf)
//             .digest('base64');

//         if (calculated_signature != req.headers['x-shopify-hmac-sha256']) {
//             throw new Error('Invalid signature. Access denied');
//         }
//       }
//   }
// }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//for Webhooks
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});


/* passport - session */
    app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
      new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: config.facebook.profileFields,
        enableProof: true
      },
      function(accessToken, refreshToken, profile, cb) {
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;
        return cb(null, profile);
    }));

    passport.use(
        new GoogleStrategy.Strategy({
            clientID: config.google.ADWORDS_CLIENT_ID,
            clientSecret: config.google.ADWORDS_SECRET,
            callbackURL: config.google.ADWORDS_CALLBACK_URL
          },
          function(accessToken, refreshToken, profile, cb) {
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;
            return cb(null, profile);
          }
        )
      );

    passport.serializeUser(function(user, cb) {
      cb(null, user);
    });

    passport.deserializeUser(function(obj, cb) {
      cb(null, obj);
    });

app.use('/', routes);
app.use('/facebook', facebook);
app.use('/instagram', instagram);
app.use('/shopify', shopify);
app.use('/api', events);
app.use('/external', external);
app.use('/google', google);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});







module.exports = app;

////////for HTTPS
// const https = require('https');
// const fs = require('fs');
// const qs = require('querystring');
// const port2 = 443;
// var options = {
//   key: fs.readFileSync('./key.pem', 'utf8'),
//   cert: fs.readFileSync('./server.crt', 'utf8')
// };

// function handleRequest(req, res){
//   //Process Post Request
//   if(req.method === "POST"){

//     var data = '';

//     req.on('data', function(chunk){
//       data += chunk;
//     });

//     req.on('end', function(){
//       var parseData = qs.parse(data);
//       var prettyData = JSON.stringify(parseData, null, 2);
//       console.log("Post request with:\n" + prettyData);
//       res.json(prettyData);
//     });
//   } else { //Send a simple response
//     res.json('Everything works');
//   }
// }

// var httpsServer = https.createServer(options, function(req, res) {

// });
// httpsServer.listen(port2, function(){
//   console.log("Https server listening on port " + port2);
// });
////////////////////////
