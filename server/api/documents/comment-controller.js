const router = require("express").Router({ mergeParams: true });
const db = require("../../db/index");
const permission = require("../../access-control")["Comment"];
const {
  Comment,
  Document,
  User,
  Role,
  Tag,
  Issue,
  Notification,
  Project,
  ProjectAdmin,
  ProjectEditor
} = require("../../db/models/index");
const _ = require("lodash");
Promise = require("bluebird");
const generateCommentHtml = require("../generateCommentHtml");
const { sendEmail, getAddedAndRemovedTags } = require("../utils");

const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.scope({
      method: [
        "flatThreadByRootId",
        {
          where: {
            doc_id: req.params.doc_id,
            hierarchyLevel: 1
          }
        }
      ]
    }).findAll();
    res.send(comments);
  } catch (err) {
    next(err);
  }
};

const postComment = async (req, res, next) => {
  try {
    var [issue, comment] = await Comment.create({
      owner_id: req.user.id,
      doc_id: Number(req.params.doc_id),
      comment: req.body.newComment
    }).then(comment =>
      Promise.all([
        Issue.create({
          open: true,
          comment_id: comment.id
        }),
        Comment.scope("withDocuments").findOne({
          where: { id: comment.id }
        })
      ])
    );
    const document = await Document.scope("includeAllEngagements").findOne({
      where: { id: req.params.doc_id }
    });
    const autoVerify = permission(
      "AutoVerify",
      {
        comment,
        project: comment.document.project
      },
      req.user
    );
    const issuePromise =
      req.body.issueOpen &&
      Issue.create({
        open: true,
        comment_id: comment.id
      });
    const autoVerifyPromise =
      autoVerify && comment.update({ reviewed: "verified" });
    const tagPromises = Promise.map(req.body.selectedTags, tag =>
      Tag.findOrCreate({
        where: { name: tag.value },
        default: { name: tag.value.toLowerCase(), display_name: tag.value }
      }).spread((tag, created) => comment.addTag(tag))
    );
    await Promise.all([issuePromise, autoVerifyPromise, tagPromises]);
    comment = await Comment.scope({
      method: ["flatThreadByRootId", { where: { id: comment.id } }]
    }).findOne();
    const isRepostedByBKPEmail = document.creator.email.includes("tbp.admin");
    //await sendEmail({
    //  recipientEmail: isRepostedByBKPEmail
    //    ? "info@thebkp.com"
    //    : document.creator.email,
    //  subject: `New Comment Activity From ${comment.owner.first_name} ${
    //    comment.owner.last_name
    //  }`,
    //  message: generateCommentHtml(
    //    process.env.NODE_ENV === "production",
    //    document.slug,
    //    comment.owner.first_name,
    //    comment.owner.last_name,
    //    comment,
    //    false
    //  )
    //});
    // Send this to info@thebkp.com
    //if (document.creator.id !== 12 && !isRepostedByBKPEmail) {
    await sendEmail({
      recipientEmail: "info@thebkp.com",
      subject: `New Comment Activity From ${comment.owner.first_name} ${
        comment.owner.last_name
      }`,
      message: generateCommentHtml(
        process.env.NODE_ENV === "production",
        "s",
        document.slug,
        comment.owner.first_name,
        comment.owner.last_name,
        comment,
        false
      )
    });
    //}

    res.send(comment);
  } catch (err) {
    next(err);
  }
};

const postReply = async (req, res, next) => {
  try {
    var ancestry;
    const isAdmin = req.user.roles.filter(r => r.name === "admin").length;
    const parent = await Comment.findById(Number(req.params.parentId));
    const child = _.assignIn(
      _.omit(parent.toJSON(), [
        "id",
        "createdAt",
        "updatedAt",
        "hierarchyLevel",
        "parentId",
        "comment",
        "reviewed",
        "owner"
      ]),
      {
        comment: req.body.newComment,
        reviewed: isAdmin ? "verified" : "pending"
      }
    );
    var [ancestors, reply, user] = await Promise.all([
      parent
        .getAncestors({
          include: [
            {
              model: User,
              as: "owner",
              required: false
            }
          ]
        })
        .then(ancestors =>
          _.orderBy(ancestors, ["hierarchyLevel"], ["asc"]).concat(parent)
        ),
      Comment.create(child),
      User.findById(req.user.id)
    ]);
    var rootAncestor = ancestors[0];
    reply = await reply.setParent(parent.toJSON().id);
    reply = await reply.setOwner(req.user.id);
    ancestry = await Comment.scope({
      method: [
        "flatThreadByRootId",
        { where: { id: rootAncestor ? rootAncestor.id : parent.id } }
      ]
    }).findOne();
    await Notification.notifyRootAndParent({
      sender: user,
      comment: _.assignIn(reply.toJSON(), {
        ancestors,
        document: ancestry.document
      }),
      parent,
      messageFragment: "replied to your post"
    });
    //await sendEmail({
    //  recipientEmail: ancestry.owner.email,
    //  subject: `New Reply Activity From ${user.first_name} ${user.last_name}`,
    //  message: generateCommentHtml(
    //    process.env.NODE_ENV === "production",
    //    ancestry.document.slug,
    //    user.first_name,
    //    user.last_name,
    //    ancestry.id,
    //    true
    //  )
    //});
    await sendEmail({
      recipientEmail: "info@thebkp.com",
      subject: `New Reply Activity From ${user.first_name} ${user.last_name}`,
      message: generateCommentHtml(
        process.env.NODE_ENV === "production",
        "s",
        ancestry.document.slug,
        user.first_name,
        user.last_name,
        ancestry.id,
        false
      )
    });
    res.send(ancestry);
  } catch (err) {
    next(err);
  }
};

const postUpvote = async (req, res, next) => {
  try {
    if (!req.body.hasUpvoted) {
      await req.user.addUpvotedComment(req.params.commentId);
    } else {
      await req.user.removeUpvotedComment(req.params.commentId);
    }
    const comment = await Comment.scope({
      method: ["upvotes", req.params.commentId]
    }).findOne();
    if (!req.body.hasUpvoted) {
      await Notification.notify({
        sender: req.user,
        comment,
        messageFragment: "liked your post"
      });
    }
    res.send({
      upvotesFrom: comment.upvotesFrom,
      commentId: comment.id
    });
  } catch (err) {
    next(err);
  }
};

const putEditedComment = async (req, res, next) => {
  try {
    var comment = await Comment.findOne({
      where: { id: req.params.commentId },
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["first_name", "last_name", "email", "name", "anonymity"]
        },
        {
          model: Tag,
          attributes: ["name", "id"],
          required: false
        },
        {
          model: Issue,
          required: false
        }
      ]
    });
    if (comment.owner.email !== req.user.email) res.sendStatus(401);
    else {
      var { addedTags, removedTags } = getAddedAndRemovedTags({
        prevTags: comment.tags,
        curTags: req.body.selectedTags
      });
      var removedTagPromises, addedTagPromises, issuePromise;
      await comment.update({ comment: req.body.newComment });
      removedTagPromises = Promise.map(removedTags, tag =>
        comment.removeTag(tag.id)
      );
      addedTagPromises = Promise.map(addedTags, async addedTag => {
        const [tag, created] = await Tag.findOrCreate({
          where: { name: addedTag.value, display_name: addedTag.label },
          default: { name: addedTag.value, display_name: addedTag.label }
        });
        return comment.addTag(tag.id);
      });
      issuePromise =
        "issueOpen" in req.body &&
        (req.body.issueOpen || (!req.body.issueOpen && comment.issue))
          ? Issue.findOrCreate({
              defaults: {
                open: req.body.issueOpen
              },
              where: { comment_id: comment.id }
            }).spread((issue, created) => {
              if (!created) issue.update({ open: req.body.issueOpen });
            })
          : null;
      await Promise.all([removedTagPromises, addedTagPromises, issuePromise]);
      const ancestors = await comment.getAncestors({
        raw: true
      });
      const rootAncestor = _.orderBy(ancestors, ["hierarchyLevel"], ["asc"])[0];
      const ancestry = await Comment.scope({
        method: [
          "flatThreadByRootId",
          { where: { id: rootAncestor ? rootAncestor.id : comment.id } }
        ]
      }).findOne();
      res.send(ancestry);
    }
  } catch (err) {
    next(err);
  }
};

const deleteTag = async (req, res, next) => {
  try {
    const comment = await Comment.findById(Number(req.params.commentId));
    await comment.removeTag(req.params.tagId);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

const putTags = async (req, res, next) => {
  try {
    const comment = await Comment.findById(Number(req.params.commentId));
    const [tag, created] = await Tag.findOrCreate({
      where: { name: req.body.tagName },
      default: { name: req.body.tagName }
    });
    await comment.addTag(tag.id);
    res.send(tag);
  } catch (err) {
    next(err);
  }
};

const putCommentStatus = async (req, res, next) => {
  try {
    var comment = await Comment.scope("withDocuments").findOne({
      where: { id: req.params.commentId }
    });
    const canVerify = permission(
      "Verify",
      {
        comment,
        project: comment.document.project
      },
      req.user
    );
    if (!canVerify) {
      res.sendStatus(403);
    } else {
      comment.update({ reviewed: req.body.reviewed });
      res.sendStatus(200);
    }
  } catch (err) {
    next(err);
  }
};

const putCommentIssueStatus = async (req, res, next) => {
  try {
    var comment = await Comment.scope({
      method: ["withDocuments", { model: Issue }]
    }).findOne({
      where: { id: req.params.commentId }
    });
    const canIssue = permission(
      "Issue",
      {
        comment,
        project: comment.document.project
      },
      req.user
    );
    if (!canIssue) {
      res.sendStatus(403);
      return;
    }
    comment.issue
      ? await Issue.update(
          {
            open: req.body.open
          },
          {
            where: { id: comment.issue.id }
          }
        )
      : Issue.create({
          open: req.body.open,
          comment_id: req.params.commentId
        });
    if (!req.body.open && req.user.id !== comment.owner_id) {
      await Notification.notify({
        sender: "",
        comment,
        messageFragment: `${req.user.name} closed your issue in ${
          comment.document.project.symbol
        }/${comment.document.title}.`
      });
    }
    if (req.body.open && req.user.id !== comment.owner_id) {
      await Notification.notify({
        sender: "",
        comment,
        messageFragment: `${req.user.name} opened an issue on your comment in ${
          comment.document.project.symbol
        }/${comment.document.title}.`
      });
    }

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getComments,
  postComment,
  postReply,
  postUpvote,
  putEditedComment,
  deleteTag,
  putTags,
  putCommentStatus,
  putCommentIssueStatus
};
