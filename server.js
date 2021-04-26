var express = require('express');
var app = express();
var ejs = require('ejs');
var path = require('path');
var methodOverride = require('method-override');


app.use(express.json());
app.use(express.urlencoded());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
//app.set("views", path.resolve(__dirname, 'views'))
app.use(express.static('public'));


app.use(require('./controllers/index'));
app.use(require('./controllers/blog_controller'));
app.use(require('./controllers/film_controller'));
app.use(require('./controllers/character_controller'));
app.use(require('./controllers/author_controller'));
app.use(require('./controllers/user_controller'));

app.use("", function(request, response) {
  response.status(404);
  response.setHeader('Content-Type', 'text/html')
  response.render("error", {
    "errorCode": "404"
  });
});


const port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log('listening on port:'+port+'!')
});
