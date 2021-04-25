let express = require('express'), router = express.Router();
let request = require('request');

let Author = require('../models/author_model');
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



router.get('/authors', function(req, res){
  let authorList = Author.getAllAuthors();
  let blogs = Blog.getAllBlogs();

  res.status(200);
  res.setHeader('Content-Type', 'text/html');
  res.render('author/show_authors.ejs', {
    authors: authorList,
    allPosts: blogs
  });
});


router.get('/author/:authorID', function(request, response) {
  let blogs = Blog.getAllBlogs();

  let authors = Author.getAllAuthors();
  let authorName = request.params.authorID;

  if(authors[authorName]){
    let writer = authors[authorName];

    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("author/author_details.ejs",{
      author: writer,
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
