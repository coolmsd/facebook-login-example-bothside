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
  callbackURL: 'http://localhost.io:8000/shopify/callback',

  // accessToken: '9b835e5ee3163ac832ec3799e8dc3bb6',
	// shopName: 'philipsstore',
  accessToken: '080979bd5b28fae1b6dac1f3af0564e2',
  shopName: 'boma-demo-store',

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

///////////////////////////// shop

router.get('/shop', function(req, res, next) {
	Promise.coroutine(function *(){
		var shop = yield shopify.shop.get();
		res.json(shop);
	})();
});

///////////////////////////// Script Tag

router.get('/script/info', function(req, res, next) {
	try {
		Promise.coroutine(function *(){
			var host = req.query.host || req.headers.host || 'boma-development.ap-southeast-2.elasticbeanstalk.com';
			const bomaToken = req.query.bomaToken || '1fccc7982e6156713d4ca657b0f31492bf4694a7c3f3d27671eb19348d906a779b55a2c695cacc0a9a9c2929a71c9fdceb4feab05128f92cc4a88ca32f298679';
			const params = {
				src: 'https://'+host+'/boma.js?bomaToken='+bomaToken,
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
			var host = req.query.host || req.headers.host || 'boma-development.ap-southeast-2.elasticbeanstalk.com';
			// const bomaToken = req.query.bomaToken || '1fccc78932657d7d024ce24fa8a1089ea05bb7adc3f3d86936e517779d8a7676904cb9c7d1d2c019cc';
			const bomaToken = req.query.bomaToken || '1fccc7982e6156713d4ca657b0f31492bf4694a7c3f3d27671eb19348d906a779b55a2c695cacc0a9a9c2929a71c9fdceb4feab05128f92cc4a88ca32f298679';
			const params = {
				src: 'https://'+host+'/boma.js?bomaToken='+bomaToken,
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
			var host = req.query.host || req.headers.host || 'boma-development.ap-southeast-2.elasticbeanstalk.com';

			const bomaToken = req.query.bomaToken || '1fccc78932657d7d024ce24fa8a1089ea05bb7adc3f3d86936e517779d8a7676904cb9c7d1d2c019cc';
			const params = {
				src: 'https://'+host+'/boma.js?bomaToken='+bomaToken,
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
		var host = req.query.host || req.headers.host || 'boma-development.ap-southeast-2.elasticbeanstalk.com';

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
	var host = req.query.host || req.headers.host || 'boma-development.ap-southeast-2.elasticbeanstalk.com';
	let body = {
		topic: 'orders/updated',
		address: 'http://'+host+'/api/events/webhook/449ddc9f31787e690f1fb5/orders/updated',
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
	var host = req.query.host || req.headers.host || 'boma-development.ap-southeast-2.elasticbeanstalk.com';

	if (id) {
		let body = {
			topic: 'products/update',
			address: 'http://'+host,
			format: 'json',
			fields: ['id', 'handle', 'images', 'product_type', 'published_scope', 'tags',
			'title', 'metafields_global_title_tag', 'vendor', 'options']
		};

		shopify.webhook.update(id, body).then((data) => {
			res.json(data);
		});

	} else {
		res.json({});
	}

});

router.get('/webhook/delete', function(req, res, next) {
  Promise.coroutine(function *(){
		var id = req.query.id;
		var host = req.query.host || req.headers.host || 'boma-development.ap-southeast-2.elasticbeanstalk.com';
		const bomaToken = req.query.bomaToken;

		if (id) {
			const ps = shopify.webhook.delete(id);
			ps.then(()=>{
				res.json({ deleted: 'success' });
			});
		} else {
	  	var allPromises = [];
	  	var list = yield shopify.webhook.list();

	  	_(list).forEach((webhook) => {
        if (_.isEmpty(bomaToken) && webhook.address.indexOf(host) > -1) {
					console.log('webhook.host: '+webhook.host);
					allPromises.push(shopify.webhook.delete(webhook.id));
		  	} else if (_.isEmpty(bomaToken) && webhook.address.indexOf(bomaToken) > -1) {
					console.log('webhook.bomaToken: '+webhook.bomaToken);
					allPromises.push(shopify.webhook.delete(webhook.id));
				}
	  	});

			Promise.all(allPromises).then(() => {
				res.json({ deleted: 'success', id, host });
			});

		}

  })();

});

router.get('/encrypt', function(req, res, next) {
	try  {
		var email = _.get(req.query, 'email');
		var shopId = _.get(req.query, 'shopId');
		var actionId = _.get(req.query, 'actionId');
		var systemRef = _.get(req.query, 'ref', 'facebook');
		var accountId = _.get(req.query, 'accountId', 1); //1 for demo / 2 for testing
		var shopName = _.get(req.query, 'shopName', 'philipsstore');
		var extraParameters = {};

		if (!_.isEmpty(shopId)) {
			extraParameters.shopId = shopId;
		}
		if (!_.isEmpty(actionId)) {
			extraParameters.scheduledActionId = actionId;
		}
		if (!_.isEmpty(email)) {
			extraParameters.email = email;
		}
		if (!_.isEmpty(shopName)) {
			extraParameters.shopName = shopName;
		}
		if (systemRef!=="sendGrid") {
			systemRef = "+"+systemRef;
		}
		var encryptToken = encrypt(systemRef, accountId, extraParameters);
		var data = {
			output: {
				encryptToken: encryptToken
			},
			input: {
				systemRef: systemRef,
				accountId: accountId,
				extraParameters: extraParameters,
			},
			optionalParams: {
				systemRef: "ref",
				accountId: "accountId",
				scheduledActionId: "actionId",
				email: "email",
			}
		};
		res.json(data);
	} catch(error) {
		console.log(error);
		res.json(error);
	}

});

router.get('/decrypt', function(req, res, next) {
	try  {
		var token = _.get(req.query, 'token');
		var decryptToken = decrypt(token);

		var tokenContent = JSON.parse(decryptToken);
		var decryptData = _.assign({}, {
			systemRef: tokenContent.systemRef,
			accountId: tokenContent.accountId
		}, tokenContent);


		var data = {
			input: {
				token: token
			},
			output: {
				decryptData,
			},
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


function encrypt(systemRef, accountId, extraParameters=null){
	let requiredParms = {};
	requiredParms.systemRef = systemRef;
	requiredParms.accountId = accountId;

	//merge requiredParms last to ensure they are not overwritten by similar named extraParameters
	var tokenContent = extraParameters;
	tokenContent = _.assign({}, tokenContent, requiredParms);

	const cipher = crypto.createCipher(algorithm, password);
	let crypted = cipher.update(JSON.stringify(tokenContent),'utf8','hex');
	crypted += cipher.final('hex');

  return crypted;
}

function decrypt(token){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(token,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}



module.exports = router;
