const { find, isEmpty } = require("lodash");

module.exports = {
  Comment: (action, model, user) => {
    if ((!user || isEmpty(user)) && action !== "Read") return false;
    const userRole =
      !user || !user.roles || !user.roles.length
        ? "contributer"
        : user.roles[0].name;

    const isAdmin = userRole === "admin";
    const isProjectAdmin =
      model.project && userRole === "project_admin" &&
      !!find(model.project.admins, a => a.id === user.id);
    const isProjectEditor =
      model.project && userRole === "project_editor" &&
      !!find(model.project.editors, a => a.id === user.id);
    const isCommentOwner = user.id === model.comment.owner_id;
    const needVerification = model.comment.reviewed === "pending";

    switch (action) {
      case "Read":
        return (
          model.comment.reviewed !== "spam" ||
          (isAdmin || isProjectAdmin || isProjectEditor)
        );
      case "Reviewed":
        return (
          !(isAdmin || isProjectAdmin || isProjectEditor) || !needVerification
        );
      case "Verify":
        return isAdmin || isProjectAdmin || isProjectEditor;
      case "Issue":
        return isAdmin || isProjectAdmin || isProjectEditor || isCommentOwner;
      case "Edit":
        return isCommentOwner;
      case "isProjectAdmin":
        return isProjectAdmin;
      case "isNotProjectAdmin":
        return !isProjectAdmin;
    }
  },
  Disclosure: (action, model, user) => {
    if (!user || isEmpty(user)) return false;
    const userRole =
      !user || !user.roles || !user.roles.length
        ? "contributer"
        : user.roles[0].name;
    const isAdmin = userRole === "admin";
    const isProjectAdmin = model.project
      ? userRole === "project_admin" &&
        !!find(model.project.admins, a => a.id === user.id)
      : userRole === "project_admin";
    const isProjectEditor = model.project
      ? userRole === "project_editor" &&
        !!find(model.project.editors, a => a.id === user.id)
      : userRole === "editor";
    const isDisclosureOwner = model.disclosure
      ? model.disclosure.creator.id === user.id
      : null;
    const isDisclosureCollaborator = model.disclosure
      ? find(model.disclosure.collaborators, a => a.id === user.id)
      : null;

    switch (action) {
      case "Create":
        return isAdmin || isProjectAdmin || isProjectEditor || user;
      case "Version":
        return (
          isAdmin ||
          isProjectAdmin ||
          (isProjectEditor && (isDisclosureOwner || isDisclosureCollaborator))
        );
    }
  },
  Project: (action, model, user) => {
    if (!user || isEmpty(user) || !user.roles.length) return false;
    const userRole =
      !user || !user.roles || !user.roles.length
        ? "contributer"
        : user.roles[0].name;
    const isAdmin = userRole === "admin";
    const isProjectAdmin = model.project
      ? userRole === "project_admin" &&
        !!find(model.project.admins, a => a.id === user.id)
      : userRole === "project_admin";

    switch (action) {
      case "ManageEditors":
        return isAdmin || isProjectAdmin;
      case "ReadManagedProjects":
        return isAdmin || isProjectAdmin;
    }
  }
};
