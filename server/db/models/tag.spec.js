const { expect } = require("chai");
const db = require("../index");
const { User, Document, Comment, Tag, TagLink } = require("../index");
Promise = require("bluebird");

describe("Tag", () => {
  describe("can be added to any user", () => {
    var user, tag;

    before(async () => {
      user = await User.create({
        email: "cody@puppybook.com",
        password: "bones"
      });
      tag = await Tag.findOne({
        where: { name: "web designer" }
      });
      var res = await user.addTag(tag.id);
      user = await User.findOne({
        where: { email: "cody@puppybook.com" },
        include: [
          {
            model: Tag
          }
        ]
      });
    });

    it("includes tags in the user instance", () => {
      expect(user.tags.length).to.be.equal(1);
      expect(user.tags[0].name).to.be.equal("web designer");
    });

    after(async () => {
      await User.destroy({ where: { id: user.id } }).catch(err =>
        console.log(err)
      );
    });
  });

  describe("can be added to any document", () => {
    var document, tag;

    before(async () => {
      document = await Document.create({
        title: "test"
      });
      tag = await Tag.create({
        name: "blockchain regulation",
        display_name: "Blockchain Regulation",
        type: "topic"
      });
      await document.addTag(tag);
      document = await Document.findOne({
        where: { title: "test" },
        include: [
          {
            model: Tag
          }
        ]
      });
    });

    it("includes tags in the document instance", () => {
      expect(document.tags.length).to.be.equal(1);
      expect(document.tags[0].name).to.be.equal("blockchain regulation");
    });

    after(async () => {
      await Document.destroy({ where: { title: "test" } });
      await TagLink.destroy({ where: { tagId: tag.id } });
      await Tag.destroy({ where: { name: "blockchain regulation" } });
    });
  });

  describe("can be added to any comment", () => {
    var comment, tag;

    before(async () => {
      comment = await Comment.create({
        comment: "test"
      });
      tag = await Tag.create({
        name: "blockchain regulation",
        display_name: "Blockchain Regulation",
        type: "topic"
      });
      await comment.addTag(tag);
      comment = await Comment.findOne({
        where: { comment: "test" },
        include: [
          {
            model: Tag
          }
        ]
      });
    });

    it("includes tags in the comment instance", () => {
      expect(comment.tags.length).to.be.equal(1);
      expect(comment.tags[0].name).to.be.equal("blockchain regulation");
    });

    after(async () => {
      await Comment.destroy({ where: { comment: "test" } });
      await TagLink.destroy({ where: { tagId: tag.id } });
      await Tag.destroy({ where: { name: "blockchain regulation" } });
    });
  });
});
