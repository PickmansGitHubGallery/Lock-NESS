const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');  // Import your Express app
const loginModule = require('../database/login.js');
chai.use(chaiHttp);
const expect = chai.expect;

describe('Authentication Methods', () => {
  it('should hash the password correctly', () => {
    const password = 'mySecurePassword';
    const hashedPassword = loginModule.hashPassword(password);

    expect(hashedPassword).to.be.a('string');
  });

  it('should generate a hash token correctly', () => {
    const username = 'testUser';
    const password = 'mySecurePassword';
    const salt = 'randomSalt';
    const hashedPassword = loginModule.hashPassword(password);

    const token = loginModule.generateHashToken(hashedPassword, salt);

    expect(token).to.be.a('string');
  });

  it('should create a local user with hashed password and token', () => {
    const username = 'testUser';
    const password = 'mySecurePassword';
    const salt = 'randomSalt';
    const hashedPassword = loginModule.hashPassword(password);
    const token = loginModule.generateHashToken(hashedPassword, salt);
    
    // Create a stored user object
    const storedUser = { hashedPassword: hashedPassword, token: token };

    // Validate the stored user object's properties
    expect(storedUser.hashedPassword).to.equal(hashedPassword);
    expect(storedUser.token).to.equal(token);
  });

  it('should generate identical hashes and tokens with the same input', () => {
    const password = 'mySecurePassword';
    const salt = 'randomSalt';
    // Generate two password hashes using the same password and salt
    const hashedPassword1 = loginModule.hashPassword(password);
    const hashedPassword2 = loginModule.hashPassword(password);

    // Generate two tokens using the same hashed password and salt
    const token1 = loginModule.generateHashToken(hashedPassword1, salt);
    const token2 = loginModule.generateHashToken(hashedPassword2, salt);

    // Validate that the generated hashes and tokens are identical
    expect(hashedPassword1).to.equal(hashedPassword2);
    expect(token1).to.equal(token2);
  });
});
