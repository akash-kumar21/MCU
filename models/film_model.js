var fs = require('fs');

exports.getAllFilms = function() {
  var filmData = fs.readFileSync('data/films.json', 'utf8');
  return JSON.parse(filmData);
}

exports.getFilm = function(id) {
  var filmData = exports.getAllFilms();

  if (filmData[id]) return filmData[id];

  return {};
}

exports.saveFilm = function(id, newFilm) {
  var filmData = exports.getAllFilms();
  filmData[id] = newFilm;
  fs.writeFileSync('data/films.json', JSON.stringify(filmData));
}

exports.updateFilm = function(id, filmData) {
  exports.saveFilm(id, filmData)
}

exports.deleteFilm = function(id) {
  var filmData = exports.getAllFilms();
  delete filmData[id];
  fs.writeFileSync('data/films.json', JSON.stringify(filmData));
}
