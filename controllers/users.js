const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  UNAUTHORIZED,
  SERVER_ERROR,
} = require("../utils/errors");

const createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!email || !password || !name || !avatar) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "An error has occurred on the server." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(CONFLICT).json({ message: "Email already exists" });
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

    return res.status(201).json(userResponse);
  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .json({ message: "User creation failed: invalid data" });
    }

    if (err.code === 11000) {
      return res.status(CONFLICT).json({ message: "Email already exists" });
    }

    return res
      .status(SERVER_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "An error has occurred on the server." });
    }

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    console.log(err.name);

    if (err.message === "Incorrect email or password") {
      return res
        .status(UNAUTHORIZED)
        .json({ message: "Incorrect email or password" });
    }

    return res
      .status(UNAUTHORIZED)
      .json({ message: "An error has occurred on the server." });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    console.log(err.name);
    if (err.statusCode === NOT_FOUND) {
      return res
        .status(NOT_FOUND)
        .json({ message: "An error has occurred on the server." });
    }
    return res
      .status(SERVER_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
};

const updateProfile = async (req, res) => {
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
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    console.log(err.name);

    if (err.statusCode === NOT_FOUND) {
      return res
        .status(NOT_FOUND)
        .json({ message: "An error has occurred on the server." });
    }

    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .json({ message: "An error has occurred on the server." });
    }

    return res
      .status(SERVER_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateProfile,
};
