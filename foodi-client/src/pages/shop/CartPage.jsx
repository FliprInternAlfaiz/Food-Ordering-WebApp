import React, { useContext, useState, useEffect } from 'react';
import useCart from '../../hooks/useCart';
import { FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { AuthContext } from '../../contexts/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';



const CartPage = () => {
    const [cart, refetch] = useCart();
    console.log(cart);
    
    const { user } = useContext(AuthContext);
    console.log(user);
    
    const [cartItems, setCartItems] = useState(cart);

    useEffect(() => {
        setCartItems(cart);
    }, [cart]);

    const navigate = useNavigate();
    const handleDelete = (item) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:3000/carts/${item._id}`, {
                    method: "DELETE"
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data) {
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your item has been deleted.",
                                icon: "success"
                            });
                        }
                    });
            }
        });
    }

    const handleDecrease = (item) => {
        if (item.quantity <= 1) return; 

        fetch(`http://localhost:3000/carts/${item._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: item.quantity - 1 }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.updated) {
                    const updatedCart = cartItems.map((cartItem) =>
                        cartItem._id === item._id
                            ? { ...cartItem, quantity: item.quantity - 1 }
                            : cartItem
                    );
                    setCartItems(updatedCart);
         
                }
                refetch();
            });
    }


    const handleCheckout = async () => {
    
        const body = {
            products: cartItems,
        };
    
        const header = {
            "Content-Type": "application/json",
        };
    
        try {
            const response = await fetch("http://localhost:3000/create-checkout", {
                method: "POST",
                headers: header,
                body: JSON.stringify(body),
            });
    
            if (!response.ok) {
                // Capture the specific error message
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create checkout session");
            }
    
            const session = await response.json();
            console.log(session);
            if (session.id) {
                // Redirect to the payment page with session data
                navigate('/process-checkout', { state: { session,cartItems } });
            } else {
                throw new Error("Failed to retrieve session ID");
            }
    
        } catch (error) {
            console.error("Error creating checkout session", error);
            Swal.fire({
                title: "Error!",
                text: error.message,
                icon: "error",
            });
        }
    };
    

    const handleIncrease = (item) => {
        fetch(`http://localhost:3000/carts/${item._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: item.quantity + 1 }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.updated) {
                    const updatedCart = cartItems.map((cartItem) =>
                        cartItem._id === item._id
                            ? { ...cartItem, quantity: item.quantity + 1 }
                            : cartItem
                    );
                    setCartItems(updatedCart);
                 
                }

                refetch();
            });
    }

    const calculatePrice = (item)=>{
        return item.price*item.quantity
    }

    const getImageSrc = (imagePath) => {
        // Check if the URL starts with 'http' or 'https'
        if (imagePath.startsWith('/images')) {
          return imagePath; // Remote image URL
        }
        // Assume it's a local image path
        return `http://localhost:3000/${imagePath}`; // Adjust base URL if necessary
      };

    return (
        <div className='section-container '>
            <div className="max-w-screen-2xl container mx-auto xl:px-24 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
                <div className="py-36 flex flex-col items-center justify-center gap-8">
                    <div className=" px-4 space-y-7">
                        <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
                            Added Item to The <span className="text-green">Food</span>
                        </h2>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead className='bg-green text-white rounded-sm'>
                        <tr>
                            <th># </th>
                            <th>FOOD</th>
                            <th>ITEM NAME</th>
                            <th>QUANTITY</th>
                            <th>PRICE</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <img
                                                   src={getImageSrc(item.image)}
                                                    alt="Avatar Tailwind CSS Component" />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="font-medium">
                                    {item.name}
                                </td>
                                <td>
                                    <button className='btn btn-xs' onClick={() => handleDecrease(item)}>-</button>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        className='w-10 mx-2 text-center overflow-hidden appearance-none'
                                        readOnly
                                    />
                                    <button className='btn btn-xs' onClick={() => handleIncrease(item)}>+</button>
                                </td>
                                <td>$ {calculatePrice(item).toFixed(2)}</td>
                                <td>
                                    <button className="btn btn-ghost text-red btn-xs" onClick={() => handleDelete(item)}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='my-12 flex flex-col md:flex-row justify-between items-start'>
                    <div className='md:w-1/2 space-y-3'>
                        <h3 className='font-medium'>Customer Details</h3>
                        <p>Name : {user.displayName}</p>
                        <p>Email : {user.email}</p>
                        <p>User ID : {user.uid}</p>
                    </div>
                    <div className='md:w-1/2 space-y-3'>
                        <h3 className='font-medium'>Shopping Details</h3>
                        <p>Total Items : {cartItems.length}</p>
                        <p>Total Price : ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
                        <button onClick={handleCheckout} className='btn bg-green text-white my-4'>
                            Proceed to Checkout
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartPage;
