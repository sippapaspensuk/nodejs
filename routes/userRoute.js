const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post("/register", userController.register);
router.get("/getdata/:id", userController.getById);
router.put("/:id", userController.update);
router.get("/search", userController.search);
router.post("/login", userController.login);

module.exports = router;
