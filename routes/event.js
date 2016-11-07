'use strict';
const router = require('express').Router();
const conf = require('../auth/conf');
const Shopify = require('shopify-api-node');
const https = require('https');
const axios = require('axios');
const _ = require('lodash');
const crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  password = 'd6F3Efeq';

router.get('/events/webhook/:webhookToken/:eventType', function(req, res, next) {
  res.json({ read: 'ok'});
});

router.post('/events/webhook/:webhookToken/:eventType', function(req, res, next) {
    const webhookToken = _.get(req, 'params.webhookToken');
    const eventType = _.get(req, 'params.eventType');
    const details = _.get(req, 'body');


    const decryptToken = decrypt(webhookToken);
    const decryptTokenArray = decryptToken.split('_');

    console.log('---------------------');
    console.log(decryptTokenArray);
    console.log('--------------------');

    console.log(details);
    res.json(details);
});

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

module.exports = router;
