const mongoose = require('mongoose');
const { Schema } = mongoose;

// Create Schema for Menu object
const MenuSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3
    },
    recipe: String,
    image: String,
    category: String,
    price: Number
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create Model Object
const Menu = mongoose.model("Menu", MenuSchema);

module.exports = Menu;
