const express = require("express");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

const router = express.Router();

router.get("/", getClothingItems);
router.post("/", createClothingItem);
router.delete("/:clothingItemId", deleteClothingItem);
router.put("/:clothingItemId/likes", likeItem);
router.delete("/:clothingItemId/likes", unlikeItem);

module.exports = router;
