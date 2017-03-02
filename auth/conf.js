module.exports = {
    facebook: {
        clientID: '206197459739676'
      , clientSecret: '1a277934fbfab4c4021434568316e1d1'
      , callbackURL: 'http://localhost:8090/facebook/callback'
      , profileFields: ['id', 'displayName', 'photos', 'email'] /* user informations to get */
      , options: { authType: 'rerequest', scope: ['public_profile', 'ads_management', 'ads_read', 'publish_pages', 'manage_pages'] } /* permissions */
      , adAccountId: '482898265106052'  /* add account Id*/
      , adsAPIVersion: 'v2.7'
      , accessToken_Test_community : 'EAAC7iRZAXZABwBAIIT0qhHLawnv3uXZC57WoYcM7T3ZCwEHArQHrtS13QmuDMupjZC6gzbW48cX3eo1cUGPOp5GXJ2OJdsT7MVFMKTCQXKaY1cLK3VsPfeuq9e8i2LFIrdOlb937WArwzeVVyVJQHWEwZCzjgMGwhdVN0yW1YxuQZDZD'
      , accessToken_NuCom: 'EAAC7iRZAXZABwBALSXaZBXFi2IMsXRQLic9eRZAhNtUede0kzKpqUV9a3bFdE6rk1wSmZAh0Ihitx64pBsSGpR9Bm5Ax7Mw2DfEl48Uoh81kWBBZCOmZBOZAxTG8CZAuqpN755Sq9hg6F4vLlzQkm9ZBZAcfzHhFvNPBvo7C9VxYFgYBAZDZD'
      , accessToken_Cafedori: 'EAAC7iRZAXZABwBAC0tg28vr8mthg22vt0EE96pXDq35vMmHFoY2FNuPq6vupR4PjiTxvKI2EuJVgdC3fdJw7QpMbNWnKPq9glnfBahOZCgV99OgM3mwHKN7r59A0DatFtPKNSIuWiVEK54IZBqSAiP5OOkZB6bed8KNsqZAJzV7gZDZD'
      , accessToken: 'EAAC7iRZAXZABwBALEWMbADV2Ww0pGIVh097jvKFIOXuogRhKZCO5ZCQoyxl4MmPIPytZAH1QjYrmleSwH4IDnQl3DkmvCsHbS0twNrQiWpD47ZAnU7ZCBiC4ndnmNnlw7EwHCw2TxnuVX7a1AkCokomSZCD1pPRhwvrXwTbo28ZAZCzuFhbbybYGqyRg8kb1osU1QZD'
  // /* app-token */ accessToken: '206197459739676|euY1DmO9EreTjLEXttOLsK43jds',
    },
    google: {
      ADWORDS_CLIENT_ID: '451272993148-n5b9ia9ck1j25kc03vhbtn3jap96pbkp.apps.googleusercontent.com',
      ADWORDS_SECRET: '-2ifVnsVjhgh5anvry_Xkp9-',
      ADWORDS_CALLBACK_URL: 'http://localhost:8000/google/callback',
      SCOPE: { accessType: 'offline', approvalPrompt: 'auto', responseType:'code', scope: ['profile', 'https://www.googleapis.com/auth/adwords', 'https://www.googleapis.com/auth/analytics'], failureFlash: true }
    }
};
