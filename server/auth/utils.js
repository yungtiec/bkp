const generateUserHandle = name => {
  return name.replace(/[\s.;,?%0-9]/, "").toLowerCase();
};

module.exports = {
  generateUserHandle
};
