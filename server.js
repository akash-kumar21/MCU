//..............Include Express..................................//
const express = require('express');
const fs = require('fs');
const ejs = require('ejs');

//..............Create an Express server object..................//
const app = express();

const bp = require('body-parser')
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

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
      "errorCode":"404",
      allPosts: blogs
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
    let blogs = JSON.parse(fs.readFileSync('data/content.json'));
    let title = request.query.name;
    let blogTitle = "";

    let allPosts = JSON.parse(fs.readFileSync('data/content.json'));
    for (postName in allPosts) {
      let post = allPosts[postName];
      if (title == post.title) {
        blogTitle = title;
        break;
      }
    }
    if (blogTitle) {
      response.redirect("/blogs/"+blogTitle);
    }
    else {
      response.status(404);
      response.setHeader('Content-Type', 'text/html')
      response.render("error", {
        "errorCode":"404",
        allPosts: blogs
      });
    }
});



app.post('/blogs', function(request, response) {
    let allPosts = JSON.parse(fs.readFileSync('data/content.json'));

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
      fs.writeFileSync('data/content.json', JSON.stringify(allPosts));
      response.redirect("/");
    }
});



app.post('/blogs/wink/:blog', function(request, response) {
  let blogs = JSON.parse(fs.readFileSync('data/content.json'));
  let blogName = request.params.blog;

  //console.log(request.body);

  if (blogs[blogName]) {
    if (!blogs[blogName].winks) {
      blogs[blogName].winks = 0;
    }
    blogs[blogName].winks++;
    fs.writeFileSync('data/content.json', JSON.stringify(blogs));

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



app.post('/blogs/comments/:blog', function(request, response) {
  let blogs = JSON.parse(fs.readFileSync('data/content.json'));
  let blogName = request.params.blog;

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
      fs.writeFileSync('data/content.json', JSON.stringify(blogs));
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



app.post('/blogs/likes/:blog', function(request, response) {
  let blogs = JSON.parse(fs.readFileSync('data/content.json'));
  let blogName = request.params.blog;

  //console.log(request.body);

  if (blogs[blogName]) {
    if (!blogs[blogName].comments[request.body.index].likes) {
      blogs[blogName].comments[request.body.index].likes = 0;
    }
    blogs[blogName].comments[request.body.index].likes++;
    fs.writeFileSync('data/content.json', JSON.stringify(blogs));

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



// Because routes/middleware are applied in order, this will act as a default error route in case of an invalid route
app.use("", function(request, response) {
  let blogs = JSON.parse(fs.readFileSync('data/content.json'));
  response.status(404);
  response.setHeader('Content-Type', 'text/html')
  response.render("error", {
    "errorCode":"404",
    allPosts: blogs
  });
});

//..............Start the server...............................//
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Easy server listening for requests on port ' + port + '!');
  console.log('Visit http://localhost:'+port+' to see the website.')
});
