var admin = require("firebase-admin");
var db = admin.firestore();


exports.getAllFilms = async function() {
  let allFilms = {};

  try {
    let films = await db.collection('films').get();
    for (film of films.docs) {
      allFilms[film.id] = film.data();
    }
    return allFilms;

  } catch (err) {
    console.log('Error getting documents', err);
  }
}


exports.getFilm = async function(id) {
  try {
    let allFilms = await exports.getAllFilms();

    if (allFilms[id]) {
      console.log(id);
      return allFilms[id];
    }
  } catch (err) {
    console.log(err)
  }
}


exports.saveFilm = async function(id, newFilm) {
  try  {
    let allFilms = await exports.getAllFilms();
    allFilms[id] = newFilm;
    for (let filmname in allFilms) {
      let film = allFilms[filmname];
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
    }//for loop
  }
  catch (err) {
    console.log(err)
  }
}


exports.updateFilm = async function(id, filmData) {
  try {
    let allFilms = await exports.getAllFilms();
    allFilms[id] = filmData;
    for (let filmname in allFilms) {
      let film = allFilms[filmname];
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
    }//for loop
  }
  catch (err) {
    console.log(err)
  }
}


exports.deleteFilm = async function(id) {
  try {
    const res = await db.collection('films').doc(id).delete();
  }
  catch (err) {
    console.log(err)
  }
}
