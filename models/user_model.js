var fs = require('fs');

exports.getAllUsers = function() {
  var userData = fs.readFileSync('data/users.json', 'utf8');
  return JSON.parse(userData);
}

exports.getuser = function(id) {
  var userData = exports.getAllUsers();

  if (userData[id]) return userData[id];

  return {};
}

exports.getComments = function(id) {
  var userData = exports.getAllUsers();

  if (userData[id]) return userData[id].comments;

  return {};
}

exports.saveUser = function(id, newUser) {
  var userData = exports.getAllUsers();
  userData[id] = newUser;
  fs.writeFileSync('data/users.json', JSON.stringify(userData));
}

exports.updateUser = function(id, userData) {
  exports.saveUser(id, userData)
}

exports.deleteUser = function(id) {
  var userData = exports.getAllUsers();
  delete userData[id];
  fs.writeFileSync('data/users.json', JSON.stringify(userData));
}
