var fs = require('fs');

exports.getAllAuthors = function() {
  var authorData = fs.readFileSync('data/authors.json', 'utf8');
  return JSON.parse(authorData);
}

exports.getAuthor = function(id) {
  var authorData = exports.getAllAuthors();

  if (authorData[id]) return authorData[id];

  return {};
}

exports.getComments = function(id) {
  var authorData = exports.getAllAuthors();

  if (authorData[id]) return authorData[id].comments;

  return {};
}

exports.saveAuthor = function(id, newAuthor) {
  var authorData = exports.getAllAuthors();
  authorData[id] = newAuthor;
  fs.writeFileSync('data/authors.json', JSON.stringify(authorData));
}

exports.updateAuthor = function(id, authorData) {
  exports.saveAuthor(id, authorData)
}

exports.deleteAuthor = function(id) {
  var authorData = exports.getAllAuthors();
  delete authorData[id];
  fs.writeFileSync('data/authors.json', JSON.stringify(authorData));
}
