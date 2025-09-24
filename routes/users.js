const express = require("express");
const { validateUserUpdateBody } = require("../middleware/validation");
const { getCurrentUser, updateProfile } = require("../controllers/users");

const router = express.Router();

router.get("/me", getCurrentUser);
router.patch("/me", validateUserUpdateBody, updateProfile);

module.exports = router;
