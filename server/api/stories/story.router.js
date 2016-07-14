'use strict';

var router = require('express').Router();

var HttpError = require('../../utils/HttpError');
var Story = require('./story.model');
var User = require('../users/user.model')


function access (user, userId) {
  console.log("=== Check owner ");
  if (!user) return false;
  console.log("Target id:", userId, "user id:", user.id, "admin:", user.isAdmin);
  let result = (user && (user.id === userId || user.isAdmin))
  if (!result) console.log("==== reject");
  return result;
}

router.param('id', function (req, res, next, id) {
  Story.findById(id)
  .then(function (story) {
    if (!story) throw HttpError(404);
    req.story = story;
    next();
  })
  .catch(next);
});

router.get('/', function (req, res, next) {
  Story.findAll({
    include: [{model: User, as: 'author'}],
    attributes: {exclude: ['paragraphs']}
  })
  .then(function (stories) {
    res.json(stories);
  })
  .catch(next);
});

router.post('/', function (req, res, next) {
      if (! access( req.user, req.body.author_id)) return;
  Story.create(req.body)
  .then(function (story) {
    return story.reload({include: [{model: User, as: 'author'}]});
  })
  .then(function (includingAuthor) {
    res.status(201).json(includingAuthor);
  })
  .catch(next);
});

router.get('/:id', function (req, res, next) {
  req.story.reload({include: [{model: User, as: 'author'}]})
  .then(function (story) {
    res.json(story);
  })
  .catch(next);
});

router.put('/:id', function (req, res, next) {
      if (! access( req.user, req.story.author_id)) return;
  req.story.update(req.body)
  .then(function (story) {
    res.json(story);
  })
  .catch(next);
});

router.delete('/:id', function (req, res, next) {
console.log("The req story is", req.story)
    if (! access( req.user, req.story.author_id)) return;
  req.story.destroy()
  .then(function () {
    res.status(204).end();
  })
  .catch(next);
});

module.exports = router;
