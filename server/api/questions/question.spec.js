/* global describe beforeEach it */

const { expect } = require("chai");
const request = require("supertest");
const db = require("../../db");
const app = require("../../index");
const { User, Document, Question } = require("../../db/models");
Promise = require("bluebird");

describe("Question routes", () => {
  beforeEach(() => {
    return db.sequelize.sync({});
  });

  describe("/api/questions/", () => {
    before(() => {
      return Promise.map(
        [
          {
            title:
              "Do you agree that exchange tokens do not constitute specified investments and do not fall within the FCA’s regulatory perimeter? If not, please explain why.",
            description:
              "<p>The FCA does not consider -- and therefore has no plans to regulate -- exchange tokens. This includes exchanges that facilitate transactions of Bitcoin, Litecoin or other exchange tokens. AML rules apply, but these fall outside of the scope of the FCA.</p>",
            owner_id: 12
          },
          {
            title:
              "Do you agree with the assessment of how security tokens can be categorised as a specified investment or financial instrument? If not, please explain why.",
            description:
              "<p>The approach taken by the FCA specifies that security tokens are considered a specified investment because they confer the same type of rights to holders of these instruments as regulated securities (e.g. profit sharing, voting rights). Furthermore, products that reference tokens or shares, are likely to fall within the regulatory perimeter as a specified investment, or a financial instrument under MiFID II.</p>",
            owner_id: 12
          },
          {
            title:
              "Do you agree with [the FCA’s] assessment of utility tokens? If not, please explain why.",
            description:
              "<p>Like exchange tokens, the FCA considers utility tokens to fall outside their remit because they do not grant a prospective buyer with a right to profit-sharing. Instead, they offer a prospective buyer rights that are similar to pre-payment vouchers or rewards offered by crowdfunding websites.</p>",
            owner_id: 12
          }
        ],
        question => Question.create(question)
      );
    });

    it("POST /api/questions", () => {
      return request(app)
        .post("/api/questions")
        .send({
          title:
            "Do you agree with our assessment that exchange tokens could be used to facilitate regulated payments?",
          description:
            "<p>The FCA reports a use case in their regulatory “sandbox” where firms have experimented using exchange tokens to facilitate foreign currency transactions. They claim that beneficiaries of these foreign currency transactions are not exposed to cryptoasset risk, since the currency is only used by the provider of the service.</p>",
          owner_id: 12
        })
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.title).to.be.equal(
            "Do you agree with our assessment that exchange tokens could be used to facilitate regulated payments?"
          );
        });
    });

    it("GET /api/questions", () => {
      return request(app)
        .get("/api/questions")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("array");
        });
    });

    it("GET /api/questions/:questionId", () => {
      return request(app)
        .get("/api/questions/1")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
        });
    });

    after(() => {
      return Promise.map(
        [
          {
            title:
              "Do you agree that exchange tokens do not constitute specified investments and do not fall within the FCA’s regulatory perimeter? If not, please explain why.",
            description:
              "<p>The FCA does not consider -- and therefore has no plans to regulate -- exchange tokens. This includes exchanges that facilitate transactions of Bitcoin, Litecoin or other exchange tokens. AML rules apply, but these fall outside of the scope of the FCA.</p>",
            owner_id: 12
          },
          {
            title:
              "Do you agree with the assessment of how security tokens can be categorised as a specified investment or financial instrument? If not, please explain why.",
            description:
              "<p>The approach taken by the FCA specifies that security tokens are considered a specified investment because they confer the same type of rights to holders of these instruments as regulated securities (e.g. profit sharing, voting rights). Furthermore, products that reference tokens or shares, are likely to fall within the regulatory perimeter as a specified investment, or a financial instrument under MiFID II.</p>",
            owner_id: 12
          },
          {
            title:
              "Do you agree with [the FCA’s] assessment of utility tokens? If not, please explain why.",
            description:
              "<p>Like exchange tokens, the FCA considers utility tokens to fall outside their remit because they do not grant a prospective buyer with a right to profit-sharing. Instead, they offer a prospective buyer rights that are similar to pre-payment vouchers or rewards offered by crowdfunding websites.</p>",
            owner_id: 12
          },
          {
            title:
              "Do you agree with our assessment that exchange tokens could be used to facilitate regulated payments?",
            description:
              "<p>The FCA reports a use case in their regulatory “sandbox” where firms have experimented using exchange tokens to facilitate foreign currency transactions. They claim that beneficiaries of these foreign currency transactions are not exposed to cryptoasset risk, since the currency is only used by the provider of the service.</p>",
            owner_id: 12
          }
        ],
        question => Question.destroy({ where: question })
      );
    });
  }); // end describe('/api/users')
}); // end describe('User routes')
