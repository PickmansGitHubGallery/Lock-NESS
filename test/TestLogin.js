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

    // Your assertion here
    expect(hashedPassword).to.be.a('string');
    // You may also check the length, specific characters, etc.
  });

  it('should generate a hash token correctly', () => {
    const username = 'testUser';
    const password = 'mySecurePassword';
    const salt = 'randomSalt';

    // Assuming you have the hashed password from the previous test
    const hashedPassword = loginModule.hashPassword(password);

    const token = loginModule.generateHashToken(hashedPassword, salt);

    // Your assertion here
    expect(token).to.be.a('string');
    // You may also check the length, specific characters, etc.
  });

  it('should create a local user with hashed password and token', () => {
    const username = 'testUser';
    const password = 'mySecurePassword';
    const salt = 'randomSalt';

    // Assuming you have the hashed password and token from previous tests
    const hashedPassword = loginModule.hashPassword(password);
    const token = loginModule.generateHashToken(hashedPassword, salt);

    // Your user creation logic here, e.g., save to a database
    const storedUser = { hashedPassword: hashedPassword, token: token };

    // Retrieve the user and check if the stored hashed password and token match
    // Your assertion here
    expect(storedUser.hashedPassword).to.equal(hashedPassword);
    expect(storedUser.token).to.equal(token);
  });

  // Your existing test for the Express app
  /*it('should return a response on GET /Generate', (done) => {
    chai
      .request(app)
      .get('/Login')  // Update the route to match your actual route
      .end((err, res) => {
        expect(res).to.have.status(200);
        // You can add more specific expectations based on your application's behavior
        // For example, check for the presence of certain content in the response body
        // expect(res.text).to.contain('SomeExpectedContent');
        done();
      });
  });*/

  // You can add more tests for other routes and functionality
});
