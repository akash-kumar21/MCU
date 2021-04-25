let fs = require('fs');
let admin = require("firebase-admin");
let serviceAccount = require("../config/firebase-config.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
let db = admin.firestore();

// let users = JSON.parse(fs.readFileSync('../data/users.json'));
//
// for (username in users) {
//   let user = users[username];
//   user.username = username;
//   let oneUser = db.collection('users').doc(username);
//   oneUser.set({
//     win_percent: (user.wins / parseFloat(user.wins + user.losses) * 100).toFixed(2),
//     name: user.name,
//     photo: user.photo,
//     wins: user.wins,
//     losses: user.losses
//   });
//
// }

let blogs = JSON.parse(fs.readFileSync('data/blogs.json'));

for (let blogname in blogs) {
  let blog = blogs[blogname];
  blog.blogname = blogname;
  let oneBlog = db.collection('blogs').doc(blogname);
  oneBlog.set({
    title: blog.title,
    image: blog.image,
    author: blog.author,
    previewContent: blog.previewContent,
    content: [
      blog.content[0],
      blog.content[1]
    ],
    // tags: [
    //   [blog.tags[0][0], blog.tags[0][1]],
    //   [blog.tags[1][0], blog.tags[1][1]],
    //   [blog.tags[2][0], blog.tags[2][1]]
    // ],
    winks: blog.winks
  });

}
