var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    seedDB = require("./seeds");
    
const Campground = require("./models/campground");
const Comment = require("./models/comment")
const User = require("./models/user");
    
//connect to DB
mongoose.connect('mongodb://localhost/yelp_camp');

//seed db
// seedDB();

// Passport Config
app.use(require("express-session")({
  secret: "the secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});


app.get('/', (req, res) => {
  res.redirect('/campgrounds');
});

//index
app.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if(err) {
      console.log(`Error: ${err}`);
      return;
    }
    
    res.render('campgrounds/index', {campgrounds: allCampgrounds});
  });
});

//create
app.post('/campgrounds', (req, res) => {
  //post route when creating a new campground
  let name = req.body.name;
  let image = req.body.image;
  let description = req.body.description;
  let newCampground = {name, image, description};
  
  Campground.create(newCampground, (err, newlyCreated) => {
    if(err) {
      console.log(`Error: ${err}`);
      return;
    }
    
    //redirect
    res.redirect('/campgrounds');
  });
});

//new
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

//show
app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if(err) {
      console.log(`Error: ${err}`);
      return;
    }
    
    res.render('campgrounds/show', {campground: foundCampground});
  });
});


//===================== Comments routes

//new
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
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
app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
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
      
      //success
      foundCampground.comments.push(createdComment);
      foundCampground.save();
      res.redirect(`/campgrounds/${foundCampground._id}`);
    });
  });
});

//======================== AUTH ROUTES
//register from
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
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
app.get('/login', (req, res) => {
  res.render('login');
});

//login
app.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }), 
  (req, res) => {
    // callback
  });

//logout
app.get('/logout', (req, res) => {
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


app.listen(process.env.PORT, process.env.IP, () => {
  console.log('Yelpcamp started!');
});