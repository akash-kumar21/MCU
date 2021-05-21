let express = require('express'), router = express.Router();
let request = require('request');

let Film = require('../models/film_model');
let Blog = require('../models/blog_model');

let apikey = 'f09c17eb';


const fs = require('fs');

function loggedIn(request, response, next) {
  if (request.user) {
    next();
  } else {
    response.redirect('/login');
  }
}



router.get('/films', loggedIn, async function(req, res){
  try {
    let filmList = await Film.getAllFilms();
    let blogList = await Blog.getAllBlogs();
    res.status(200);
    res.setHeader('Content-Type', 'text/html');
    res.render('film/show_films.ejs', {
      films: filmList,
      blogs: blogList,
      user: request.user
    });
  }
  catch (error) {
    response.status(500);
    response.setHeader('Content-Type', 'text/html')
    response.render("error.ejs", {
      errorCode: "500",
      allPosts: blogs,
      user: request.user
    });
  }
});


router.get('/film/create', loggedIn, async function(req, res){
  try {
    let title=req.query.title;
    title=title.replace(/ /g, '+');
    request("http://www.omdbapi.com/?apikey="+apikey+"&t="+title+"&r=json", function(err, response, body) {
        if(!err){
          let filmResponse = JSON.parse(body);
          res.status(200);
          res.setHeader('Content-Type', 'text/html');
          res.render('film/new_film.ejs', {
            film: filmResponse,
            user: request.user
          });
        }
        else{
          res.redirect('/films');
        }
      });
  }
  catch (error) {
    response.status(500);
    response.setHeader('Content-Type', 'text/html')
    response.render("error.ejs", {
      errorCode: "500",
      allPosts: blogs,
      user: request.user
    });
  }
});


router.post('/film/:imdbID', loggedIn, async function(req, res){
  try {
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
                res.redirect('/');
        }
        else {
            res.redirect('/');
        }
      });
  }
  catch (error) {
    response.status(500);
    response.setHeader('Content-Type', 'text/html')
    response.render("error.ejs", {
      errorCode: "500",
      allPosts: blogs,
      user: request.user
    });
  }

});

router.get('/film/:id', loggedIn, async function(req,res) {
  try {
    let thisFilm = await Film.getFilm(req.params.id);

    if(thisFilm){
      res.status(200);
      res.setHeader('Content-Type', 'text/html');
      res.render("film/film_details.ejs", {film: thisFilm} );
    }else{
      let errorCode=404;
      res.status(errorCode);
      res.setHeader('Content-Type', 'text/html');
      res.render("error.ejs", {
        "errorCode":errorCode,
        user: request.user
      });
    }
  }
  catch (error) {
    response.status(500);
    response.setHeader('Content-Type', 'text/html');
    let blogs = await Blog.getAllBlogs();
    response.render("error.ejs", {
      errorCode: "500",
      allPosts: blogs,
      user: request.user
    });
  }
});


router.get('/film/:id/edit', loggedIn, async function(req,res) {
  try {
    let thisFilm = await Film.getFilm(req.params.id);
    thisFilm.id=req.params.id;

    if(thisFilm){
      res.status(200);
      res.setHeader('Content-Type', 'text/html');
      res.render("film/edit_film.ejs", {
        film: thisFilm
      });
    }
    else{
      let errorCode=404;
      res.status(errorCode);
      res.setHeader('Content-Type', 'text/html');
      res.render("error.ejs", {
        "errorCode":errorCode
      });
    }
  }
  catch (error) {
    response.status(500);
    response.setHeader('Content-Type', 'text/html');
    let blogs = await Blog.getAllBlogs();
    response.render("error.ejs", {
      errorCode: "500",
      allPosts: blogs,
      user: request.user
    });
  }
});


router.put('/film/:id', loggedIn, async function(req,res){
  try {
    let films = await Film.getAllFilms();
    let newFilmData = {};


    newFilmData["title"] = req.body.title;
    newFilmData["linkTitle"] = req.body.title;
    newFilmData["year"]= req.body.year;
    newFilmData["rating"]= req.body.rating;
    newFilmData["director"]= req.body.director;
    newFilmData["cast"]= req.body.cast;
    newFilmData["plot"]= req.body.plot;
    newFilmData["poster"]= req.body.poster;


    await Film.updateFilm(req.body.title, newFilmData);
    res.redirect('/films');
  }
  catch (error) {
    response.status(500);
    response.setHeader('Content-Type', 'text/html');
    let blogs = await Blog.getAllBlogs();
    response.render("error.ejs", {
      errorCode: "500",
      allPosts: blogs,
      user: request.user
    });
  }
});


router.delete('/film/:id', loggedIn, async function(req, res){
  //console.log(req.params.id);
  Film.deleteFilm(req.params.id);
  res.redirect('/films');
});

module.exports = router
