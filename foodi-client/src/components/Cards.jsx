import React, { useContext, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import Swal from 'sweetalert2'

const Cards = ({ item }) => {
  const { name, image, price, receipe, _id } = item;
  console.log('====================================');
  console.log(item);
  console.log('====================================');

  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const location = useLocation();

  const handleHeartClick = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  const handleAddtoCart = (item) => {
    if (user?.email) {
      const cartItem = {
        menuItemId: _id,
        name,
        receipe,
        quantity: 1, 
        image,
        price,
        email: user.email,
      };
  
      fetch("http://localhost:3000/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Product Already Exists in Cart") {
            // Handle product already in cart
            Swal.fire({
              position: "top-center",
              icon: "error",
              title: "Product Already Exists in Cart",
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            // Handle success
            Swal.fire({
              position: "top-center",
              icon: "success",
              title: "Item Added to Cart",
              showConfirmButton: false,
              timer: 1500
            });
          }
        })
        .catch((error) => {
          // Handle any other errors
          Swal.fire({
            position: "top-center",
            icon: "error",
            title: "An error occurred",
            text: error.message,
            showConfirmButton: true,
          });
        });
    } else {
      Swal.fire({
        title: "You are Not Logged In?",
        text: "You need to log in to add items to your cart!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sign Up!"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/signup', { state: { from: location } });
        }
      });
    }
  };

  const getImageSrc = (imagePath) => {
    // Check if the URL starts with 'http' or 'https'
    if (imagePath.startsWith('/images')) {
      return imagePath; // Remote image URL
    }
    // Assume it's a local image path
    return `http://localhost:3000/${imagePath}`; // Adjust base URL if necessary
  };
  

  return (
    <div to={`/menu/${item._id}`} className="card shadow-xl relative mr-5 md:my-5">
      <div
        className={`rating gap-1 absolute right-2 top-2 p-4 heartStar bg-green ${
          isHeartFilled ? "text-rose-500" : "text-white"
        }`}
        onClick={handleHeartClick}
      >
        <FaHeart className="w-5 h-5 cursor-pointer" />
      </div>
      <Link to={`/menu/${item._id}`}>
        <figure>
          <img
       src={getImageSrc(image)}
            alt="Shoes"
            className="hover:scale-105 transition-all duration-300 md:h-72"
          />
        </figure>
      </Link>
      <div className="card-body">
        <Link to={`/menu/${item._id}`}>
          <h2 className="card-title">{item.name}!</h2>
        </Link>
        <p>Description of the item</p>
        <div className="card-actions justify-between items-center mt-2">
          <h5 className="font-semibold">
            <span className="text-sm text-red">$ </span> {item.price}
          </h5>
          <button
            onClick={() => handleAddtoCart(item)}
            className="btn bg-green text-white"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
