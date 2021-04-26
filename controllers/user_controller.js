let express = require('express'), router = express.Router();
let request = require('request');

let User = require('../models/user_model');
let Blog = require('../models/blog_model');

const fs = require('fs');





router.get('/users', async function(req, res) {
  try {
    let userList = await User.getAllUsers();
    let blogs = await Blog.getAllBlogs();

    res.status(200);
    res.setHeader('Content-Type', 'text/html');
    res.render('user/show_users.ejs', {
      users: userList,
      allPosts: blogs
    });
  }
  catch (error) {
      response.status(500);
      response.setHeader('Content-Type', 'text/html')
      response.render("error", {
        "errorCode": "500"
      });
    }

});


router.get('/user/:userID', async function(request, response) {
  try {
    let blogs = await Blog.getAllBlogs();

    let users = await User.getAllUsers();
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
  }
  catch (error) {
      response.status(500);
      response.setHeader('Content-Type', 'text/html')
      response.render("error", {
        "errorCode": "500"
      });
    }

});



module.exports = router
