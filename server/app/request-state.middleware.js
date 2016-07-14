'use strict'; 

var router = require('express').Router();
var sessionMiddleware = require('express-session');
var passport = require('passport');

var User = require('../api/users/user.model');

router.use(function (req, res, next) {
  var bodyString = '';
  req.on('data', function (chunk) {
    bodyString += chunk;
  });
  req.on('end', function () {
    bodyString = bodyString || '{}';
    req.body = eval('(' + bodyString + ')');
    next();
  });
});

router.use(sessionMiddleware({
  secret: 'tongiscool'
}));

/*
// session middleware sketch (what's sort of happening)
var sessionStore = {};
app.use(function sessionMiddleware (req, res, next) {
  if (hasSessionCookie(req)) {
    var sessionId = getSessionCookieId(req);
    var session = sessionStore[sessionId];
  } else {
    var sessionId = createSessionId();
    var session = sessionStore[sessionId] = {};
    addCookieToResponse(res, sessionId);
  }
  req.session = session;
  next();
});
*/

router.use(passport.initialize()); // this adds things to the req object, such as .login and .logout
router.use(passport.session()); // this is where deserialize actually happens, req.user gets established
/*
// passport session middleware sketch (what's sort of happening)
router.use(function passportSessionMiddleware (req, res, next) {
  var callDeserialization = passport.lookupDeserializationMethod();
  callDeserialization(req, function (err, wholeUser) {
    req.user = wholeUser;
    next();
  });
});
*/
router.use(function (req, res, next) {
  console.log('user', req.user);
  next();
});

// serialization happens "one" time
passport.serializeUser(function (user, attachSomethingToTheSession) {
  attachSomethingToTheSession(null, user.id);
});

// deserialization happens on every request (after somebody has loggedin)
passport.deserializeUser(function (id, assignReqUserProperty) {
  User.findById(id)
  .then(function (user) {
    assignReqUserProperty(null, user);
  })
  .catch(assignReqUserProperty);
});

module.exports = router;
