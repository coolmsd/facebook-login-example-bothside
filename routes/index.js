var express = require('express');
var passport = require('passport');
var axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('routeList', { title: 'Route List' });
});


router.get('/main', function(req, res, next) {
  res.render('index', { title: 'Test' });
});



//check loggedin facebook -> useing middleware [connect-ensure-login]
//to use [connect-ensure-login] :: required npm install
router.get('/profile', require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
		var data = { title: 'facebook' , user: req.user};
    res.render('profile', data);
});

router.get('/getAdPreview', require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    var data = { title: 'getAdPreview' , user: req.user};
    res.render('adPreview', data);
});

/* if ensureLoggedIn() fail to get login info from facebook(session)
* connect-ensure-login send to /login
*/
router.get('/login', function(req, res, next) {
  res.redirect('/facebook');
});


module.exports = router;
