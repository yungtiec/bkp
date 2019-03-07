const { expect } = require("chai");
const db = require("./index");
const { Comment } = require("./index");

var parent, child, grandChild;

describe("Comment thread", () => {
  before(async () => {
    await db.sequelize.sync({});
    parent = await Comment.create({
      uri: "http://localhost:8080/project/DG/survey/3",
      quote:
        "nunc eget orci malesuada, a tincidunt nunc sagittis. Donec faucibus fermentum placerat. Ut bibendum purus vel viverra vehicula. Ut in arcu vitae turpis rhoncus fermentum. Integer varius malesuada dictum. Vestibulum placerat auctor eros in luctus. Ut at sem arcu. Sed commodo maximus malesuada. Morbi consequat lectus felis, eu malesuada metus placerat vitae. In porta dui non odio efficitur, at congue leo dapibus. Suspendisse potenti.",
      text: "parent"
    });
    child = await Comment.create({
      uri: "http://localhost:8080/project/DG/survey/3",
      quote:
        "nunc eget orci malesuada, a tincidunt nunc sagittis. Donec faucibus fermentum placerat. Ut bibendum purus vel viverra vehicula. Ut in arcu vitae turpis rhoncus fermentum. Integer varius malesuada dictum. Vestibulum placerat auctor eros in luctus. Ut at sem arcu. Sed commodo maximus malesuada. Morbi consequat lectus felis, eu malesuada metus placerat vitae. In porta dui non odio efficitur, at congue leo dapibus. Suspendisse potenti.",
      text: "child"
    });
    grandChild = await Comment.create({
      uri: "http://localhost:8080/project/DG/survey/3",
      quote:
        "nunc eget orci malesuada, a tincidunt nunc sagittis. Donec faucibus fermentum placerat. Ut bibendum purus vel viverra vehicula. Ut in arcu vitae turpis rhoncus fermentum. Integer varius malesuada dictum. Vestibulum placerat auctor eros in luctus. Ut at sem arcu. Sed commodo maximus malesuada. Morbi consequat lectus felis, eu malesuada metus placerat vitae. In porta dui non odio efficitur, at congue leo dapibus. Suspendisse potenti.",
      text: "grand child"
    });
    await parent.addChild(child.id);
    await child.addChild(grandChild.id);
  });

  it("creates correct hierarchy", async () => {
    var rootComment = await Comment.find({
      where: {
        uri: "http://localhost:8080/project/DG/survey/3",
        quote:
          "nunc eget orci malesuada, a tincidunt nunc sagittis. Donec faucibus fermentum placerat. Ut bibendum purus vel viverra vehicula. Ut in arcu vitae turpis rhoncus fermentum. Integer varius malesuada dictum. Vestibulum placerat auctor eros in luctus. Ut at sem arcu. Sed commodo maximus malesuada. Morbi consequat lectus felis, eu malesuada metus placerat vitae. In porta dui non odio efficitur, at congue leo dapibus. Suspendisse potenti.",
        hierarchyLevel: 1
      },
      include: {
        model: Comment,
        as: "descendents",
        hierarchy: true
      }
    });

    var parent = rootComment.toJSON();
    var child = rootComment.toJSON().children[0].toJSON();
    var grandChild = rootComment
      .toJSON()
      .children[0].toJSON()
      .children[0].toJSON();
    expect(parent.id).to.be.equal(child.parentId);
    expect(child.id).to.be.equal(grandChild.parentId);
  });
});
