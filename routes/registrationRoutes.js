const express = require("express");

const {
  registerUser,
  cancelRegistration
} = require(
  "../controllers/registrationController"
);

const router =
  express.Router();

router.post("/", registerUser);

router.delete(
  "/:id",
  cancelRegistration
);

module.exports = router;