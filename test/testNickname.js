const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');  // Import your Express app
const nickNameModule = require('../Utilities/nickName.js');
chai.use(chaiHttp);
const expect = chai.expect;


describe('Nickname Methods', () => {
    it('should validate length of nickname is not 0', () => {
        const nickname = 'testUser';
        const result = nickNameModule.validateNickName(nickname);
        expect(result).to.be.true;
    });
    it('should validate length of nickname is 0', () => {
        const nickname = '';
        const result = nickNameModule.validateNickName(nickname);
        expect(result).to.be.false; 
    });
    it('should validate length of nickname is more than 12', () => {
        const nickname = 'testUser1234567890';
        const result = nickNameModule.validateNickName(nickname);
        expect(result).to.be.false;
    });
    it('should validate length of nickname is less than 12', () => {
        const nickname = 'testUser123';
        const result = nickNameModule.validateNickName(nickname);
        expect(result).to.be.true;
    });
    it('should validate nickname does not contain emojis', () => {
        const nickname = 'testUser😀';
        const result = nickNameModule.validateNickName(nickname);
        expect(result).to.be.false;
    });
    it('should validate nickname contains emojis', () => {
        const nickname = 'testUser';
        const result = nickNameModule.validateNickName(nickname);
        expect(result).to.be.true;
    });
    it('should validate nickname contains æ, ø, å', () => {
        const nickname = 'testUseræøå';
        const result = nickNameModule.validateNickName(nickname);
        expect(result).to.be.true;
    });
    it('should validate nickname contains ä, ö, ü', () => {
        const nickname = 'testUseräöü';
        const result = nickNameModule.validateNickName(nickname);
        expect(result).to.be.true;
    });
    it('should validate nickname contains !, ?, #', () => {
        const nickname = 'testUser!#?';
        const result = nickNameModule.validateNickName(nickname);
        expect(result).to.be.true;
    });
    //it('should validate nickname contains ')
});