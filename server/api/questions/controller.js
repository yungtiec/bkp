const {
  Question,
  Comment,
  Tag,
  Notification,
  User
} = require("../../db/models");
const _ = require("lodash");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {
  getEngagedUsers,
  createSlug,
  getAddedAndRemovedTags,
  sendEmail
} = require("../utils");
const generateCommentHtml = require("../generateCommentHtml");

const getQuestions = async (req, res, next) => {
  try {
    var where, include, includeTag, formattedSearchTerms;
    // parse query
    if (req.query.order) req.query.order = JSON.parse(req.query.order);
    if (!req.query.search) formattedSearchTerms = null;
    else {
      var queryArray = req.query.search.trim().split(" ");
      formattedSearchTerms = queryArray
        .map(function(phrase) {
          return "%" + phrase + "%";
        })
        .join("");
    }
    // construct where clause
    if (formattedSearchTerms)
      where = where
        ? _.assign(where, {
            [Sequelize.Op.or]: [
              { title: { $iLike: formattedSearchTerms } },
              { description: { $iLike: formattedSearchTerms } }
            ]
          })
        : {
            [Sequelize.Op.or]: [
              { title: { $iLike: formattedSearchTerms } },
              { description: { $iLike: formattedSearchTerms } }
            ]
          };
    // construct include clause
    if (req.query.tags && req.query.tags.length) {
      includeTag = {
        model: Tag,
        require: true,
        where: {
          name: {
            [Sequelize.Op.or]: req.query.tags.map(c => ({
              [Sequelize.Op.eq]: c.value.toLowerCase()
            }))
          }
        }
      };
    }
    // construct limit, offset and order options
    var limit = Number(req.query.limit);
    var offset = Number(req.query.offset) || 0;
    var order = req.query.order;
    if (order && order.value === "date") {
      order = [["createdAt", "DESC"]];
    } else if (order && order.value === "most-upvoted") {
      order = [[Sequelize.literal("num_upvotes"), "DESC"]];
    } else if (order && order.value === "most-discussed") {
      order = [[Sequelize.literal("num_comments"), "DESC"]];
    }
    var options = {
      offset,
      order
    };
    if (req.query.limit) options.limit = limit;
    // query
    const questions = await Question.scope({
      method: ["main", { extendedInclude: includeTag, extendedWhere: where }]
    }).findAll(options);
    res.send(questions);
  } catch (err) {
    next(err);
  }
};

const postQuestion = async (req, res, next) => {
  try {
    const slug = await createSlug(
      "",
      req.body.title + req.body.description || ""
    );
    var question = await Question.create(
      _.assignIn({ slug, owner_id: req.body.owner.value }, req.body)
    );
    const selectedTagPromises = await Promise.map(
      req.body.selectedTags,
      async selectedTag => {
        const [tag, created] = await Tag.findOrCreate({
          where: { name: selectedTag.value, display_name: selectedTag.label },
          default: { name: selectedTag.value, display_name: selectedTag.label }
        });
        return question.addTag(tag.id);
      }
    );
    question = await Question.scope([
      {
        method: ["main", {}]
      }
    ]).findOne({ where: { id: question.id } });
    res.send(question);
  } catch (err) {
    next(err);
  }
};

const getQuestionBySlug = async (req, res, next) => {
  try {
    const question = await Question.scope([
      {
        method: ["main", {}]
      }
    ]).findOne({
      where: { slug: req.params.slug }
    });
    res.send(question);
  } catch (err) {
    next(err);
  }
};

const postUpvote = async (req, res, next) => {
  try {
    if (req.body.hasDownvoted)
      await req.user.removeDownvotedQuestions(req.params.questionId);
    if (!req.body.hasUpvoted) {
      await req.user.addUpvotedQuestions(req.params.questionId);
    } else {
      await req.user.removeUpvotedQuestions(req.params.questionId);
    }
    const [upvotesFrom, downvotesFrom] = await Question.findById(
      req.params.questionId
    ).then(ps => Promise.all([ps.getUpvotesFrom(), ps.getDownvotesFrom()]));
    res.send([upvotesFrom, downvotesFrom]);
  } catch (err) {
    next(err);
  }
};

const postDownvote = async (req, res, next) => {
  try {
    if (req.body.hasUpvoted)
      await req.user.removeUpvotedQuestions(req.params.questionId);
    if (!req.body.hasDownvoted) {
      await req.user.addDownvotedQuestions(req.params.questionId);
    } else {
      await req.user.removeDownvotedQuestions(req.params.questionId);
    }
    const [upvotesFrom, downvotesFrom] = await Question.findById(
      req.params.questionId
    ).then(ps => Promise.all([ps.getUpvotesFrom(), ps.getDownvotesFrom()]));
    res.send([upvotesFrom, downvotesFrom]);
  } catch (err) {
    next(err);
  }
};

const postComment = async (req, res, next) => {
  try {
    var comment = await Comment.create({
      owner_id: req.user.id,
      question_id: Number(req.params.questionId),
      comment: req.body.newComment
    });
    comment = await Comment.scope([{ method: ["flatThreadByRootId"] }]).findOne(
      { where: { id: comment.id } }
    );
    res.send(comment);
    const question = await Question.scope([
      {
        method: ["main", {}]
      },
      {
        method: ["withComments", {}]
      }
    ]).findOne({
      where: { id: req.params.questionId }
    });
    const tags = await Promise.map(req.body.tags || [], tag =>
      Tag.findOrCreate({
        where: { name: tag.value },
        default: { name: tag.value.toLowerCase(), display_name: tag.value }
      }).spread((tag, created) => comment.addTag(tag))
    );
    const isRepostedByBKPEmail = question.owner.email.includes("tbp.admin");
    await sendEmail({
      recipientEmail: isRepostedByBKPEmail
        ? "info@thebkp.com"
        : question.owner.email,
      subject: `New Comment Activity From ${comment.owner.first_name} ${
        comment.owner.last_name
      }`,
      message: generateCommentHtml(
        process.env.NODE_ENV === "production",
        "requests-for-comment",
        question.slug,
        comment.owner.first_name,
        comment.owner.last_name,
        comment,
        false
      )
    });
    // Send this to info@thebkp.com
    if (document.creator.id !== 12 && !isRepostedByBKPEmail) {
      await sendEmail({
        recipientEmail: "info@thebkp.com",
        subject: `New Comment Activity From ${comment.owner.first_name} ${
          comment.owner.last_name
        }`,
        message: generateCommentHtml(
          process.env.NODE_ENV === "production",
          "requests-for-comment",
          question.slug,
          comment.owner.first_name,
          comment.owner.last_name,
          comment,
          false
        )
      });
    }
  } catch (err) {
    next(err);
  }
};

const getComments = async (req, res, next) => {
  try {
    var where;
    var question = await Question.findOne({ where: { slug: req.params.slug } });
    // construct limit, offset and order options
    var limit = Number(req.query.limit);
    var offset = Number(req.query.offset);
    var order = JSON.parse(req.query.order);
    if (order && order.value === "date") {
      order = [["createdAt", "DESC"]];
    } else if (order && order.value === "most-upvoted") {
      order = [[Sequelize.literal("num_upvotes"), "DESC"]];
    } else if (order && order.value === "most-discussed") {
      order = [[Sequelize.literal("num_comments"), "DESC"]];
    }
    var options = {
      offset,
      order
    };
    if (req.query.limit) options.limit = limit;
    // query
    options.where = { question_id: question.id, hierarchyLevel: 1 };
    const comments = await Comment.scope({
      method: ["flatThreadByRootId"]
    }).findAll(options);
    res.send(comments);
  } catch (err) {
    next(err);
  }
};

// this is exact copy and paste from document's comment controller
// TODO: refactor
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
        question: ancestry.question
      }),
      parent,
      messageFragment: "replied to your post"
    });
    await sendEmail({
      recipientEmail: ancestry.owner.email,
      subject: `New Reply Activity From ${user.first_name} ${user.last_name}`,
      message: generateCommentHtml(
        process.env.NODE_ENV === "production",
        "requests-for-comment",
        ancestry.question.slug,
        user.first_name,
        user.last_name,
        ancestry.id,
        true
      )
    });
    if (ancestry.owner.id !== 12) {
      await sendEmail({
        recipientEmail: "info@thebkp.com",
        subject: `New Comment Activity From ${comment.owner.first_name} ${
          comment.owner.last_name
        }`,
        message: generateCommentHtml(
          process.env.NODE_ENV === "production",
          "requests-for-comment",
          ancestry.question.slug,
          comment.owner.first_name,
          comment.owner.last_name,
          comment,
          false
        )
      });
    }
    res.send(ancestry);
  } catch (err) {
    next(err);
  }
};

const postCommentUpvote = async (req, res, next) => {
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
      await Promise.all([removedTagPromises, addedTagPromises]);
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

module.exports = {
  getQuestions,
  postQuestion,
  getQuestionBySlug,
  postUpvote,
  postDownvote,
  postComment,
  getComments,
  postReply,
  postCommentUpvote,
  putEditedComment
};
