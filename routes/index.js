const express = require("express");
const { NOT_FOUND } = require("../utils/errors");

const auth = require("../middleware/auth");
const {
  validateUserBody,
  validateAuthBody,
} = require("../middleware/validation");
const { login, createUser } = require("../controllers/users");
const usersRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

const router = express.Router();

router.post("/signin", validateAuthBody, login);
router.post("/signup", validateUserBody, createUser);

router.use("/users", auth, usersRouter);
router.use("/items", clothingItemsRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

module.exports = router;
