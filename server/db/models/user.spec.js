/* global describe beforeEach it */

const { expect } = require("chai");
const db = require("../index");
const { User, Role } = require("../index");
Promise = require("bluebird");

describe("User model", () => {
  describe("instanceMethods", () => {
    describe("correctPassword", () => {
      let cody;

      before(() => {
        return User.create({
          email: "cody@puppybook.com",
          password: "bones"
        }).then(user => {
          cody = user;
        });
      });

      it("returns true if the password is correct", () => {
        expect(cody.correctPassword("bones")).to.be.equal(true);
      });

      it("returns false if the password is incorrect", () => {
        expect(cody.correctPassword("bonez")).to.be.equal(false);
      });

      after(async () => {
        await User.destroy({ where: { id: cody.id } }).catch(err =>
          console.log(err)
        );
      });
    }); // end describe('correctPassword')
  }); // end describe('instanceMethods')
}); // end describe('User model')
