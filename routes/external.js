'use strict';
const router = require('express').Router();
const axios = require('axios');
const async = require('async');
const Promise = require('bluebird');
const _ = require('lodash');

router.get('/gender', function(req, res, next) {
  Promise.coroutine(function* (){
  	let name = _.isEmpty(_.get(req, 'query.name')) ? 'chloe' : _.get(req, 'query.name');
  	const param = `?name=${name}`;

    //1.generize.io
    //https://api.genderize.io/?name=sodam&country_id=nz
    const genderizeURL = 'https://api.genderize.io';
		const genderize = yield axios.get(`${genderizeURL}/${param}`);

		if (_.isNull(_.get(genderize.data, 'gender'))) {
	    //2. gender-api if genderize return null
	    //https://gender-api.com/get?name=Diana&key=<your private server key>
	    const genderApiURL = 'https://gender-api.com';
			const genderApi = yield axios.get(`${genderApiURL}/get${param}`);
			res.json(genderApi.data);
		} else {
			res.json(genderize.data);
		}

  })();
});

router.get('/image', function(req, res, next) {
	const imgUrl = 'C://Users/MSD/Pictures/check-mark-1292787_640.PNG';
	const sizeOf = require('image-size');

	var dimensions = sizeOf(imgUrl);
	console.log(dimensions.width, dimensions.height);
	res.json(dimensions);

	//with URL
	// const imgUrl = 'http://boma-test-1.s3-ap-southeast-2.amazonaws.com/userName/file_1474938519559';
	// const url = require('url');
	// const http = require('http');
	// const options = url.parse(imgUrl);

	// http.get(options, function (response) {
	//   var chunks = [];
	//   response.on('data', function (chunk) {
	//     chunks.push(chunk);
	//   }).on('end', function() {
	//     var buffer = Buffer.concat(chunks);
	//     console.log(sizeOf(buffer));
	//     res.json(sizeOf(buffer));
	//   });
	// });
	
});

module.exports = router;