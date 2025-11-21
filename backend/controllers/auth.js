const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user-model");
const ErrorHandler = require("../middleware/errorHandlers");
const { catchAsyncError } = require("../middleware/catchAsyncError");
const logger = require("../utils/logger");
const { getFullContext } = require("../utils/requestContext");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports.signUpWithGoogle = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  logger.info("Google Sign-In attempt", getFullContext(req, { hasToken: !!token }));

  try {
    let payload;
    if (token && token.split('.').length === 3) {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
      logger.info("Google ID token verified successfully");
    } else {
      const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`);

      if (!response.ok) {
        logger.error("Failed to fetch Google user info", { status: response.status, statusText: response.statusText });
        throw new Error(`Failed to fetch user info: ${response.statusText}`);
      }

      payload = await response.json();
      payload.sub = payload.id;
      logger.info("Google access token verified successfully");
    }

    const userId = payload.sub;
    const email = payload.email;
    const picture = payload.picture;
    const name = payload.name || "User";

    let user = await User.findOne({ googleId: userId });

    const isSubscribed = user ? user.isSubscribed : false;
    const isAdmin = user ? user.isAdmin : false;

    if (!user) {
      user = new User({
        googleId: userId,
        email,
        name,
        isSubscribed,
        isAdmin,
        createdAt: new Date(),
      });
      await user.save();
      logger.info("New user created", { userId, email, name });
    } else {
      logger.info("Existing user logged in", { userId, email });
    }

    const jwtToken = jwt.sign(
      {
        userId,
        name,
        email,
        picture,
        isSubscribed,
        isAdmin
      },
      process.env.SECRETKEY,
      { expiresIn: "7d" }
    );

    logger.info("JWT token generated for user", { userId, email });

    res.status(200).json({
      user: { userId, email, picture, name, isSubscribed, isAdmin },
      token: jwtToken,
    });
  } catch (error) {
    logger.error("Google authentication failed", { error: error.message, stack: error.stack });

    if (error.message.includes('Wrong number of segments')) {
      res.status(400).json({
        error: "Invalid token format. Expected ID token or valid access token."
      });
    } else if (error.message.includes('Failed to fetch user info')) {
      res.status(401).json({
        error: "Invalid or expired access token."
      });
    } else {
      res.status(401).json({
        error: "Token verification failed.",
        details: error.message
      });
    }
  }
};

module.exports.whoami = catchAsyncError(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    logger.warn("Whoami request without token");
    return next(new ErrorHandler("Token not found", 400));
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    logger.info("User identity verified", { userId: decoded.userId, email: decoded.email });

    res.status(200).json({
      message: "User verified",
      user: decoded,
    });
  } catch (error) {
    logger.error("Token verification failed in whoami", { error: error.message });
    res.status(401).json({
      message: "Token expired or invalid",
    });
  }
});

module.exports.logIn = catchAsyncError(async (req, res, next) => {
  const { username, password } = req.body;
  logger.info("Login attempt", getFullContext(req, { username }));

  if (!username || !password) {
    logger.warn("Login failed: Missing credentials", getFullContext(req, { username }));
    return next(new ErrorHandler("username or password not passed", 400));
  }

  const user = await userModel.findOne({
    username: username,
  });

  if (!user) {
    logger.warn("Login failed: User not found", getFullContext(req, { username }));
    return next(new ErrorHandler("Invalid credentials or user not found", 401));
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    logger.warn("Login failed: Invalid password", getFullContext(req, { username }));
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  const token = jwt.sign(
    {
      username: username,
    },
    process.env.SECRETKEY,
    {
      expiresIn: "14h",
    }
  );

  logger.info("User logged in successfully", getFullContext(req, { username, userId: user._id }));

  res.json({
    code: 200,
    message: "Login successful",
    token: token,
  });
});

module.exports.signUp = async (req, res, next) => {
  const { username, password, name } = req.body;
  logger.info("Sign up attempt", getFullContext(req, { username, name }));

  if (!username || !password || !name) {
    logger.warn("Sign up failed: Missing required fields", getFullContext(req, { username, name }));
    return next(
      new ErrorHandler("username or password not passed or not validated", 400)
    );
  }

  const user = await userModel.findOne({
    username: username,
  });

  if (user) {
    logger.warn("Sign up failed: Username already exists", getFullContext(req, { username }));
    return res
      .status(409)
      .json({ message: "username already exists", code: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const date = new Date();
  const newUser = new userModel({
    username: username,
    password: hashedPassword,
    name: name,
    createdAt: {
      string: date.toLocaleString(),
      timestamp: date.getTime(),
    },
  });

  const result = await newUser.save();

  if (result !== null) {
    logger.info("User created successfully", getFullContext(req, { username, userId: result._id }));
    res.json({
      code: 200,
      message: "User created",
      data: result,
    });
  } else {
    logger.error("Failed to create user", getFullContext(req, { username }));
    return next(new ErrorHandler("Failed to create user", 500));
  }
};

module.exports.logOut = catchAsyncError(async (req, res, next) => {
  try {
    logger.info("User logged out", getFullContext(req, { username: req.username }));
  } catch (error) {
    logger.error("Logout error", getFullContext(req, { error: error.message }));
  }
});

module.exports.changePassword = catchAsyncError(async (req, res, next) => {
  const { username, password } = req.body;
  logger.info("Password change attempt", getFullContext(req, { username }));

  if (!username || !password) {
    logger.warn("Password change failed: Missing credentials", getFullContext(req, { username }));
    return next(new ErrorHandler("username or password not found", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.findOneAndUpdate(
    {
      username: username,
    },
    {
      password: hashedPassword,
    }
  );

  if (!user) {
    logger.error("Password change failed: User not found", getFullContext(req, { username }));
    return next(new ErrorHandler("user password not updated", 400));
  }

  logger.info("Password changed successfully", getFullContext(req, { username }));

  res.json({
    code: 200,
    status: "success",
    user: user,
  });
});
