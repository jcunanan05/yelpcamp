const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
//===================== Comments routes

//new
router.get('/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if(err) {
      res.redirect('/campgrounds');
      return;
    }
    
    //success
    res.render('comments/new', {campground: foundCampground});
  });
});

//create
router.post('/', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      res.redirect('/campgrounds');
      return;
    }
    
    //success, add comment
    Comment.create(req.body.comment, (err, createdComment) => {
      if(err) {
        console.log(err);
        return;
      }
      
      //add username and id to comment
      createdComment.author.id = req.user._id;
      createdComment.author.username = req.user.username
      createdComment.save();
      
      //success
      foundCampground.comments.push(createdComment);
      foundCampground.save();
      res.redirect(`/campgrounds/${foundCampground._id}`);
    });
  });
});


//middleware, isLoggedIn
function isLoggedIn(req, res, next) {
  if(!req.isAuthenticated()) {
    res.redirect('/login');
  }
  
  //loggedIn
  return next();
}

module.exports = router;