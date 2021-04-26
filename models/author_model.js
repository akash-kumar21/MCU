var admin = require("firebase-admin");
var db = admin.firestore();



exports.getAllAuthors = async function() {
  let allAuthors = {};

  try {
    let authors = await db.collection('authors').get();
    for (author of authors.docs) {
      allAuthors[author.id] = author.data();
    }
    return allAuthors;

  } catch (err) {
    console.log('Error getting documents', err);
  }
}


exports.getAuthor = async function(id) {
  try {
    let allAuthors = await exports.getAllAuthors();

    if (allAuthors[id]) {
      return allAuthors[id];
    }
  } catch (err) {
    console.log(err)
  }
}
