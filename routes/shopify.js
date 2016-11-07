'use strict';
const router = require('express').Router();
const conf = require('../auth/conf');
const Shopify = require('shopify-api-node');
const https = require('https');
const axios = require('axios');
const Promise = require('bluebird');
const _ = require('lodash');
const crypto = require('crypto'),
	algorithm = 'aes-256-ctr',
	password = 'd6F3Efeq';


const SHOPIFY = {
  clientID: '49326cd0846d6b71e84c05a2458a46af',
  clientSecret: '7bf755b98f7370a67dceb75742bf4fff',
  scopes: 'read_content,read_products,read_customers,read_orders,read_script_tags,write_script_tags',
  callbackURL: 'http://www/boma.com:8090/shopify/callback',

  accessToken: '9b835e5ee3163ac832ec3799e8dc3bb6',

  shopName: 'philipsstore',
  state: 123123123
}

const shopify = new Shopify(SHOPIFY.shopName, SHOPIFY.accessToken);

//request login
router.get('/', function(req, res, next) {
	var redirectURL = 'https://philipsstore.myshopify.com/admin/oauth/authorize?client_id=49326cd0846d6b71e84c05a2458a46af&scope=read_content,read_products,read_customers,read_orders&redirect_uri=http://http://zytedev.hopto.org/:8090/shopify/callback&state=123123123';
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

///////////////////////////// Script Tag

router.get('/script/info', function(req, res, next) {
	try {
		Promise.coroutine(function *(){
			var domain = req.query.domain || '90384ebc';
			if (domain.indexOf('.') < 0) {
				domain += '.ngrok.io';
			}
			const bomaToken = req.query.bomaToken || '4f9ddc9f31787e690f1fb1';
			const params = {
				src: 'https://'+domain+'/boma.js?bomaToken='+bomaToken,
				display_scope: 'all'
			};
			const list = yield shopify.scriptTag.list(params);
			const count = yield shopify.scriptTag.count(params);
			res.json({
				params: params,
				count: count,
				list: list,
			});
		})();

	} catch (e) {
		console.error(e);
		res.json(e);
	}
});

router.get('/script/create', function(req, res, next) {
	try {
		Promise.coroutine(function *(){
			var domain = req.query.domain || '90384ebc';
			if (domain.indexOf('.') < 0) {
				domain += '.ngrok.io';
			}
			const bomaToken = req.query.bomaToken || '4f9ddc9f31787e690f1fb1';
			const params = {
				src: 'https://'+domain+'/boma.js?bomaToken='+bomaToken,
				event: 'onload',
				display_scope: 'all'
			};

			const data = yield shopify.scriptTag.create(params);
			res.json(data);
		})();

	} catch (e) {
		console.error(e);
		res.json(e);
	}
});

router.get('/script/update', function(req, res, next) {
	try {
		Promise.coroutine(function *(){
			const id = req.query.id || '103934855';
			var domain = req.query.domain || '90384ebc';
			if (domain.indexOf('.') < 0) {
				domain += '.ngrok.io';
			}
			const bomaToken = req.query.bomaToken || '4f9ddc9f31787e690f1fb1';
			const params = {
				src: 'https://'+domain+'/boma.js?bomaToken='+bomaToken,
				id: id,
			};

			const data = yield shopify.scriptTag.update(id, params);
			res.json(data);
		})();

	} catch (e) {
		console.error(e);
		res.json(e);
	}
});

router.get('/script/delete', function(req, res, next) {
	try {
		Promise.coroutine(function *(){
			const id = req.query.id || '103991047';
			const data = yield shopify.scriptTag.delete(id);
			res.json(data);
		})();

	} catch (e) {
		console.error(e);
		res.json(e);
	}
});

/////////////////////////////////// Webhooks

router.get('/webhook/list', function(req, res, next) {
	try {
		const host = req.headers.host;

		// shopify.webhook.list({ page: 1 }).then((data) => {
		shopify.webhook.list().then((data) => {
			res.json(data);
		});

	} catch (e) {
		console.error(e);
		res.json(e);
	}

});

router.get('/webhook/get', function(req, res, next) {
	try {
		shopify.webhook.get(339897601).then((data) => {
			res.json(data);
		});

	} catch (e) {
		console.error(e);
		res.json(e);
	}

});

router.get('/webhook/create', function(req, res, next) {
	let body = {
		topic: 'orders/updated',
		address: 'http://development-webapi.ap-southeast-2.elasticbeanstalk.com/api/events/webhook/449ddc9f31787e690f1fb5/orders/updated',
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
	var id = req.query.id;
	if(_.isUndefined(id)) {
		id = 440777927;
	}
	let body = {
		topic: 'products/update',
		address: 'http://requestb.in/1lfyqqe1',
		format: 'json',
		fields: ['id', 'handle', 'images', 'product_type', 'published_scope', 'tags',
						'title', 'metafields_global_title_tag', 'vendor', 'options']
	};

	shopify.webhook.update(id, body).then((data) => {
		res.json(data);
	});

});

router.get('/webhook/delete', function(req, res, next) {
  Promise.coroutine(function *(){
		var id = req.query.id;
		if (id) {
			const ps = shopify.webhook.delete(id);
			ps.then(()=>{
				res.json({ deleted: 'success' });
			});
		} else {
	  	var allPromises = [];
	  	var list = yield shopify.webhook.list();

			// shopify.webhook.list().then((webhook) => {
			// 	allPromises.push(shopify.webhook.delete(webhook.id));
			// });
	  	_(list).forEach((webhook) => {
	  		console.log('delete: '+webhook.id);
	  		allPromises.push(shopify.webhook.delete(webhook.id));
	  	});

			Promise.all(allPromises).then(() => {
				res.json({ deleted: 'success' });
			});

		}

  })();

});

router.get('/encrypt', function(req, res, next) {
	try  {
		var inputText = _.isEmpty(req.query.text) ? '+shopify_61_393' : '+'+req.query.text;
		var encryptText = encrypt(inputText);

		var inputParam = _.isEmpty(req.query.dec) ? '4f88d5932473777f3b76b25ccdb74eca' : req.query.dec;
		var decryptParam = decrypt(inputParam);

		var data = {
			input: {
				inputText: inputText,
				encryptText: encryptText,
			},
			param: {
				inputParam: inputParam,
				decryptParam: decryptParam,
			}
		};
		res.json(data);
	} catch(error) {
		console.log(error);
		res.json(error);
	}

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
