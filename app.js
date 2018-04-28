var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');
    
//connect to DB
mongoose.connect('mongodb://localhost/yelp_camp');

//Schema
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create({
//   name: 'Granite Hill',
//   image: 'https://pixabay.com/get/ea36b70928f21c22d2524518b7444795ea76e5d004b0144391f5c07bafeabc_340.jpg',
//   description: 'very Huge'
// });

  
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
  res.render('landing');
});

app.get('/campgrounds', function(req, res) {
  Campground.find({}, (err, allCampgrounds) => {
    if(err) {
      console.log(`Error: ${err}`);
      return;
    }
    
    res.render('index', {campgrounds: allCampgrounds});
  });
});

app.post('/campgrounds', function(req, res) {
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

app.get('/campgrounds/new', function(req, res) {
  res.render('new');
});

app.get('/campgrounds/:id', function(req, res) {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if(err) {
      console.log(`Error: ${err}`);
      return;
    }
    
    res.render('show', {campground: foundCampground});
  });
  
});

app.listen(process.env.PORT, process.env.IP, function() {
  console.log('Yelpcamp started!');
});