const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN,
  SERVER_ERROR,
} = require("../utils/errors");

const getClothingItems = async (req, res) => {
  try {
    const clothingItems = await ClothingItem.find({});
    res.status(200).json(clothingItems);
  } catch (err) {
    res.status(500).json({
      message: "An error has occurred on the server",
    });
  }
};

const createClothingItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user && req.user._id;
    const clothingItem = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner,
    });
    res.status(201).json(clothingItem);
  } catch (err) {
    if (err.name === "ValidationError") {
      const missingFields = Object.keys(err.errors).map(
        (key) => err.errors[key].path
      );
      const message =
        missingFields.length > 0
          ? `Missing required fields: ${missingFields.join(", ")}`
          : "Invalid clothing item data";
      res.status(BAD_REQUEST).json({ message });
    } else {
      res.status(SERVER_ERROR).json({
        message: "An error has occurred on the server",
      });
    }
  }
};

const deleteClothingItem = async (req, res) => {
  try {
    const clothingItem = await ClothingItem.findById(
      req.params.clothingItemId
    ).orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = 404;
      throw error;
    });

    if (clothingItem.owner.toString() !== req.user._id) {
      res
        .status(FORBIDDEN)
        .json({ message: "You are not authorized to delete this item" });
      return;
    }

    await ClothingItem.findByIdAndDelete(req.params.clothingItemId);
    res.status(200).json({ message: "Clothing item deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      res.status(BAD_REQUEST).json({ message: "Invalid clothing item ID" });
    } else if (err.statusCode === 404) {
      res.status(NOT_FOUND).json({ message: "Clothing item not found" });
    } else {
      res.status(SERVER_ERROR).json({
        message: "An error has occurred on the server",
      });
    }
  }
};

const likeItem = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const updatedItem = await ClothingItem.findByIdAndUpdate(
      req.params.clothingItemId,
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
      res.status(BAD_REQUEST).json({ message: "Invalid clothing item ID" });
    } else if (err.statusCode === NOT_FOUND) {
      res.status(NOT_FOUND).json({ message: "Clothing item not found" });
    } else {
      res.status(SERVER_ERROR).json({
        message: "An error has occurred on the server",
      });
    }
  }
};

const unlikeItem = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const updatedItem = await ClothingItem.findByIdAndUpdate(
      req.params.clothingItemId,
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
      res.status(BAD_REQUEST).json({ message: "Invalid clothing item ID" });
    } else if (err.statusCode === NOT_FOUND) {
      res.status(NOT_FOUND).json({ message: "Clothing item not found" });
    } else {
      res.status(SERVER_ERROR).json({
        message: "An error has occurred on the server",
      });
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
