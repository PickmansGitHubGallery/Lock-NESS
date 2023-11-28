const sqlite3 = require('sqlite3');

const path = require('path');
const { rejects } = require('assert');
const dbPath = path.join(__dirname,'PokemonDatabase.db');
const db = new sqlite3.Database(dbPath);

function createUser() {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO User(Email, Password, Username) VALUES (?, ?, ?)', ["hej", "123","hej123"], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
function createPokemon() {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO Pokemon(Type, Gmax, Free, Basic, Breedable, Mega) VALUES (?, ?, ?, ?,?,?)', ["Charmander", 0,0,1,1,0], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
function getAllPokemons() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM Pokemon', async function (err,pokemons) {
      if (err) {
        reject(err);
      } else {
        resolve(pokemons);
      }
    });
  });
}
function getAllBasicPokemons() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM Pokemon WHERE Basic = 1', async function (err,pokemons) {
      if (err) {
        reject(err);
      } else {
        resolve(pokemons);
      }
    });
  });
}

  module.exports = {
    createUser,
    createPokemon,
    getAllPokemons,
    getAllBasicPokemons
  };