const mongooose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const data = [
  {
    name: "Cloud's Rest",
    image: "https://images.unsplash.com/photo-1455496231601-e6195da1f841?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=4d1156d3e4dfafbc71a9f293939f3243&auto=format&fit=crop&w=500&q=60",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos optio alias architecto. Praesentium, laudantium, atque. Omnis id reiciendis aspernatur harum iure dolore totam. Praesentium ea dolores, rerum incidunt facere, quos."
  },
  {
    name: "Starry Night",
    image: "https://images.unsplash.com/photo-1468956398224-6d6f66e22c35?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5d2e4d45d037053be722233b79bd0510&auto=format&fit=crop&w=500&q=60",
    description: "Not by Van Gogh"
  }
];

const newComment = {
  text: "This place is great!",
  author: "Homer"
};

function emptyDB() {
  Campground.remove({}, err => {
    if (err) {
      console.log(err);
      return;
    }
    
    console.log('Removed Campgrounds');
  });
}

function feedData() {
  data.forEach(newCampground => {
    Campground.create(newCampground, (err, createdCampground) => {
      if (err) {
        console.log(err);
        return;
      }
      
      //success, add comment
      // addComment(createdCampground, newComment);
    });
  });
}

function addComment(campground, comment) {
  Comment.create(comment, (err, createdComment) => {
    if (err) {
      console.log(err);
      return;
    }
    
    //success
    campground.comments.push(createdComment);
    campground.save();
  });
  
  console.log('created new comment');
}

function seedDB() {
  emptyDB();
  // feedData();
  // feedData();
  // feedData();
}


module.exports = seedDB;


// Campground.create({
//   name: 'Granite Hill',
//   image: 'https://pixabay.com/get/ea36b70928f21c22d2524518b7444795ea76e5d004b0144391f5c07bafeabc_340.jpg',
//   description: 'very Huge'
// });