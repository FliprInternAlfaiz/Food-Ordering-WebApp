import React from 'react';
import { FaUtensils } from 'react-icons/fa';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';

const AddMenu = () => {
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('recipe', data.recipe);
        formData.append('image', data.image[0]); 
        formData.append('category', data.category);
        formData.append('price', data.price);
    
        fetch("http://localhost:3000/menu", {
            method: "POST",
            body: formData, 
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.message === "Menu Item Already Exists") {
                Swal.fire({
                    position: "top-center",
                    icon: "error",
                    title: 'Error',
                    text: data.message,
                });
            } else {
                Swal.fire({
                    position: "top-center",
                    icon: "success",
                    title: 'Success',
                    text: 'Your new menu item has been added successfully!',
                });
                reset(); // Reset the form after successful submission
            }
        })
        .catch((error) => {
            console.error('Error adding menu item:', error);
            Swal.fire({
                position: "top-center",
                icon: "error",
                title: 'Error',
                text: 'There was an error adding the menu item. Please try again.',
            });
        });
    };
    

    return (
        <div className='w-full md:w-[870px] px-4 mx-auto'>
            <h2 className='text-2xl font-semibold my-8'>Upload a New <span className='text-green'>Menu Item</span></h2>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Recipe Name*</span>
                        </label>
                        <input
                            type="text"
                            {...register("name", { required: true })}
                            placeholder="Recipe Name"
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div className='flex items-center gap-4'>
                        <div className="form-control w-full my-6">
                            <label className="label">
                                <span className="label-text">Category*</span>
                            </label>
                            <select
                                {...register("category", { required: true })}
                                className="select select-bordered"
                                defaultValue="default">
                                <option disabled value="default">Select a category</option>
                                <option value="salad">Salad</option>
                                <option value="pizza">Pizza</option>
                                <option value="soup">Soup</option>
                                <option value="dessert">Dessert</option>
                                <option value="drinks">Drinks</option>
                            </select>
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Price</span>
                            </label>
                            <input
                                {...register("price", { required: true })}
                                type="number"
                                placeholder="Price"
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Recipe Details</span>
                        </label>
                        <textarea
                            {...register("recipe", { required: true })}
                            className="textarea textarea-bordered h-24"
                            placeholder="Tell us about the recipe"></textarea>
                    </div>

                    <div>
                        <div className="form-control w-full my-6">
                            <label className="label">
                                <span className="label-text">Pick a file</span>
                            </label>
                            <input
                                {...register("image", { required: true })}
                                type="file"
                                className="file-input w-full max-w-xs"
                            />
                        </div>
                    </div>

                    <button className='btn bg-green text-white px-6'>
                        Add Item <FaUtensils />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddMenu;
