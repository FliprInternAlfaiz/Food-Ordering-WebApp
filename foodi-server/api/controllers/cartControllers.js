const Carts = require("../models/Carts");
const { body, validationResult } = require('express-validator');

const getCartByEmail = async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const result = await Carts.find({ email }).exec();
        
        if (result.length === 0) {
            return res.status(404).json({ message: "No cart found for the given email" });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching cart by email:', error);
        if (!res.headersSent) {
            return res.status(500).json({ message: error.message });
        }
    }
};

const addToCart = async (req, res) => {
    // Validation
    await body('menuItemId').isString().notEmpty().run(req);
    await body('name').isString().notEmpty().run(req);
    await body('recipe').isString().optional().run(req);
    await body('image').isString().optional().run(req);
    await body('price').isFloat({ gt: 0 }).run(req);
    await body('quantity').isInt({ gt: 0 }).run(req);
    await body('email').isEmail().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { menuItemId, name, recipe, image, price, quantity, email } = req.body;

    try {
        const existingCartItem = await Carts.findOne({ menuItemId, email });
        if (existingCartItem) {
            return res.status(400).json({ message: "Product Already Exists in Cart" });
        }

        const cartItem = await Carts.create({ menuItemId, name, recipe, image, price, quantity, email });
        return res.status(201).json(cartItem);
    } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).json({ message: error.message });
    }
};

const deleteCart = async (req, res) => {
    const cartId = req.params.id;
    try {
        const deletedCart = await Carts.findByIdAndDelete(cartId);
        if (!deletedCart) {
            return res.status(404).json({ message: "Cart Item Not Found" });
        }
        return res.status(200).json({ message: "Cart Item Deleted Successfully" });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        return res.status(500).json({ message: error.message });
    }
};

const updateCart = async (req, res) => {
    const cartId = req.params.id;
    const { menuItemId, name, recipe, image, price, quantity, email } = req.body;

    try {
        const updatedCart = await Carts.findByIdAndUpdate(cartId, { menuItemId, name, recipe, image, price, quantity, email }, { new: true, runValidators: true });
        if (!updatedCart) {
            return res.status(404).json({ message: "Cart Item Not Found" });
        }
        return res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error updating cart item:', error);
        return res.status(500).json({ message: error.message });
    }
};

const getSingleCart = async (req, res) => {
    const cartId = req.params.id;
    try {
        const cartItem = await Carts.findById(cartId);
        if (!cartItem) {
            return res.status(404).json({ message: "Cart Item Not Found" });
        }
        return res.status(200).json(cartItem);
    } catch (error) {
        console.error('Error fetching single cart item:', error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCartByEmail,
    addToCart,
    deleteCart,
    updateCart,
    getSingleCart
};
