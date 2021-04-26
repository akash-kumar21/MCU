let express = require('express'), router = express.Router();
let request = require('request');

let Author = require('../models/author_model');
let Blog = require('../models/blog_model');

const fs = require('fs');


router.get('/authors', async function(req, res) {
  try {
    let authorList = await Author.getAllAuthors();
    let blogs = await Blog.getAllBlogs();

    res.status(200);
    res.setHeader('Content-Type', 'text/html');
    res.render('author/show_authors.ejs', {
      authors: authorList,
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


router.get('/author/:authorID', async function(request, response) {
  try {
    let blogs = await Blog.getAllBlogs();

    let authors = await Author.getAllAuthors();
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
