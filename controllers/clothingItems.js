const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");

const getClothingItems = async (req, res, next) => {
  try {
    // If user is not authenticated, return empty array
    if (!req.user || !req.user._id) {
      return res.status(200).json([]);
    }

    const clothingItems = await ClothingItem.find({ owner: req.user._id });
    return res.status(200).json(clothingItems);
  } catch (err) {
    return next(err);
  }
};

const createClothingItem = async (req, res, next) => {
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
      next(new BadRequestError(message));
    } else {
      next(err);
    }
  }
};

const deleteClothingItem = async (req, res, next) => {
  try {
    const clothingItem = await ClothingItem.findById(
      req.params.clothingItemId
    ).orFail(() => {
      throw new NotFoundError("Clothing item not found");
    });

    if (clothingItem.owner.toString() !== req.user._id) {
      next(new ForbiddenError("You are not authorized to delete this item"));
      return;
    }

    await ClothingItem.findByIdAndDelete(req.params.clothingItemId);
    res.status(200).json({ message: "Clothing item deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      next(new BadRequestError("Invalid clothing item ID"));
    } else {
      next(err);
    }
  }
};

const likeItem = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    const updatedItem = await ClothingItem.findByIdAndUpdate(
      req.params.clothingItemId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).orFail(() => {
      throw new NotFoundError("Clothing item not found");
    });
    res.status(200).json(updatedItem);
  } catch (err) {
    if (err.name === "CastError") {
      next(new BadRequestError("Invalid clothing item ID"));
    } else {
      next(err);
    }
  }
};

const unlikeItem = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    const updatedItem = await ClothingItem.findByIdAndUpdate(
      req.params.clothingItemId,
      { $pull: { likes: userId } },
      { new: true }
    ).orFail(() => {
      throw new NotFoundError("Clothing item not found");
    });
    res.status(200).json(updatedItem);
  } catch (err) {
    if (err.name === "CastError") {
      next(new BadRequestError("Invalid clothing item ID"));
    } else {
      next(err);
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
