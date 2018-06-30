var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    seedDB = require("./seeds");
    
const Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user");

const commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  authRoutes = require("./routes/index");
    
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
app.use(methodOverride('_method'));

app.use((req, res, next) => {
  //res.locals is a function that lets you use req.user inside a request
  res.locals.currentUser = req.user;
  next();
});

//router routes 
app.use('/', authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);


app.listen(process.env.PORT, process.env.IP, () => {
  console.log('Yelpcamp started!');
});