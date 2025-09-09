const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors");

const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!email || !password || !name || !avatar) {
      next(new BadRequestError("An error has occurred on the server."));
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      next(new ConflictError("Email already exists"));
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      next(new BadRequestError("User creation failed: invalid data"));
    } else if (err.code === 11000) {
      next(new ConflictError("Email already exists"));
    } else {
      next(err);
    }
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      next(new BadRequestError("An error has occurred on the server."));
      return;
    }

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    console.log(err.name);

    if (err.message === "Incorrect email or password") {
      next(new UnauthorizedError("Incorrect email or password"));
    } else {
      next(err);
    }
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail(() => {
      throw new NotFoundError("User not found");
    });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    console.log(err.name);
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      {
        new: true,
        runValidators: true,
      }
    ).orFail(() => {
      throw new NotFoundError("User not found");
    });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    console.log(err.name);

    if (err.name === "ValidationError") {
      next(new BadRequestError("An error has occurred on the server."));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateProfile,
};
