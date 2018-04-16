var express = require('express');
var app = express();

app.set('view engine', 'ejs')


app.get('/', function(req, res) {
  res.render('landing')
});

app.get('/campgrounds', function(req, res) {
  var campgrounds = [
    {name: 'Salmon Creek', image:'https://pixabay.com/get/ec31b90f2af61c22d2524518b7444795ea76e5d004b0144396f8c97dafebb4_340.jpg'},
    {name: 'Granite Hill', image:'https://pixabay.com/get/e83db7082af3043ed1584d05fb1d4e97e07ee3d21cac104497f3c971a3e5b3b9_340.jpg'},
    {name: `Mountain Goat's Rest`, image:'https://farm8.staticflickr.com/7042/7121867321_65b5f46ef1.jpg'}
  ];
  
  res.render('campgrounds', {campgrounds: campgrounds});
});

app.listen(process.env.PORT, process.env.IP, function() {
  console.log('Yelpcamp started!');
});