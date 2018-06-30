var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

//index
router.get('/', (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if(err) {
      console.log(`Error: ${err}`);
      return;
    }
    
    res.render('campgrounds/index', {campgrounds: allCampgrounds});
  });
});

//create
router.post('/', isLoggedIn, (req, res) => {
  //post route when creating a new campground
  let name = req.body.name;
  let image = req.body.image;
  let description = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  let newCampground = {name, image, description, author};
  
  Campground.create(newCampground, (err, newlyCreated) => {
    if(err) {
      console.log(`Error: ${err}`);
      return;
    }
    
    //redirect
    res.redirect('/');
  });
});

//new
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

//show
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if(err) {
      console.log(`Error: ${err}`);
      return;
    }
    
    res.render('campgrounds/show', {campground: foundCampground});
  });
});

// Edit 
router.get('/:id/edit', (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if(err) {
      console.log(`Error: ${err}`);
      return;
    }
    
    res.render(`campgrounds/edit`, {campground: foundCampground});
  });
});

// Update 
router.put('/:id', (req, res) => {
  const editCampground = req.body.campground;
  
  Campground.findByIdAndUpdate(req.params.id, editCampground, (err, updatedCampground) => {
    if(err) {
      console.log(`Error: ${err}`);
      res.redirect('/campgrounds');
      return;
    }
    
    //success
    res.redirect(`/campgrounds/${req.params.id}`);
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