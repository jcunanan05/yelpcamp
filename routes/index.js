const express = require('express');
const router = express.Router();
const User  = require('../models/user');
const passport = require('passport');


router.get('/', (req, res) => {
  res.redirect('/campgrounds');
});


//======================== AUTH ROUTES
//register from
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const credentials = req.body.signup;
  const newUser = new User({username: credentials.username});
  
  User.register(newUser, credentials.password, (err, user) => {
    if(err) {
      console.log(err);
      return res.render('register');
    }
    
    //success
    passport.authenticate('local')(req, res, () =>{
      res.redirect('/campgrounds');
    });
  });
});

//login routes
router.get('/login', (req, res) => {
  res.render('login');
});

//login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }), 
  (req, res) => {
    // callback
  });

//logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
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