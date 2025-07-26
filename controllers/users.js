const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    console.log(err.name);
    return res
      .status(SERVER_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    console.log(err.name);
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid user ID" });
    }
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

const createUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.create({ name, avatar });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    console.log(err.name);
    if (err.name === "ValidationError") {
      res
        .status(BAD_REQUEST)
        .json({ message: "User creation failed: invalid data" });
    } else {
      res
        .status(SERVER_ERROR)
        .json({ message: "An error has occurred on the server." });
    }
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
