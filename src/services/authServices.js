const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");
const { User } = require("../bd/Cshema");
const { NotAuthorizeError } = require("../helpers/errors");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email, verifyToken) => {
  const msg = {
    to: email,
    from: "annalakhmaniuk21@gmail.com",
    subject: "Sending with SendGrid is Fun",
    text: `You are verification token`,
    html: `<h1>Please, confirm your email</h1>
    <a href="http://localhost:3000/api/users/verify/${verifyToken}">confirm your email</a>`,
  };
  await sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

const registration = async (email, password) => {
  const avatarURL = gravatar.url(email);
  const verificationToken = jwt.sign({ token: uuidv4() }, process.env.SECRET);
  const user = new User({ email, password, avatarURL, verificationToken });
  await user.save();
  await sendEmail(email, verificationToken);
};

const login = async (email, password) => {
  const user = await User.findOne({ email, verify: true });
  if (!user) {
    throw new NotAuthorizeError(`No user with ${email} found`);
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw new NotAuthorizeError("Wrong password");
  }
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  return { token, user };
};
const userAvatar = async (user, avatar) => {
  return await User.findByIdAndUpdate(
    { _id: user._id },
    { avatarURL: avatar },
    { new: true }
  );
};
const verification = async (token) => {
  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    throw new NotAuthorizeError(`No user with found`);
  }

  const msg = {
    to: user.email,
    from: "annalakhmaniuk21@gmail.com",
    subject: "Thank",
    text: `Thank you for registration`,
    html: `<h1>Thank you for registration</h1>`,
  };
  await sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });

  return await User.findByIdAndUpdate(
    { _id: user._id },
    { verificationToken: null, verify: true },
    { new: true }
  );
};
const verifyService = async (email) => {
  const user = await User.findOne({ email: email, verify: false });
  console.log(user);
  if (!user) {
    throw new NotAuthorizeError(`No user with found`);
  }

  await sendEmail(email, user.verificationToken);

  return user;
};

module.exports = {
  registration,
  login,
  userAvatar,
  verification,
  verifyService,
};
