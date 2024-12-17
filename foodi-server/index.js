const express = require("express");
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
require('dotenv').config()

//jwt
const jwt = require('jsonwebtoken');

//middleware
app.use(cors({
    origin: 'http://localhost:5173' 
  }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

//mongodb configuration connection using mongoose 

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@demo-foodi-client.kv6mc.mongodb.net/demo-foodi-client?retryWrites=true&w=majority&appName=demo-foodi-client`).then(console.log("MONGODB CONNNECTED SUCESSFULLy")
).catch((error) => console.log(error))

//jwt authentication
app.post("/jwt",async(req,res)=>{
    const user = req.body;
    //genrate  token 
    const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECREET,{
        expiresIn:"1hr"
    })

    res.send({token})
})

//stripe
const stripe = require("stripe")("sk_test_51Pvd89KOqw3XIfkaCqCoAJptC3sNnWFGEzyWBPnCz7y53YGPgjBzwsZXq5tSxRlLgNRwA0mYZKXwBYHMKMzj9VZW00XIKfYW2k")

app.post("/create-checkout", async (req, res) => {
    try {
        const { products } = req.body;
        if (!products || products.length === 0) {
            return res.status(400).send({ error: "No products provided" });
        }
        console.log("Products received for checkout: ", products);

        const lineItems = products.map((product) => ({
            price_data: {
                currency: "inr",
                product_data: { name: product.name },
                unit_amount: product.price * 100,
            },
            quantity: product.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: 'http://localhost:5173/success',
            cancel_url: 'http://localhost:5173/cancel',
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Error during Stripe session creation: ", error);
        res.status(500).send({ error: "Internal server error" });
    }
});




// import routes here 

const menuRoutes = require("./api/routes/menuRoutes")
const cartRoutes = require("./api/routes/cartRoutes")
const userRoutes = require("./api/routes/userRoutes")

app.use("/menu",menuRoutes)
app.use("/carts",cartRoutes)
app.use("/users",userRoutes)

app.get('/',(req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})