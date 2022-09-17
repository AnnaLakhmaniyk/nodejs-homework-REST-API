const express = require("express");
const { asyncWrapper } = require("../../helpers/apiHelpers");
const {
  registrationControlls,
  loginControlls,
  logoutControlls,
  currentControlls,
  userAvatarControlls,
  verificationControlls,
  verifyControlls,
} = require("../../controls/controlAuth");

const {
  validateAuth,
  validateVerify,
} = require("../../middleware/validationMiddleware");
const { authMiddleware } = require("../../middleware/authMiddeleware");
const { uploadMiddleware } = require("../../middleware/uploadMiddleware");
const { avatarMiddleware } = require("../../middleware/avatarMiddleware");
const router = new express.Router();
router.get("/verify/:verificationToken", asyncWrapper(verificationControlls));
router.post("/register", validateAuth, asyncWrapper(registrationControlls));
router.post("/login", validateAuth, asyncWrapper(loginControlls));
router.post("/logout", authMiddleware, logoutControlls);
router.post("/current", authMiddleware, asyncWrapper(currentControlls));
router.post("/verify", validateVerify, asyncWrapper(verifyControlls));
router.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  avatarMiddleware,
  asyncWrapper(userAvatarControlls)
);

module.exports = router;
