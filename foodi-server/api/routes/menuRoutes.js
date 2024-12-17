const express = require('express');
const { getAllMenuItems, addMenuItem, deleteMenuItem, singleMenuItem, updateMenuItem } = require('../controllers/menuControllers');
const upload = require('../middleware/multerConfig'); // Adjust the path as needed
const router = express.Router();

// Get all menu items
router.get("/", getAllMenuItems);

// Add a new menu item
router.post("/", upload.single('image'), addMenuItem);

//delete menu
router.delete("/:id", deleteMenuItem);

//router get single menu 
router.get("/:id", singleMenuItem);

//update menu item 
router.patch('/:id',upload.single('image'), updateMenuItem);


module.exports = router;
