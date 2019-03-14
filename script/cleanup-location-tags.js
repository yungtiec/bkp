require("../secrets");
Promise = require("bluebird");
const db = require("../server/db/db");
const { Tag } = require("../server/db/models");

const cleanup = async () => {
  try {
    await db.sync();
    await Tag.destroy({
      where: {
        type: "location"
      }
    });

    db.close();
  } catch (error) {
    console.log(error);
    db.close();
  }
};

cleanup();
