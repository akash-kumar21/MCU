var admin = require("firebase-admin");
var db = admin.firestore();



exports.getAllUsers = async function() {
  let allUsers = {};

  try {
    let users = await db.collection('users').get();
    for (user of users.docs) {
      allUsers[user.id] = user.data();
    }
    return allUsers;

  } catch (err) {
    console.log('Error getting documents', err);
  }
}


exports.getUser = async function(id) {
  try {
    let allUsers = await exports.getAllUsers();

    if (allUsers[id]) {
      return allUsers[id];
    }
  } catch (err) {
    console.log(err)
  }
}
