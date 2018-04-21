var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');
    
//connect to DB
mongoose.connect('mongodb://localhost/yelp_camp');

//Schema
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

  
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
    
    res.render('campgrounds', {campgrounds: allCampgrounds});
  });
});

app.post('/campgrounds', function(req, res) {
  //post route when creating a new campground
  let name = req.body.name;
  let image = req.body.image;
  let newCampground = {name, image};
  
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

app.listen(process.env.PORT, process.env.IP, function() {
  console.log('Yelpcamp started!');
});