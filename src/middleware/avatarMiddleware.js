const fs = require("fs").promises;
const Jimp = require("jimp");
const { join } = require("path");

const path = require("path");
const AVATAR = path.resolve("./public/avatars");

const avatarMiddleware = async (req, res, next) => {
  if (!req?.file?.path) {
    return res.status(401).json({ message: `Not authorized` });
  }
  const tmpPath = req.file.path;
  const newPath = join(AVATAR, req.file.filename);
  const file = await Jimp.read(tmpPath);

  await file.resize(250, 250).writeAsync(newPath);

  req.file.destination = AVATAR;
  req.file.path = newPath;
  await fs.unlink(tmpPath);

  next();
};
module.exports = {
  avatarMiddleware,
};
