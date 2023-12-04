const sqlite3 = require('sqlite3');
const path = require('path');
const { rejects } = require('assert');
const dataHandler = require('../modules/DataHandler');
const dbPath = path.join(__dirname,'PokemonDatabase.db');
const db = new sqlite3.Database(dbPath);
const login = require('../database/login.js');

function createUser(email, password, brugernavn) {
    return new Promise((resolve, reject) => {
      hashedPassword = login.hashPassword(password);
      db.run('INSERT INTO User(Email, Password, Username) VALUES (?, ?, ?)', [email,hashedPassword,brugernavn], function (err) {
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
    db.run('INSERT INTO Pokemon(Type, Gmax, Basic, Breedable, Mega) VALUES (?, ?, ?, ?, ?)', ["Charmander", 0,0,1,1,0], function (err) {
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
async function insertPokemonIntoDB(pokemonList) {
  try {
    db.serialize(() => {
      
      const insertStatement = db.prepare(`INSERT INTO Pokemon (Type, Pokemonid, Gmax, Basic, Breedable, Mega) VALUES (?, ?, ? , ?, ?, ?)`);

      pokemonList.forEach((pokemon) => {
        const basicInt = pokemon.Basic ? 1 : 0;
        const breedableInt = pokemon.Breedable ? 1 : 0;
        const gmaxInt = pokemon.Gmax ? 1 : 0;
        const megaInt = pokemon.Mega ? 1 : 0;
        insertStatement.run(pokemon.Type, pokemon.Pokemonid, gmaxInt,basicInt, breedableInt, megaInt);
      });

      insertStatement.finalize();
    });
    db.close();

    console.log('Pokémon inserted into the database successfully.');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function createAndInsertPokemonList() {
  try {
    const uniquePokemonList = await dataHandler.UpdateGmaxAndMega();
    await insertPokemonIntoDB(uniquePokemonList);
  } catch (error) {
    console.error(error);
    // Handle errors appropriately
  }
}
function getUser(brugernavn) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM User WHERE Username = ?', [brugernavn], async function (err,user) {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}
async function setToken(token, brugernavn) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE User SET Token = ? WHERE Username = ?', [token, brugernavn], function (err) {
      if (err) {
        reject(err);
      } else {
        db.get('SELECT * FROM User WHERE Username = ?', [brugernavn], (err, user) => {
          if (err) {
            reject(err);
          } else {
            resolve(user);
          }
        });
      }
    });
  });
}
async function authenticateUser(brugernavn, password) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM User WHERE Username = ?', [brugernavn], async function (err, userData) {
      if (err) {
        reject(err);
        return;
      }
      if (!userData) {
        reject(new Error('User not found'));
        return;
      }
      // Hash the entered password
      const enteredPasswordHash = login.hashPassword(password);

      // Compare the hashed entered password with the hashed password from the database
      if (enteredPasswordHash === userData.password) {
        resolve(userData); // Resolve with the user data
      } else {
        reject(new Error('Incorrect password'));
      }
    });
  });
}

async function getUserByToken(token) {
  {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM User WHERE token = ?', [token], async function (err, userData) {
        if (err) {
          reject(err);
          return;
        }
        if (!userData) {
          reject(new Error('User not found'));
          return;
        }
        resolve(userData);
    })
    });
  }

}

  module.exports = {
    createUser,
    createPokemon,
    getAllPokemons,
    getAllBasicPokemons,
    createAndInsertPokemonList,
    getUser,
    setToken,
    authenticateUser
  };