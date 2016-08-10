var express = require('express');
var axios = require('axios');
var router = express.Router();
var conf = require('../auth/conf');
var adsAPI = require('facebook-adssdk-node');

var adsAPIConfig = {
  adAccountId: conf.facebook.adAccountId,
  accessToken: conf.facebook.accessToken,
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

///////////////////////////////////////// INSTAGRAM ACCOUNT


//------------------- normal instagram account

//Get instagram Account
router.get('/:page_id/account', function(req, res, next) {
    // var id = (req.body.userId!=undefined) ? req.body.userId : req.body.pageId;
    var id = req.params.page_id;

    // adsAPIConfig.accessToken = req.user.accessToken;

    FacebookService.getAdsAPI().getPage(id).getInstagramAccount().require('username', 'profile_pic', 'media_count', 'follow_count').done()
        .then((response) => {
        res.json(response);
      }).catch((error) => {
        console.log(error);
        res.json(error);
        throw error;
    });
});

//------------------- backed instagram account

//Get Backed instagram Account
router.get('/:page_id/account/backed', function(req, res, next) {
    // var id = (req.body.userId!=undefined) ? req.body.userId : req.body.pageId;
    var id = req.params.page_id;

    // adsAPIConfig.accessToken = req.user.accessToken;

    FacebookService.getAdsAPI().getPage(id).getBackedInstagramAccount().require('username', 'profile_pic').done()
        .then((response) => {
        res.json(response);
      }).catch((error) => {
        console.log(error);
        res.json(error);
        throw error;
    });
});


//Create Backed instagram Account
router.get('/:page_id/account/backed/create', function(req, res, next) {
    var id = (req.params.page_id!=undefined) ? req.params.page_id : '1728812260675990';

    // adsAPIConfig.accessToken = req.user.accessToken;

    FacebookService.getAdsAPI().getPage(id).createBackedInstagramAccount().done()
        .then((response) => {
        res.json(response);
      }).catch((error) => {
        console.log(error);
        res.json(error);
        throw error;
    });
});



router.get('/:page_id/createAdCreatives', function(req, res, next) {
    var id = req.params.page_id;  //'1808822239348657';

    // var baseURL = 'https://graph.facebook.com/v2.5/act_482898265106052/adcreatives';

    var creativeObj = {
      name : 'Instagram Creative Name',
      object_story_spec : {
        page_id: id,
        // instagram_actor_id: '627285594028383', //CafeDori- 1728812260675990/backed : 1162581670448401 insta : 627285594028383
        instagram_actor_id: '1162581670448401', //NuCom-  /  backed : 1169478213074157
        link_data:{
          call_to_action:{
            type:"LEARN_MORE",
            value:{
              link:"http://bomamarketing.co.nz"
            }
          },
          picture: "https://scontent.xx.fbcdn.net/v/t1.0-9/p720x720/13307466_1167103126685559_1468040217717161033_n.jpg?oh=2de6988a2a65d22e326384e83567c349&oe=57E233AE",
          link:"http://bomamarketing.co.nz",
          message:"Great looking SXT handbags in store. #prettybag",
          caption:"http://bomamarketing.co.nz"
        }
      },
      platform_customizations : {
        instagram: {
          // image_hash:"dbce3bf6b57da4ec23359019cb14f8af",
          image_url: "https://scontent.xx.fbcdn.net/v/t1.0-9/p720x720/13307466_1167103126685559_1468040217717161033_n.jpg?oh=2de6988a2a65d22e326384e83567c349&oe=57E233AE",
          image_crops: {
            "100x100": [ [0,0], [700, 700] ],
            // "191x100": [ [0,200], [1146, 800] ]
          }
        }
      }
    };
    FacebookService.getAccount().createCreative().set(creativeObj).done()
        .then((response) => {
        res.json(response);
      }).catch((error) => {
        console.log(error);
        res.json(error);
    });
});

module.exports = router;
