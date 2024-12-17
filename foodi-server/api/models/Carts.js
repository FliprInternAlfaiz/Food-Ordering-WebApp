const mongoose = require('mongoose')
const { Schema } = mongoose;

//create Schema for Cart object 

const CartSchema = new Schema({
    menuItemId: {
        type: String,
    },
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3
    },
    recipe: String,
    image: String,
    price: Number,
    quantity:Number,
    email:{
        type: String,
        trim: true,
        required: true,
    }
})

//create Modal Object 

const Carts = mongoose.model("Cart",CartSchema)

module.exports = Carts;