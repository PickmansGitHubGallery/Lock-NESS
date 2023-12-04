const crypto = require('crypto');

function generateHashToken(input, salt) {
    const hash = crypto.createHash('sha256');
    hash.update(input+ salt);
    return hash.digest('hex');
}
function hashPassword(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

  function getCurrentTimestamp() {
      const currentDateTime = new Date();
      // Format the date and time as a string (e.g., "2023-11-13 12:34:56")
      const formattedDateTime = currentDateTime.toISOString().replace('T', ' ').slice(0, 19);
    
      return formattedDateTime;
}

module.exports = { generateHashToken, hashPassword, getCurrentTimestamp };

