//..............Include Express..................................//
const express = require('express');
const fs = require('fs');
const ejs = require('ejs');

//..............Create an Express server object..................//
const app = express();

//..............Apply Express middleware to the server object....//
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//.............Define server routes..............................//
//Express checks routes in the order in which they are defined

app.get('/', function(request, response) {
  let blogs = JSON.parse(fs.readFileSync('data/content.json'));
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("index", {
    allPosts: blogs
  });
});

app.get('/about', function(request, response) {
  let blogs = JSON.parse(fs.readFileSync('data/content.json'));
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("about", {
    allPosts: blogs
  });
});

app.get('/blogs/:blog', function(request, response) {
  let blogs = JSON.parse(fs.readFileSync('data/content.json'));
  let blogName = request.params.blog;

  if(blogs[blogName]){
    let post = blogs[blogName];

    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("blog",{
      post: post,
      allPosts: blogs
    });

  }else{
    response.status(404);
    response.setHeader('Content-Type', 'text/html')
    response.render("error", {
      "errorCode":"404"
    });
  }
});

app.get('/createBlog', function(request, response) {
    let blogs = JSON.parse(fs.readFileSync('data/content.json'));
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("createBlog", {
      allPosts: blogs
    });
});


app.get('/blogs', function(request, response) {
    let name = request.query.name;
    let blogTitle = "";

    let allPosts = JSON.parse(fs.readFileSync('data/content.json'));
    for (postName in allPosts) {
      let post = allPosts[postName];
      if(title == post.title){
        blogTitle = title;
        break;
      }
    }
    if (blogTitle) {
      response.redirect("/user/"+blogTitle);
    }
    else {
      response.status(404);
      response.setHeader('Content-Type', 'text/html')
      response.render("error", {
        "errorCode":"404"
      });
    }
});

app.post('/blogs', function(request, response) {
    let users = JSON.parse(fs.readFileSync('data/content.json'));

    var u = {
        name: request.body.name.trim(),
        photo: request.body.photo_link.trim(),
        wins: 0,
        losses: 0
    };

    users[request.body.email.trim()]=u;
    fs.writeFileSync('data/content.json', JSON.stringify(users));

    response.redirect("/");
});

// Because routes/middleware are applied in order, this will act as a default error route in case of an invalid route
app.use("", function(request, response){
  response.status(404);
  response.setHeader('Content-Type', 'text/html')
  response.render("error", {
    "errorCode":"404"
  });
});

//..............Start the server...............................//
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Easy server listening for requests on port ' + port + '!');
  console.log('Visit http://localhost:'+port+' to see the website.')
});
