let express = require('express'), router = express.Router();
let request = require('request');

let Film = require('../models/film_model');
let Blog = require('../models/blog_model');

let apikey = 'f09c17eb';


const fs = require('fs');


router.get('/', function(request, response) {
  let blogs = Blog.getAllBlogs();
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("index.ejs", {
    allPosts: blogs
  });
});

router.get('/about', function(request, response) {
  let blogs = JSON.parse(fs.readFileSync('data/blogs.json'));
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("about.ejs", {
    allPosts: blogs
  });
});

router.get('/login', function(request, response) {
  let blogs = Blog.getAllBlogs();
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("login.ejs", {
    allPosts: blogs
  });
});


router.get('/films', function(req, res){
  let filmList = Film.getAllFilms();

  res.status(200);
  res.setHeader('Content-Type', 'text/html');
  res.render('film/show_films.ejs', {films: filmList, blogs: Blog.getAllBlogs()});
});

router.get('/film/create', function(req, res){
  let title=req.query.title;
  title=title.replace(/ /g, '+');

  request("http://www.omdbapi.com/?apikey="+apikey+"&t="+title+"&r=json", function(err, response, body) {
      if(!err){
        let filmResponse = JSON.parse(body);
        res.status(200);
        res.setHeader('Content-Type', 'text/html');
        res.render('film/new_film.ejs', {film: filmResponse})
      }
      else{
        res.redirect('/film');
      }
    });
});

router.post('/film/:imdbID', function(req, res){
  let filmID = req.params.imdbID;
  request("http://www.omdbapi.com/?apikey="+apikey+"&i="+filmID+"&r=json", function(err, response, body) {
            let filmResponse = JSON.parse(body);
            if(!err){
              let newFilm={
                "title": filmResponse.Title,
                "year": filmResponse.Year,
                "rating": filmResponse.Rated,
                "director": filmResponse.Director,
                "cast": filmResponse.Actors,
                "plot": filmResponse.Plot,
                "poster": filmResponse.Poster,
              }
              let newID = (filmResponse.Title+" "+filmResponse.Year).replace(/ /g,"_");
              Film.saveFilm(newID, newFilm);
              res.redirect('/films');
      }
      else{
          res.redirect('/films');
      }

    });
});

router.get('/film/:id', function(req,res){
  let thisFilm = Film.getFilm(req.params.id);

  if(thisFilm){
    res.status(200);
    res.setHeader('Content-Type', 'text/html');
    res.render("film/film_details.ejs", {film: thisFilm} );
  }else{
    let errorCode=404;
    res.status(errorCode);
    res.setHeader('Content-Type', 'text/html');
    res.render("error.ejs", {"errorCode":errorCode});
  }

});

router.get('/film/:id/edit', function(req,res){
  let thisFilm = Film.getFilm(req.params.id);
  thisFilm.id=req.params.id;

  if(thisFilm){
    res.status(200);
    res.setHeader('Content-Type', 'text/html');
    res.render("film/edit_film.ejs", {film: thisFilm} );
  }
  else{
    let errorCode=404;
    res.status(errorCode);
    res.setHeader('Content-Type', 'text/html');
    res.render("error.ejs", {"errorCode":errorCode});
  }
});

router.put('/film/:id', function(req,res){
  let films = Film.getAllFilms();
  let newFilmData = {};


  newFilmData["title"] = req.body.title;
  newFilmData["linkTitle"] = req.body.title;
  newFilmData["year"]= req.body.year;
  newFilmData["rating"]= req.body.rating;
  newFilmData["director"]= req.body.director;
  newFilmData["cast"]= req.body.cast;
  newFilmData["plot"]= req.body.plot;
  newFilmData["poster"]= req.body.poster;


  Film.updateFilm(req.body.title, newFilmData);
  res.redirect('/films');
});


router.delete('/film/:id', function(req, res){
  //console.log(req.params.id);
  Film.deleteFilm(req.params.id);
  res.redirect('/films');
});

module.exports = router
