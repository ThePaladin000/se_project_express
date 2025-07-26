const express = require("express");
const { NOT_FOUND } = require("../utils/errors");

const usersRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

const router = express.Router();

// Mount all route modules
router.use("/users", usersRouter);
router.use("/items", clothingItemsRouter);

// Centralized middleware for unknown routes
router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

module.exports = router;
