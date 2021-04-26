var admin = require("firebase-admin");
var db = admin.firestore();


exports.getAllCharacters = async function() {
  let allCharacters = {};

  try {
    let characters = await db.collection('characters').get();
    for (character of characters.docs) {
      allCharacters[character.id] = character.data();
    }
    return allCharacters;

  } catch (err) {
    console.log('Error getting documents', err);
  }
}


exports.getCharacter = async function(id) {
  try {
    let allCharacters = await exports.getAllCharacters();

    if (allCharacters[id]) {
      console.log(id);
      return allCharacters[id];
    }
  } catch (err) {
    console.log(err)
  }
}


exports.saveCharacter = async function(id, newCharacter) {
  try  {
    let allCharacters = await exports.getAllCharacters();
    allCharacters[id] = newCharacter;
    for (let charactername in allCharacters) {
      let character = allCharacters[charactername];
      character.charactername = charactername;
      let oneCharacter = db.collection('characters').doc(charactername);
      oneCharacter.set({
        name: character.name,
        description: character.description
      });
    }//for loop
  }
  catch (err) {
    console.log(err)
  }
}


exports.updateCharacter = async function(id, characterData) {
  try {
    let allCharacters = await exports.getAllCharacters();
    console.log(allCharacters);
    console.log(id);
    allCharacters[id] = characterData;
    for (let charactername in allCharacters) {
      let character = allCharacters[charactername];
      character.charactername = charactername;

      let oneCharacter = db.collection('characters').doc(charactername);
      oneCharacter.set({
        name: character.name,
        description: character.description
      });
    }//for loop
  }
  catch (err) {
    console.log(err)
  }
}


exports.deleteCharacter = async function(id) {
  try {
    const res = await db.collection('characters').doc(id).delete();
  }
  catch (err) {
    console.log(err)
  }
}
