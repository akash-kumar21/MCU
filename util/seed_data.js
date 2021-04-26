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
    winks: blog.winks,
    comments: blog.comments
  });
}


let films = JSON.parse(fs.readFileSync('data/films.json'));

for (let filmname in films) {
  let film = films[filmname];
  film.filmname = filmname;
  let oneFilm = db.collection('films').doc(filmname);
  oneFilm.set({
    title: film.title,
    year: film.year,
    rating: film.rating,
    director: film.director,
    cast: film.cast,
    plot: film.plot,
    poster: film.poster
  });
}


let users = JSON.parse(fs.readFileSync('data/users.json'));

for (let username in users) {
  let user = users[username];
  user.username = username;
  let oneUser = db.collection('users').doc(username);
  oneUser.set({
    username: user.username,
    name: user.name,
    linkName: user.linkName,
    quote: user.quote,
    email: user.email,
    photoURL: user.photoURL
  });
}


let authors = JSON.parse(fs.readFileSync('data/authors.json'));

for (let authorname in authors) {
  let author = authors[authorname];
  author.authorname = authorname;
  let oneAuthor = db.collection('authors').doc(authorname);
  oneAuthor.set({
    username: author.username,
    name: author.name,
    linkName: author.linkName,
    quote: author.quote,
    email: author.email,
    photoURL: author.photoURL
  });
}
