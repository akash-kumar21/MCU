let express = require('express'), router = express.Router();
let request = require('request');

let Quiz = require('../models/quiz_model');
let Blog = require('../models/blog_model');

const fs = require('fs');


function loggedIn(request, response, next) {
  if (request.user) {
    next();
  } else {
    response.redirect('/login');
  }
}


router.get('/quizzes', loggedIn, async function(req, res) {
  try {
    let quizList = await Quiz.getAllQuizzes();
    let blogs = await Blog.getAllBlogs();

    res.status(200);
    res.setHeader('Content-Type', 'text/html');
    res.render('quiz/show_quizzes.ejs', {
      quizzes: quizList,
      allPosts: blogs,
      user: request.user
    });
  }
  catch (error) {
      response.status(500);
      response.setHeader('Content-Type', 'text/html')
      response.render("error", {
        "errorCode": "500",
        user: request.user
      });
    }

});


router.get('/quiz/:quizID', loggedIn, async function(request, response) {
  try {
    let blogs = await Blog.getAllBlogs();

    let quizzes = await Quiz.getAllQuizzes();
    let quizName = request.params.quizID;

    if(quizzes[quizName]){
      let quiz = quizzes[quizName];

      response.status(200);
      response.setHeader('Content-Type', 'text/html')
      response.render("quiz/quiz_details.ejs",{
        quiz: quiz,
        allPosts: blogs
      });


    }
    else{
      response.status(404);
      response.setHeader('Content-Type', 'text/html')
      response.render("error.ejs", {
        errorCode: "404",
        allPosts: blogs,
        user: request.user
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


router.post('/quizzes', loggedIn, async function(request, response) {
  try  {
    let id = request.body.title;
    let thisQuiz = await Quiz.getQuiz(id);
    let thisQuizAnswers = thisQuiz.answers;

    let userAnswers = [];
    for (let i = 0; i < thisQuizAnswers.length; i++) {
      let key = "q" + i;
      userAnswers.push(request.body[key]);
    }
    //console.log(userAnswers);

    let numer = 0;
    let denom = 0;
    for (let i = 0; i < thisQuizAnswers.length; i++) {
      let userAnswer = userAnswers[i];
      let realAnswer = thisQuizAnswers[i];
      if (userAnswer === realAnswer) {
        numer++;
      }
      denom++;
    }

    let score = {
        numer: numer,
        denom: denom
    };

    // let id = request.body.title.trim().replace(' ', '-');
    // Blog.saveBlog(id, b);
    response.render("quiz/quiz_score.ejs",{
      quiz: thisQuiz,
      score: score
    });
    //response.redirect("/");
  }
  catch (error) {
    response.status(500);
    response.setHeader('Content-Type', 'text/html')
    response.render("error.ejs", {
      errorCode: "500"
    });
  }

});



module.exports = router
