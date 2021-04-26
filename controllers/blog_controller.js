let express = require('express'), router = express.Router();
let request = require('request');

let Blog = require('../models/blog_model');

const fs = require('fs');





router.get('/blogs', async function(req, res) {

  try {
    let blogList = await Blog.getAllBlogs();
    res.status(200);
    res.setHeader('Content-Type', 'text/html');
    res.render('blog/show_blogs.ejs', {blogs: blogList});
  }
  catch (error) {
      response.status(500);
      response.setHeader('Content-Type', 'text/html')
      response.render("error", {
        "errorCode": "500"
      });
    }
});


router.get('/blog/create', async function(req, res) {
  try {
    let blogs = await Blog.getAllBlogs();
    res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.render("blog/new_blog.ejs", {
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


router.get('/blog/:blogID', async function(request, response) {
  let blogName = request.params.blogID;

  try  {
    let blogs = await Blog.getAllBlogs();
    if(blogs[blogName]){
      let post = blogs[blogName];

      response.status(200);
      response.setHeader('Content-Type', 'text/html')
      response.render("blog/blog_details.ejs",{
        post: post,
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





router.post('/blogs', async function(request, response) {
  try  {
    let allPosts = await Blog.getAllBlogs();

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
        winks: 0,
        comments: request.body.comments
    };

    let id = request.body.title.trim().replace(' ', '-');
    Blog.saveBlog(id, b);
    response.redirect("/");
  }
  catch (error) {
    response.status(500);
    response.setHeader('Content-Type', 'text/html')
    response.render("error.ejs", {
      errorCode: "500",
      allPosts: blogs
    });
  }

});

router.get('/blog/:id/edit', async function(req,res) {

  try {
    let allBlogs = await Blog.getAllBlogs();
    let thisBlog = await Blog.getBlog(req.params.id);
    thisBlog.id=req.params.id;

    if(thisBlog){
      res.status(200);
      res.setHeader('Content-Type', 'text/html');
      res.render("blog/edit_blog.ejs", {blog: thisBlog, blogs: allBlogs} );
    }
    else{
      let errorCode = 404;
      res.status(errorCode);
      res.setHeader('Content-Type', 'text/html');
      res.render("error.ejs", {"errorCode":errorCode});
    }
  }
  catch (error) {
    response.status(500);
    response.setHeader('Content-Type', 'text/html')
    response.render("error.ejs", {
      errorCode: "500",
      allPosts: blogs
    });
  }


});


router.post('/blog/wink/:blogID', async function(request, response) {
  let blogName = request.params.blogID;

  try {
    let blogs = await Blog.getAllBlogs();
    if (blogs[blogName]) {
      if (!blogs[blogName].winks) {
        blogs[blogName].winks = 0;
      }
      blogs[blogName].winks++;
      //fs.writeFileSync('data/blogs.json', JSON.stringify(blogs));
      Blog.updateBlog(blogName, blogs[blogName]);

      response.status(200);
      response.setHeader('Content-Type', 'text/json');
      response.send(blogs[blogName]);
    }
    else {
      response.status(404);
      response.setHeader('Content-Type', 'text/json');
      response.send('{results: "no user"}');
    }
  }
  catch (error) {
    response.status(500);
    response.setHeader('Content-Type', 'text/html')
    response.render("error.ejs", {
      errorCode: "500",
      allPosts: blogs
    });
  }

});


router.post('/blog/comments/:blogID', async function(request, response) {
  let blogName = request.params.blogID;

  try {
    let blogs = await Blog.getAllBlogs();


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


      blogs[blogName].comments.push(c);
      //fs.writeFileSync('data/blogs.json', JSON.stringify(blogs));
      Blog.updateBlog(blogName, blogs[blogName]);


      response.status(200);
      response.setHeader('Content-Type', 'text/json');
      response.send(blogs[blogName]);
    }
    else {
      response.status(404);
      response.setHeader('Content-Type', 'text/json');
      response.send('{results: "no user"}');
    }
  }
  catch (error) {
    response.status(500);
    response.setHeader('Content-Type', 'text/html')
    response.render("error.ejs", {
      errorCode: "500",
      allPosts: blogs
    });
  }

});



router.post('/blog/likes/:blogID', async function(request, response) {
  try {
    let blogs = await Blog.getAllBlogs();
    let blogName = request.params.blogID;

    if (blogs[blogName]) {
      if (!blogs[blogName].comments[request.body.index].likes) {
        blogs[blogName].comments[request.body.index].likes = 0;
      }
      blogs[blogName].comments[request.body.index].likes++;
      //fs.writeFileSync('data/blogs.json', JSON.stringify(blogs));
      Blog.updateBlog(blogName, blogs[blogName]);

      response.status(200);
      response.setHeader('Content-Type', 'text/json');
      response.send(blogs[blogName]);
    }
    else {
      response.status(404);
      response.setHeader('Content-Type', 'text/json');
      response.send('{results: "no user"}');
    }
  }
  catch (error) {
    response.status(500);
    response.setHeader('Content-Type', 'text/html')
    response.render("error.ejs", {
      errorCode: "500",
      allPosts: blogs
    });
  }
});


router.put('/blog/:id', async function(req,res){
  try {
    let blogs = await Blog.getAllBlogs();
    let newBlogData = {};

    newBlogData["title"] = req.body.title;
    newBlogData["image"]= req.body.image;
    newBlogData["date"]= req.body.date;
    newBlogData["author"]= req.body.author;
    newBlogData["previewContent"]= req.body.previewContent;
    newBlogData["content"]= [req.body.content_1, req.body.content_2];
    newBlogData["winks"] = req.body.winks;
    newBlogData["comments"] = blogs[req.body.title].comments;

    Blog.updateBlog(req.body.title, newBlogData);
    res.redirect('/blogs');
  }
  catch (error) {
    response.status(500);
    response.setHeader('Content-Type', 'text/html')
    response.render("error.ejs", {
      errorCode: "500",
      allPosts: blogs
    });
  }
});

router.delete('/blog/:id', function(req, res){
  //console.log(req.params.id);
  Blog.deleteBlog(req.params.id);
  res.redirect('/blogs');
});

module.exports = router
