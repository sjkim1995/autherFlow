'use strict';

var router = require('express').Router();
var passport = require('passport');

var googleStrategy = require('./google.oauth');
passport.use(googleStrategy);

router.get(
  '/google',
  passport.authenticate('google', {scope: 'email'})
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/stories',
    failureRedirect: '/login'
  })
);

module.exports = router;