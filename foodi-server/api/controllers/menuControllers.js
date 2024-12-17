const Menu = require("../models/Menu");
const path = require('path');


const getAllMenuItems = async (req, res) => {
    try {
        const menus = await Menu.find().sort({ createdAt: -1 }); 
        res.status(200).json(menus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const addMenuItem = async (req, res) => {
    try {
        const { name, category, price, recipe } = req.body;
        const image = req.file ? req.file.path : null;

        if (!name || !category || !price || !recipe) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newMenuItem = new Menu({
            name,
            category,
            price,
            recipe,
            image
        });

        const savedMenuItem = await newMenuItem.save();
        res.status(201).json(savedMenuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a menu item by ID
const deleteMenuItem = async (req, res) => {
    const cartId = req.params.id;
    
    try {
        const deleteResult = await Menu.findByIdAndDelete(cartId);
        console.log(deleteResult);
        
        if (!deleteResult) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        res.status(200).json({ message: "Menu item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
    
const singleMenuItem = async (req, res) => {
    const menuId = req.params.id;

    try {
        const menuItem = await Menu.findById(menuId);

        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        res.status(200).json(menuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMenuItem = async (req, res) => {
    const menuId = req.params.id;
    const { name, category, price, recipe } = req.body;
    const image = req.file ? req.file.path : null; 

    try {
        const updateFields = { name, category, price, recipe };
        if (image) updateFields.image = image; 

        const existingMenuItem = await Menu.findByIdAndUpdate(menuId, updateFields, { new: true, runValidators: true });
        if (!existingMenuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        res.status(200).json(existingMenuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllMenuItems,
    addMenuItem,
    deleteMenuItem,
    singleMenuItem,
    updateMenuItem
};
