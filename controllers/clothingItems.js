const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const getClothingItems = async (req, res) => {
  try {
    const clothingItems = await ClothingItem.find({});
    res.status(200).json(clothingItems);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const createClothingItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner =
      req.user && req.user._id ? req.user._id : "000000000000000000000000";
    const clothingItem = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner,
    });
    res.status(201).json(clothingItem);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Invalid clothing item data", error: err.message });
  }
};

const deleteClothingItem = async (req, res) => {
  try {
    await ClothingItem.findByIdAndDelete(req.params.clothingItemId).orFail(
      () => {
        const error = new Error("Clothing item not found");
        error.statusCode = 404;
        throw error;
      }
    );
    res.status(200).json({ message: "Clothing item deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      res
        .status(400)
        .json({ message: "Invalid clothing item ID", error: err.message });
    } else if (err.statusCode === 404) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
};

const likeItem = async (req, res) => {
  try {
    const userId =
      req.user && req.user._id ? req.user._id : "000000000000000000000000";
    const updatedItem = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });
    res.status(200).json(updatedItem);
  } catch (err) {
    if (err.name === "CastError") {
      res
        .status(BAD_REQUEST)
        .json({ message: "Invalid clothing item ID", error: err.message });
    } else if (err.statusCode === NOT_FOUND) {
      res.status(NOT_FOUND).json({ message: err.message });
    } else {
      res
        .status(SERVER_ERROR)
        .json({ message: "Server error", error: err.message });
    }
  }
};

const unlikeItem = async (req, res) => {
  try {
    const userId =
      req.user && req.user._id ? req.user._id : "000000000000000000000000";
    const updatedItem = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: userId } },
      { new: true }
    ).orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });
    res.status(200).json(updatedItem);
  } catch (err) {
    if (err.name === "CastError") {
      res
        .status(BAD_REQUEST)
        .json({ message: "Invalid clothing item ID", error: err.message });
    } else if (err.statusCode === NOT_FOUND) {
      res.status(NOT_FOUND).json({ message: err.message });
    } else {
      res
        .status(SERVER_ERROR)
        .json({ message: "Server error", error: err.message });
    }
  }
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  unlikeItem,
};
