let express = require('express'), router = express.Router();
let request = require('request');

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




router.get('/blogs', function(req, res){
  let blogList = Blog.getAllBlogs();

  res.status(200);
  res.setHeader('Content-Type', 'text/html');
  res.render('blog/show_blogs.ejs', {blogs: blogList});
});

router.get('/blog/create', function(req, res) {
    let blogs = Blog.getAllBlogs();
    res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.render("blog/new_blog.ejs", {
      allPosts: blogs
    });
});


router.get('/blog/:blogID', function(request, response) {
  let blogs = Blog.getAllBlogs();
  let blogName = request.params.blogID;

  if(blogs[blogName]){
    let post = blogs[blogName];

    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("blog/blog_details.ejs",{
      post: post,
      allPosts: blogs
    });


  }else{
    response.status(404);
    response.setHeader('Content-Type', 'text/html')
    response.render("error.ejs", {
      errorCode: "404",
      allPosts: blogs
    });
  }
});





router.post('/blogs', function(request, response) {
    let allPosts = Blog.getAllBlogs();

    let d = new Date();
    let month = d.getMonth() + 1;
    if (month == 1) {month = "January"};
    if (month == 2) {month = "February"};
    if (month == 3) {month = "March"};
    if (month == 4) {month = "April"};
    if (month == 5) {month = "May"};
    if (month == 6) {month = "June"};
    if (month == 7) {month = "July"};
    if (month == 8) {month = "August"};
    if (month == 9) {month = "September"};
    if (month == 10) {month = "October"};
    if (month == 11) {month = "November"};
    if (month == 12) {month = "December"};
    let dateNum = d.getDate();
    let year = d.getFullYear();
    let date = month + " " + dateNum + ", " + year;

    let b = {
        title: request.body.title.trim().replace(' ', '-'),
        image: request.body.photoLink.trim(),
        date: date,
        author: request.body.author,
        previewContent: request.body.previewContent,
        content: [request.body.content1, request.body.content2],
        tags: [
          [request.body.tag_content_1, request.body.tag_style_1.toLowerCase()],
          [request.body.tag_content_2, request.body.tag_style_2.toLowerCase()],
          [request.body.tag_content_3, request.body.tag_style_3.toLowerCase()]
        ]
    };

    let isBlogValid = true;

    if (b.title === "") {
      isBlogValid = false;
    }
    if (b.image === "") {
      isBlogValid = false;
    }
    if (b.previewContent === "") {
      isBlogValid = false;
    }
    for (let i = 0; i < 2; i++) {
      if (b.content[i] === "") {
        isBlogValid = false;
      }
    }
    for (let i = 0; i < 3; i++) {
      if (b.tags[i][0] === "") {
        isBlogValid = false;
      }
    }
    for (let i = 0; i < 3; i++) {
      if (b.tags[i][1] === "") {
        isBlogValid = false;
      }
    }
    if (isBlogValid) {
      allPosts[request.body.title.trim().replace(' ', '-')] = b;
      fs.writeFileSync('data/blogs.json', JSON.stringify(allPosts));
      response.redirect("/");
    }
});

router.get('/blog/:id/edit', function(req,res){
  let thisBlog = Blog.getBlog(req.params.id);
  thisBlog.id=req.params.id;

  if(thisBlog){
    res.status(200);
    res.setHeader('Content-Type', 'text/html');
    res.render("blog/edit_blog.ejs", {blog: thisBlog, blogs: Blog.getAllBlogs()} );
  }
  else{
    let errorCode = 404;
    res.status(errorCode);
    res.setHeader('Content-Type', 'text/html');
    res.render("error.ejs", {"errorCode":errorCode});
  }
});


router.post('/blog/wink/:blogID', function(request, response) {
  let blogs = Blog.getAllBlogs();
  let blogName = request.params.blogID;

  //console.log(request.body);

  if (blogs[blogName]) {
    if (!blogs[blogName].winks) {
      blogs[blogName].winks = 0;
    }
    blogs[blogName].winks++;
    fs.writeFileSync('data/blogs.json', JSON.stringify(blogs));

    response.status(200);
    response.setHeader('Content-Type', 'text/json');
    response.send(blogs[blogName]);
  }
  else {
    response.status(404);
    response.setHeader('Content-Type', 'text/json');
    response.send('{results: "no user"}');
  }
});


router.post('/blog/comments/:blogID', function(request, response) {
  let blogs = Blog.getAllBlogs();
  let blogName = request.params.blogID;

  //console.log(request.body);

  if (blogs[blogName]) {
    if (!blogs[blogName].comments) {
      blogs[blogName].comments = [];
    }

    let d = new Date();
    let month = d.getMonth() + 1;
    if (month == 1) {month = "January"};
    if (month == 2) {month = "February"};
    if (month == 3) {month = "March"};
    if (month == 4) {month = "April"};
    if (month == 5) {month = "May"};
    if (month == 6) {month = "June"};
    if (month == 7) {month = "July"};
    if (month == 8) {month = "August"};
    if (month == 9) {month = "September"};
    if (month == 10) {month = "October"};
    if (month == 11) {month = "November"};
    if (month == 12) {month = "December"};
    let dateNum = d.getDate();
    let year = d.getFullYear();
    let date = month + " " + dateNum + ", " + year;

    let c = {
      author: request.body.author,
      date: date,
      content: request.body.content
    }

    if (request.body.isCommentValid) {
      blogs[blogName].comments.push(c);
      fs.writeFileSync('data/blogs.json', JSON.stringify(blogs));
    }

    response.status(200);
    response.setHeader('Content-Type', 'text/json');
    response.send(blogs[blogName]);
  }
  else {
    response.status(404);
    response.setHeader('Content-Type', 'text/json');
    response.send('{results: "no user"}');
  }
});



router.post('/blog/likes/:blogID', function(request, response) {
  let blogs = Blog.getAllBlogs();
  let blogName = request.params.blogID;

  //console.log(request.body);

  if (blogs[blogName]) {
    if (!blogs[blogName].comments[request.body.index].likes) {
      blogs[blogName].comments[request.body.index].likes = 0;
    }
    blogs[blogName].comments[request.body.index].likes++;
    fs.writeFileSync('data/blogs.json', JSON.stringify(blogs));

    response.status(200);
    response.setHeader('Content-Type', 'text/json');
    response.send(blogs[blogName]);
  }
  else {
    response.status(404);
    response.setHeader('Content-Type', 'text/json');
    response.send('{results: "no user"}');
  }
});


router.put('/blog/:id', function(req,res){
  let blogs = Blog.getAllBlogs();
  let newBlogData = {};

  newBlogData["title"] = req.body.title;
  newBlogData["image"]= req.body.image;
  newBlogData["date"]= req.body.date;
  newBlogData["author"]= req.body.author;
  newBlogData["previewContent"]= req.body.previewContent;
  newBlogData["content"]= [req.body.content_1, req.body.content_2];
  newBlogData["tags"]= [
    [req.body.tag_content_1, req.body.tag_style_1],
    [req.body.tag_content_2, req.body.tag_style_2],
    [req.body.tag_content_3, req.body.tag_style_3]
  ];
  newBlogData["winks"] = req.body.winks;
  newBlogData["comments"] = blogs[req.body.title].comments;

  Blog.updateBlog(req.body.title, newBlogData);
  res.redirect('/blogs');
});

router.delete('/blog/:id', function(req, res){
  //console.log(req.params.id);
  Blog.deleteBlog(req.params.id);
  res.redirect('/blogs');
});

module.exports = router
