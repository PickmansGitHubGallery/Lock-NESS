const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');  // Import your Express app
const loginModule = require('../');
chai.use(chaiHttp);
const expect = chai.expect;

describe('Authentication Methods', () => {
  it('ensure that a person is able to create a user', () => {
    var username = "Lucas";
    var password = "Havenkvist";
    var email = "luhavenvkist@yahoo.dk";

    var result = loginModule.createUser(email, password, username);
    expect(result).to.be.true;
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
