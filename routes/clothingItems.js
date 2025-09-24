const express = require("express");
const auth = require("../middleware/auth");
const {
  validateClothingItemBody,
  validateClothingItemId,
} = require("../middleware/validation");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

const router = express.Router();

router.get("/", getClothingItems);
router.post("/", auth, validateClothingItemBody, createClothingItem);
router.delete(
  "/:clothingItemId",
  auth,
  validateClothingItemId,
  deleteClothingItem
);
router.put("/:clothingItemId/likes", auth, validateClothingItemId, likeItem);
router.delete(
  "/:clothingItemId/likes",
  auth,
  validateClothingItemId,
  unlikeItem
);

module.exports = router;
