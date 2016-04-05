## Install
```sh
$npm install
```

## Run
```sh
$npm start
```


## check server
```sh
http://localhost:3000/
```

## This example using :
1. facebook js sdk
2. passport and passport-facebook

##### you need app id and app secret of facebook

1. Client side auth
	- http://localhost:3000/
	- using js sdk of facebook
	- /views/index.ejs
```sh
  window.fbAsyncInit = function() {
    FB.init({
      appId      : 'Enter your consumer key here',
      xfbml      : true,
      version    : 'v2.5'
    });
  };
```
2. Server side auth
	- http://localhost:3000/facebook
	- using passport-facebook
	- config : /auth/conf.js
```sh
    facebook: {
        clientId: 'Enter your consumer key here'
      , clientSecret: 'Enter your consumer secret here'
      , callbackURL: 'Enter your callbackURL here'
      , profileFields: ['id', 'displayName', 'photos', 'email'] /* user informations to get */
      /* Set the authType option to rerequest when authenticating. */
			, options: { authType: 'rerequest', scope: ['email', 'ads_management', 'ads_read'] } /* permissions */
    }
```
3. Check user information of session - via [connect-ensure-login]
	- http://localhost:3000/profile