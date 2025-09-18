const express = require("express");
const auth = require("../middleware/auth");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

const router = express.Router();

router.get("/", getClothingItems);
router.post("/", auth, createClothingItem);
router.delete("/:clothingItemId", auth, deleteClothingItem);
router.put("/:clothingItemId/likes", auth, likeItem);
router.delete("/:clothingItemId/likes", auth, unlikeItem);

module.exports = router;
