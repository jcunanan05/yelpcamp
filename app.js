var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    seedDB = require("./seeds");
    
const Campground = require("./models/campground");
const Comment = require("./models/comment")
    
//connect to DB
mongoose.connect('mongodb://localhost/yelp_camp');

//seed db
// seedDB();


// Campground.create({
//   name: 'Granite Hill',
//   image: 'https://pixabay.com/get/ea36b70928f21c22d2524518b7444795ea76e5d004b0144391f5c07bafeabc_340.jpg',
//   description: 'very Huge'
// });

  
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));


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


//Comments routes

//new
app.get('/campgrounds/:id/comments/new', (req, res) => {
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
app.post('/campgrounds/:id/comments', (req, res) => {
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

app.listen(process.env.PORT, process.env.IP, () => {
  console.log('Yelpcamp started!');
});