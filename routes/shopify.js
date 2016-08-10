'use strict';
const router = require('express').Router();
const conf = require('../auth/conf');
const Shopify = require('shopify-api-node');
const https = require('https');
const axios = require('axios');
const crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';


const SHOPIFY = {
  clientID: '49326cd0846d6b71e84c05a2458a46af',
  clientSecret: '7bf755b98f7370a67dceb75742bf4fff',
  scopes: 'read_content,read_products,read_customers,read_orders',
  callbackURL: 'http://www/boma.com:8090/shopify/callback',

  accessToken: 'c254ae17ae862e3e2e6da73443d0ea68',

  shopName: 'boma-test-store',
  state: 123123123
}

const shopify = new Shopify(SHOPIFY.shopName, SHOPIFY.accessToken);

//request login
router.get('/', function(req, res, next) {
	var redirectURL = 'https://boma-test-store.myshopify.com/admin/oauth/authorize?client_id=49326cd0846d6b71e84c05a2458a46af&scope=read_content,read_products,read_customers,read_orders&redirect_uri=http://http://zytedev.hopto.org/:8090/shopify/callback&state=123123123';
	res.redirect(redirectURL);

});


//request to get token
router.get('/callback', function(req, res, next) {
	SHOPIFY.code = req.query.code;
	console.log(req.query);
	let shop = req.query.shop;
	let state = req.query.state;
	let code = req.query.code;

	console.log(state==SHOPIFY.state);

	let baseURL = 'https://'+shop+'/admin/oauth/access_token';
	let body = {
		client_id: SHOPIFY.clientID,
		client_secret: SHOPIFY.clientSecret,
		code: code
	};

	axios.post(baseURL, body).then((resp) => {
		res.json(resp.data);
	});

});

router.get('/webhook/list', function(req, res, next) {
	const host = req.headers.host;

	// shopify.webhook.list({ page: 1 }).then((data) => {
	shopify.webhook.list().then((data) => {
		res.json(data);
	});

});

router.get('/webhook/get', function(req, res, next) {
	shopify.webhook.get(339897601).then((data) => {
		res.json(data);
	});

});

router.get('/webhook/create', function(req, res, next) {
	let body = {
		topic: 'products/update',
		address: 'http://requestb.in/1nhfex31',
		format: 'json',
		fields: ['id', 'handle', 'images', 'product_type', 'published_scope', 'tags',
						'title', 'metafields_global_title_tag', 'vendor', 'options']
	};

	shopify.webhook.create(body).then((data) => {
		res.json(data);
	}).catch((error) => {
		res.json(error);
		console.log(error);
	});

});

router.get('/webhook/update', function(req, res, next) {
	let body = {
		topic: 'products/update',
		address: 'http://requestb.in/zz0szfzz',
		format: 'json',
		fields: ['id', 'handle', 'images', 'product_type', 'published_scope', 'tags',
						'title', 'metafields_global_title_tag', 'vendor', 'options']
	};

	shopify.webhook.update(440777927, body).then((data) => {
		res.json(data);
	});

});

router.get('/webhook/delete', function(req, res, next) {
	shopify.webhook.delete(339899393).then((data) => {
		res.json(data);
	});

});

router.get('/encrypt', function(req, res, next) {
	var inputText = '+shopify_62';
	var encryptText = encrypt(inputText);
	var decryptText = decrypt(encryptText);

	var inputParam = req.query.text;
	var encryptParam = encrypt(inputParam);
	var decryptParam = decrypt(encryptParam);

	var data = {
		input: {
			inputText: inputText,
			encryptText: encryptText,
			decryptText: decryptText,
		},
		param: {
			inputParam: inputParam,
			encryptParam: encryptParam,
			decryptParam: decryptParam,
		}
	};
	res.json(data);

});

router.get('/send-data', function(req, res, next) {
	res.render('shopifySendData', {title: 'Shopify Send Data'});
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