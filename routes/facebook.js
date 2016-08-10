var express = require('express');
var passport = require('passport');
var axios = require('axios');
var router = express.Router();
var conf = require('../auth/conf');
var adsAPI = require('facebook-adssdk-node');

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
      message: (message==undefined) ? 'Posting with image!- with call_to_action' : message,
      published: true,
      // caption: 'caption',
      // description: 'description',
      link: 'http://www.w3schools.com/css/',
      picture: 'https://scontent-syd1-1.xx.fbcdn.net/v/t1.0-9/13256122_1744535369103679_663153915000343401_n.png?oh=0f45f6f437a745fe0247c84e207b5534&oe=58191957'

      ,call_to_action: {
        type: 'LEARN_MORE',
        value: {
          link: 'http://www.w3schools.com/css/',
          link_caption: 'link_caption_in_call_to_action'
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
          countries: [
            "NZ"
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
  FacebookService.getAdsAPI().getUser().getOwnPages().require('page')
    .done().then((response) => {
      res.json(response.data);
    }).catch((error) => {
      res.json(error);
      // throw error;
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

module.exports = router;
