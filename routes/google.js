const express = require('express');
const passport = require('passport');
const axios = require('axios');
const router = express.Router();
const conf = require('../auth/conf');
const _ = require('lodash');



//login google
router.get('/',
  passport.authenticate('google',  conf.google.SCOPE));

// if you want to do something in callback url (right after login)
router.get('/callback',
  passport.authenticate('google', { failureRedirect: '' }),
  function(req, res) {
    var data = { title: 'google' , user: req.user};
    //console.log(req.user);
    res.render('afterLogin', data);
  });

router.get('/web', function(req, res) {
  var data = { title: 'Google Web' , user: req.user, message:null };
  res.render('google', data);
});
module.exports = router;
