let express = require('express'),
  router = express.Router();
let request = require('request');

let Blog = require('../models/blog_model');

router.get('/', async function(request, response) {
  try {
    let blogs = await Blog.getAllBlogs();
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("index", {
      allPosts: blogs,
      user: request.user
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

router.get('/about', async function(request, response) {
  try {
    let blogs = await Blog.getAllBlogs();
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("about", {
      allPosts: blogs,
      user: request.user
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

router.get('/login', async function(request, response) {
  try {
    let blogs = await Blog.getAllBlogs();
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("login", {
      allPosts: blogs,
      user: request.user
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

module.exports = router
