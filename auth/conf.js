module.exports = {
    facebook: {
        clientID: 'Enter your consumer key here'
      , clientSecret: 'Enter your consumer secret here'
      , callbackURL: 'Enter your callbackURL here' /* 'http://localhost:3000/facebook/callback' */
      , profileFields: ['id', 'displayName', 'photos', 'email'] /* user informations to get */
      , options: { authType: 'rerequest', scope: ['email', 'ads_management', 'ads_read'] } /* permissions */
    }
  , instagram: {
        clientId: 'Enter your consumer key here'
      , clientSecret: 'Enter your consumer secret here'
    }
  , google: {
        clientId: 'Enter your consumer key here'
      , clientSecret: 'Enter your consumer secret here'
    }
};