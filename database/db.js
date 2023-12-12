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
      if (enteredPasswordHash === userData.Password) {
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
async function getMyTeam(user) {
  return new Promise((resolve, reject) => {
    db.all('SELECT t.Uid, p.PokemonID, t.Location, COALESCE(t.Nickname, p.Type) AS Nickname FROM team t INNER JOIN Pokemon p ON t.Pid = p.PokemonId WHERE t.Uid = ?', [user.Userid], async function (err, pokemons) {
      if (err) {
        reject(err);
      } else {
        resolve(pokemons);
      }
    });
  });
}
async function updatePokemonLocation(pokemonId, location, userID) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE team SET Location = ? WHERE Pid = ? AND Uid = ?', [location, pokemonId, userID], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
async function insertPokemonIntoTeam(pokemonId, location, userID) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO team (Uid, Pid, Location) VALUES (?, ?, ?)', [userID, pokemonId, location], function(err) {
      if (err) {
        reject(err); // Reject with the error if there's an issue
      } else {
        resolve('Location updated successfully'); // Resolve with a success message
      }
    });
  });
}
async function insertPokemonListIntoTeam(pokemonList, location, userID) {
  try {
    const promises = pokemonList.map(async (pokemon) => {
      await db.run('INSERT INTO team (Uid, Pid, Location) VALUES (?, ?, ?)', [userID, pokemon.Pokemonid, location]);
    });

    await Promise.all(promises);
    
    return 'All Pokémon inserted into team successfully';
  } catch (err) {
    console.error('Error inserting Pokémon into team:', err);
    throw new Error('Failed to insert Pokémon into team');
  }
}

async function updateNickname(nickname, pokemonId, userID) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE team SET Nickname = ? WHERE Pid = ? AND Uid = ?', [nickname, pokemonId, userID], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
async function insertEvolvedPokemonIntoDB(pokemonList) {
  try {
    db.serialize(() => {
      const insertStatement = db.prepare('INSERT INTO Evolve (PokeID, EvolveFromID) VALUES (?, ?)');

      pokemonList.forEach((pokemon) => {
        const PokemonId = pokemon.Pokemonid;
        const EvolveFrom = pokemon.evolve_from;
        insertStatement.run(PokemonId, EvolveFrom);
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
async function getEvolutions(inputID) {
  return new Promise((resolve, reject) => {
    db.all('SELECT p.PokemonId, p.Type FROM evolve e INNER JOIN Pokemon p ON e.PokeID = p.PokemonId WHERE e.EvolveFromID = ?', [inputID], async function (err, pokemons) {
      if (err) {
        reject(err);
      } else {
        resolve(pokemons);
      }
    });
  });
}
async function updateEvolved(pokemonId, userID, newPokemonId) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE team SET Pid = ? WHERE Pid = ? AND Uid = ?', [newPokemonId, pokemonId, userID], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

  module.exports = {
    createUser,
    getAllPokemons,
    getAllBasicPokemons,
    createAndInsertPokemonList,
    getUser,
    setToken,
    authenticateUser,
    getUserByToken,
    getMyTeam,
    updatePokemonLocation,
    insertPokemonIntoTeam,
    insertPokemonListIntoTeam,
    updateNickname,
    insertEvolvedPokemonIntoDB,
    getEvolutions,
    updateEvolved
  };