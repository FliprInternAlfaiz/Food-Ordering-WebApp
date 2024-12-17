import React from "react";

const Success = () => {
    return (
        <div className="text-center py-52">
            <h2 className="text-3xl font-bold text-green-600">
                Payment Successful!
            </h2>
            <p className="text-lg mt-4">
                Thank you for your order. Your transaction has been completed successfully.
            </p>
            <button
                onClick={() => (window.location.href = "/")}
                className="btn mt-8 px-6 py-3 bg-green-500 text-white rounded-full"
            >
                Back to Home
            </button>
        </div>
    );
};

export default Success;
