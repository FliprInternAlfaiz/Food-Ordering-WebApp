const express = require('express');
const { getAllUser, createUser, deleteUser, makeAdmin, getAdmin } = require('../controllers/userContollers');
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

// Apply middlewares in the correct order
router.get("/", verifyToken, verifyAdmin, getAllUser);
router.post("/", createUser);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);
router.get("/admin/:email", verifyToken, getAdmin);
router.patch("/admin/:id", verifyToken, verifyAdmin, makeAdmin);

module.exports = router;
