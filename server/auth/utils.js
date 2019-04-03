const generateUserHandle = user => {
  return user.name.replace(/[\s.;,?%0-9]/, "").toLowerCase();
};

module.exports = {
  generateUserHandle
};
