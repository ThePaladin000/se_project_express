const express = require("express");
const { NOT_FOUND } = require("../utils/errors");

const auth = require("../middlewares/auth");
const { login, createUser } = require("../controllers/users");
const { getClothingItems } = require("../controllers/clothingItems");
const usersRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

const router = express.Router();

router.post("/signin", login);
router.post("/signup", createUser);

router.get("/items", getClothingItems);

router.use("/users", auth, usersRouter);
router.use("/items", auth, clothingItemsRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

module.exports = router;
