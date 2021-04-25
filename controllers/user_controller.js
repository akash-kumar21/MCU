let express = require('express'), router = express.Router();
let request = require('request');

let User = require('../models/user_model');
let Blog = require('../models/blog_model');

const fs = require('fs');

router.get('/', function(request, response) {
  let blogs = Blog.getAllBlogs();
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("index", {
    allPosts: blogs
  });
});



router.get('/users', function(req, res){
  let userList = User.getAllUsers();
  let blogs = Blog.getAllBlogs();

  res.status(200);
  res.setHeader('Content-Type', 'text/html');
  res.render('user/show_users.ejs', {
    users: userList,
    allPosts: blogs
  });
});


router.get('/user/:userID', function(request, response) {
  let blogs = Blog.getAllBlogs();

  let users = User.getAllUsers();
  let userName = request.params.userID;

  if(users[userName]){
    let person = users[userName];

    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("user/user_details.ejs",{
      user: person,
      allPosts: blogs
    });


  }
  else{
    response.status(404);
    response.setHeader('Content-Type', 'text/html')
    response.render("error.ejs", {
      errorCode: "404",
      allPosts: blogs
    });
  }
});



module.exports = router
