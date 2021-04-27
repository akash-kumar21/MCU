let express = require('express'), router = express.Router();
let request = require('request');

let Character = require('../models/character_model');
let Blog = require('../models/blog_model');

let public_key = "4995c2342eb4eb866a5878d44efb3c7c";
let private_key = "eba37e2cd1e79332c5fb0492d002c33a8c3e0ef9";
let ts = "1";
var md5 = require('md5');
let hash = md5(ts+private_key+public_key);





router.get('/characters', async function(req, res){
  try {
    let characterList = await Character.getAllCharacters();
    let blogList = await Blog.getAllBlogs();
    res.status(200);
    res.setHeader('Content-Type', 'text/html');
    res.render('character/show_characters.ejs', {
      characters: characterList,
      blogs: blogList
    });
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


router.get('/character/create', async function(req, res){
  let blogs = await Blog.getAllBlogs();
  try {
    let name=req.query.name;
    name=name.replace(/ /g, '%20');


    await request("https://gateway.marvel.com:443/v1/public/characters?name="+name+"&ts="+ts+"&apikey="+public_key+"&hash="+hash, function(err, response, body) {
        if(!err && name.length > 0 && JSON.parse(body).data.results.length > 0){
          let characterResponse = JSON.parse(body);
          let realObject = {};
          realObject.name = characterResponse.data.results[0].name;
          realObject.description = characterResponse.data.results[0].description;
          res.status(200);
          res.setHeader('Content-Type', 'text/html');
          res.render('character/new_character.ejs', {
            character: realObject
          });
        }
        else{
          res.redirect('/characters');
        }
      });
  }
  catch (error) {
    res.status(500);
    res.setHeader('Content-Type', 'text/html')
    res.render("error.ejs", {
      errorCode: "500",
      allPosts: blogs
    });
  }
});


router.post('/character/:id', async function(req, res){
  let blogs = await Blog.getAllBlogs();
  try {

    let name = req.params.id.replace(/ /g, '%20').replace("-","%20");

    await request("https://gateway.marvel.com:443/v1/public/characters?name="+name+"&ts="+ts+"&apikey="+public_key+"&hash="+hash, function(err, response, body) {
              let characterResponse = JSON.parse(body);
              if(!err && characterResponse.data.results[0].name.length > 0){
                let newCharacter={
                  "name": characterResponse.data.results[0].name,
                  "description": characterResponse.data.results[0].description
                }
                let newID = characterResponse.data.results[0].name.replace(/ /g,"-");
                Character.saveCharacter(newID, newCharacter);
                res.redirect('/characters');
        }
        else {
            res.redirect('/characters');
        }
      });
  }
  catch (error) {
    res.status(500);
    res.setHeader('Content-Type', 'text/html')
    res.render("error.ejs", {
      errorCode: "500",
      allPosts: blogs
    });
  }
});





router.get('/character/:id', async function(req,res) {
  try {
    let thisCharacter = await Character.getCharacter(req.params.id);

    if(thisCharacter){
      res.status(200);
      res.setHeader('Content-Type', 'text/html');
      res.render("character/character_details.ejs", {character: thisCharacter} );
    }else{
      let errorCode=404;
      res.status(errorCode);
      res.setHeader('Content-Type', 'text/html');
      res.render("error.ejs", {"errorCode":errorCode});
    }
  }
  catch (error) {
    response.status(500);
    response.setHeader('Content-Type', 'text/html');
    let blogs = await Blog.getAllBlogs();
    response.render("error.ejs", {
      errorCode: "500",
      allPosts: blogs
    });
  }
});



router.get('/character/:id/edit', async function(req,res) {
  try {
    let thisCharacter = await Character.getCharacter(req.params.id);
    thisCharacter.id=req.params.id;

    if(thisCharacter){
      res.status(200);
      res.setHeader('Content-Type', 'text/html');
      res.render("character/edit_character.ejs", {
        character: thisCharacter
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
      allPosts: blogs
    });
  }
});


router.put('/character/:id', async function(req,res){
  try {
    let characters = await Character.getAllCharacters();
    let newCharacterData = {};


    newCharacterData["name"] = req.body.name;
    newCharacterData["description"] = req.body.description;


    Character.updateCharacter(req.body.name.replace(/ /g, '-'), newCharacterData);
    res.redirect('/characters');
  }
  catch (error) {
    res.status(500);
    res.setHeader('Content-Type', 'text/html');
    let blogs = await Blog.getAllBlogs();
    res.render("error.ejs", {
      errorCode: "500",
      allPosts: blogs
    });
  }
});


router.delete('/character/:id', function(req, res){
  //console.log(req.params.id);
  Character.deleteCharacter(req.params.id);
  res.redirect('/characters');
});

module.exports = router
