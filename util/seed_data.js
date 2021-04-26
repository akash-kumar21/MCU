let fs = require('fs');
let admin = require("firebase-admin");
let serviceAccount = require("../config/firebase-config.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
let db = admin.firestore();



let blogs = JSON.parse(fs.readFileSync('data/blogs.json'));

for (let blogname in blogs) {
  let blog = blogs[blogname];
  blog.blogname = blogname;
  let oneBlog = db.collection('blogs').doc(blogname);
  oneBlog.set({
    title: blog.title,
    image: blog.image,
    date: blog.date,
    author: blog.author,
    previewContent: blog.previewContent,
    content: [
      blog.content[0],
      blog.content[1]
    ],
    winks: blog.winks
  });

}
