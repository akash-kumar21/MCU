var admin = require("firebase-admin");
var db = admin.firestore();



exports.getAllQuizzes = async function() {
  let allQuizzes = {};

  try {
    let quizzes = await db.collection('quizzes').get();
    for (quiz of quizzes.docs) {
      allQuizzes[quiz.id] = quiz.data();
    }
    return allQuizzes;

  } catch (err) {
    console.log('Error getting documents', err);
  }
}


exports.getQuiz = async function(id) {
  try {
    let allQuizzes = await exports.getAllQuizzes();

    if (allQuizzes[id]) {
      return allQuizzes[id];
    }
  } catch (err) {
    console.log(err)
  }
}
