import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const Payment = () => {
    const location = useLocation();
    const { session, cartItems } = location.state || {}; // Destructure the state data

    // Fallback for empty or undefined data
    if (!session || !cartItems) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-red-600">
                    Invalid order details. Please return to the cart and try again.
                </h2>
            </div>
        );
    }

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("card");

    const totalItems = cartItems.length;
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handlePayment = async () => {
        if (!name || !address || !pinCode) {
            alert("Please provide all required details.");
            return;
        }
    
        if (paymentMethod === "card") {
            const stripe = await loadStripe("pk_test_51Pvd89KOqw3XIfkatXAOw5gBHM6V1G1myf2OUUFQuKY86QJMIm9z7eEWHfGGhugbHf7RPaFk4QWvGXH8gi8IUHDA00nCROoGVk");
    
            const body = {
                name,
                address,
                pinCode,
                products: cartItems, // Ensure the key matches server expectation
                totalPrice,
                sessionId: session.id,
            };
    
            try {
                const response = await fetch("http://localhost:3000/create-checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to create checkout session");
                }
    
                const newSession = await response.json();
                if (newSession.id && stripe) {
                    stripe.redirectToCheckout({ sessionId: newSession.id });
                } else {
                    throw new Error("Failed to retrieve session ID");
                }
            } catch (error) {
                console.error("Error creating checkout session", error);
                alert(error.message);
            }
        } else if (paymentMethod === "cod") {
            alert("Order placed successfully. Thank you for choosing Cash on Delivery!");
        }
    };
    

    return (
        <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-16">
            <div className="text-center py-10">
                <h2 className="text-3xl md:text-5xl font-bold">
                    Complete Your <span className="text-green">Order</span>
                </h2>
            </div>

            {/* Delivery Details */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold mb-4">Delivery Details</h3>
                <div className="form-control w-full mb-4">
                    <label className="label"><span className="label-text">Your Name*</span></label>
                    <input
                        type="text"
                        placeholder="Enter Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input input-bordered w-full"
                    />
                </div>
                <div className="form-control w-full mb-4">
                    <label className="label"><span className="label-text">Delivery Address*</span></label>
                    <input
                        type="text"
                        placeholder="Enter Your Delivery Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="input input-bordered w-full"
                    />
                </div>
                <div className="form-control w-full mb-4">
                    <label className="label"><span className="label-text">Area Pincode*</span></label>
                    <input
                        type="text"
                        placeholder="Enter Your Area Pincode"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        className="input input-bordered w-full"
                    />
                </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
                <div className="space-y-4">
                    <label className="label cursor-pointer flex items-center">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={paymentMethod === "card"}
                            onChange={() => setPaymentMethod("card")}
                            className="radio radio-primary mr-2"
                        />
                        Credit/Debit Card
                    </label>
                    <label className="label cursor-pointer flex items-center">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            onChange={() => setPaymentMethod("cod")}
                            className="radio radio-success mr-2"
                        />
                        Cash on Delivery
                    </label>
                </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                <p>Total Items: <span className="font-medium">{totalItems}</span></p>
                <p>Total Price: <span className="font-medium">${totalPrice.toFixed(2)}</span></p>
            </div>

            {/* Submit */}
            <div className="text-center">
                <button
                    onClick={handlePayment}
                    className="btn bg-green text-white font-semibold px-8 py-3 rounded-full"
                >
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default Payment;
