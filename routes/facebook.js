const express = require('express');
const passport = require('passport');
const axios = require('axios');
const router = express.Router();
const conf = require('../auth/conf');
const adsAPI = require('facebook-adssdk-node');
const _ = require('lodash');

var adsAPIConfig = {
  adAccountId: conf.facebook.adAccountId,
  accessToken: conf.facebook.accessToken,
  // accessToken_Test_community: conf.facebook.accessToken_Test_community,
  // accessToken_NuCom: conf.facebook.accessToken_NuCom,
  // accessToken_Cafedori: conf.facebook.accessToken_Cafedori,
  adsAPIVersion: conf.facebook.adsAPIVersion
};

const FacebookService = {

  getAdsAPI : function() {
    return adsAPI(adsAPIConfig.adsAPIVersion, adsAPIConfig.accessToken);
  },
  getAdAccountId : function() {
    return adsAPIConfig.adAccountId;
  },
  getAccessToken : function() {
    return adsAPIConfig.accessToken;
  },
  getAccount : function() {
    return FacebookService.getAdsAPI().getAdAccount(FacebookService.getAdAccountId());
  }
};


//login facebook
router.get('/',
  passport.authenticate('facebook',  conf.facebook.options));

// if you want to do something in callback url (right after login)
router.get('/callback',
  passport.authenticate('facebook', { failureRedirect: '' }),
  function(req, res) {
    var data = { title: 'facebook' , user: req.user};
    //console.log(req.user);
    res.render('afterLogin', data);
  });



//html form
router.get('/post',
  function(req, res, next) {
    var data = { title: 'Post on your Feed' , user: req.user, message:null };
    res.render('post', data);

});

//get profile
router.get('/profile',
  function(req, res, next) {

    adsAPIConfig.accessToken = conf.facebook.accessToken;
    FacebookService.getAdsAPI().getUser().getUserProfile().require('id', 'name', 'picture').done()
        .then((response) => {
        res.json(response);
      }).catch((error) => {
        res.json(error);
        // throw error;
    });


});



////////////////////////////////////// PAGE POST

//get post list
router.get('/:page_id/getPosts',
  function(req, res, next) {
    var id = req.params.page_id
    //should use app token
    // adsAPIConfig.accessToken = '206197459739676|euY1DmO9EreTjLEXttOLsK43jds';
    //read feeds
    adsAPIConfig.accessToken = conf.facebook.accessToken;
    FacebookService.getAdsAPI().getPage(id).getPosts().require('message', 'created_time', 'full_picture', 'picture').done()
        .then((response) => {
        res.json(response);
      }).catch((error) => {
        res.json(error);
        // throw error;
    });
});


//create post
router.get('/:page_id/post',
  function(req, res, next) {
    var id = req.params.page_id;  //1728812260675990 : cafedori
    var message = req.body.postMessage;
    var obj = {
      message: (message==undefined) ? 'Start a New Campaign' : message,
      published: true,
      caption: 'get Free',
      // description: 'description',
      link: 'http://www.boma.com',
      picture: 'https://boma-test-1.s3-ap-southeast-2.amazonaws.com/userName/Koala.jpg'

      ,call_to_action: {
        type: 'BOOK_TRAVEL',
        value: {
          link: 'http://www.boma.com',
          link_caption: 'get Free'
        }
      }
    };

    console.log(obj);
    //https://developers.facebook.com/docs/graph-api/reference/v2.6/page/feed
    //should use app_token with [publish_pages] permission of APP
    //    OR use user_token with [publish_actions] permission - as a visitor
    adsAPIConfig.accessToken = conf.facebook.accessToken_Cafedori;
    //post
    FacebookService.getAdsAPI().getPage(id).publishPost().set(obj).done()
        .then((response) => {
        res.json(response);
      }).catch((error) => {
        res.json(error);
    });
});


////////////////////////////////////// UPDATE
router.get('/campaigns', function(req, res, next) {
  FacebookService.getAccount().getAdCampaigns().require('name')
    .done().then((response) => {
        res.json(response);
    }).catch((error) => {
        res.json(error);
        // throw error;
    });
});

//update campaign
router.get('/campaign/update', function(req, res, next) {
    var returnData = {};
    var adCampaignId = '6047180402210';
    updateParams = {
      name: 'BM-CAMP update from api222',
      objective: 'LINK_CLICKS',
      status: 'PAUSED',
    };

    adsAPIConfig.accessToken = conf.facebook.accessToken_Cafedori;
    // FacebookService.getAccount().getAdCampaign(adCampaignId).update().set(updateParams)
    FacebookService.getAccount().getAdCampaign(adCampaignId).get()
      .require('name','objective','status')
      .done().then((response) => {
        returnData.origin = response;
        returnData.updated = updateParams;

        FacebookService.getAccount().getAdCampaign(adCampaignId).update().set(updateParams)
          .done().then((resp) => {
            returnData.result = resp;
            res.json(returnData);
          }).catch((error) => {
            res.json(error);
            // throw error;
        });

      }).catch((error) => {
        res.json(error);
        // throw error;
    });
});

//update adSet
router.get('/adset/update', function(req, res, next) {
    var returnData = {};
    var adSetId = '6044346544610';
    var updateParams = {
      name: 'adset update targeting',
      status: 'PAUSED',
      daily_budget: '500',
      targeting: {
        age_max: 65,
        age_min: 20,
        geo_locations: {
          countries: [ //array of country codes
            "NZ"
          ],
          regions: [ //array of region codes - State, province, or region
            {'key':'3847'},
            {'key':'2724'}
          ],
          cities: [ //array of citie keys
            "2418779"
          ],
          zips: [ //array of full zip codes e.g. US:92103
          ],
          location_types: [
            "recent"
          ]
        },
        page_types: [
          "desktopfeed",
          "instagramstream",
          "mobilefeed",
          ]
      },
    };

    // FacebookService.getAccount().getAdSet(adSetId).update().set(updateParams)
    FacebookService.getAccount().getAdSet(adSetId).get()
      .require('campaign_id','name','optimization_goal','targeting','status','daily_budget','billing_event','is_autobid')
      .done().then((response) => {
        returnData.origin = response;
        returnData.updated = updateParams;

        FacebookService.getAccount().getAdSet(adSetId).update().set(updateParams)
          .done().then((resp) => {
            returnData.result = resp;
            res.json(returnData);
          }).catch((error) => {
            res.json(error);
            // throw error;
        });
      }).catch((error) => {
        res.json(error);
        // throw error;
    });
});

//update adCreative
router.get('/ad/update', function(req, res, next) {
    var returnData = {};
    var adId = '6042359860810';
    var updateParams = {
      name: 'aaaa',
      status: 'ACTIVE',
      bid_amount: '3',
      creative: {creative_id: '6044586627410'}
    };

    // FacebookService.getAccount().getAd(adId).update().set(updateParams)
    FacebookService.getAccount().getAd(adId).get()
      .require('name','creative','status','bid_amount')
      .done().then((response) => {
        returnData.origin = response;
        returnData.updated = updateParams;

        FacebookService.getAccount().getAd(adId).update().set(updateParams)
          .done().then((resp) => {
            returnData.result = resp;
            res.json(returnData);
          }).catch((error) => {
            res.json(error);
            // throw error;
        });
      }).catch((error) => {
        res.json(error);
        // throw error;
    });
});

router.get('/pages', function(req, res, next) {
  adsAPIConfig.accessToken = conf.facebook.accessToken;
  FacebookService.getAdsAPI().getUser().getOwnPages().require('name')
    .done().then((response) => {
      res.json(response.data);
    }).catch((error) => {
      res.json(error);
    });
});

router.get('/debug/token', function(req, res, next) {
  var input_token = conf.facebook.accessToken;
    // input_token : adsAPIConfig.accessToken_Cafedori
    // input_token : adsAPIConfig.accessToken_Test_community
    // input_token : adsAPIConfig.accessToken_NuCom
  if (req.query.page==='cafe') {
    input_token = conf.facebook.accessToken_Cafedori;
  } else if (req.query.page==='test') {
    input_token = conf.facebook.accessToken_Test_community;
  } else if (req.query.page==='nucom') {
    input_token = conf.facebook.accessToken_NuCom;
  }

  var params = {
    input_token : input_token
  };
  FacebookService.getAdsAPI().getUser().debugToken().set(params)
    .done().then((response) => {
      var addData = { page: req.query.page , token: input_token };
      response.data.addData = addData;
      res.json(response.data);
    }).catch((error) => {
      res.json(error);
      // throw error;
  });
});



router.get('/page/token', function(req, res, next) {
  var pageId = req.query.pageId;
  if(_.isUndefined(pageId)) {
    pageId = 128072234297840;
  }
  var input_token = conf.facebook.accessToken;
  FacebookService.getAdsAPI().getPage(pageId).getPageInfo().require('access_token')
    .done().then((response) => {
      res.json(response.data);
    }).catch((error) => {
      res.json(error);
    });
});


module.exports = router;
