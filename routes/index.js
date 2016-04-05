var express = require('express');
var passport = require('passport');
var router = express.Router();
var conf = require('../auth/conf');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/facebook', function(req, res, next) {
	var data = { title: 'facebook' };
  res.render('facebook', data);
});


// var failureFlash = 'Invalid username or password.';
// var successFlash = 'Welcome!';

//login facebook
router.post('/facebook', 
	passport.authenticate('facebook',  conf.facebook.options));

//after login facebook callback here with user info
//should have same callback url with [conf.facebook.callbackURL]
router.get('/facebook/callback', 
	passport.authenticate('facebook', { successRedirect : '/profile', failureRedirect: '/facebook' }));

/*
// if you want to do something in callback url (right after login)
app.get('/login/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
*/

//check loggedin facebook -> useing middleware [connect-ensure-login]
//to use ensureLoggedIn :: required npm install - not necessary
router.get('/profile', require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
		var data = { title: 'facebook' , user: req.user};
    res.render('profile', data);
});

module.exports = router;
