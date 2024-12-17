import React from 'react'
import { useForm } from 'react-hook-form';
import { FaUtensils } from 'react-icons/fa';
import { useLoaderData, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const UpdateMenu = () => {
    const item = useLoaderData();
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecure(); // Using the custom axios instance
    const navigate = useNavigate();

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('recipe', data.recipe || '');
        formData.append('category', data.category);
        formData.append('price', data.price || '');

        if (data.image && data.image[0]) {
            formData.append('image', data.image[0]);
        }

        axiosSecure.patch(`menu/${item._id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            const data = response.data;
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
                    text: 'Your menu item has been updated successfully!',
                });
                reset();
                navigate("/dashboard/manage-items"); 
            }
        })
        .catch((error) => {
            console.error('Error updating menu item:', error);
            Swal.fire({
                position: "top-center",
                icon: "error",
                title: 'Error',
                text: 'There was an error updating the menu item. Please try again.',
            });
        });
    };

    return (
        <div className='w-full md:w-[870px] px-4 mx-auto'>
            <h2 className='text-2xl font-semibold my-8'>Update This <span className='text-green'>Menu Item</span></h2>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Recipe Name*</span>
                        </label>
                        <input
                            type="text"
                            defaultValue={item.name}
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
                                defaultValue={item.category}
                                {...register("category", { required: true })}
                                className="select select-bordered"
                            >
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
                                defaultValue={item.price}
                                {...register("price")}
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
                            defaultValue={item.recipe}
                            {...register("recipe")}
                            className="textarea textarea-bordered h-24"
                            placeholder="Tell us about the recipe"
                        ></textarea>
                    </div>

                    <div>
                        <div className="form-control w-full my-6">
                            <label className="label">
                                <span className="label-text">Pick a file</span>
                            </label>
                            <input
                                {...register("image")}
                                type="file"
                                className="file-input w-full max-w-xs"
                            />
                        </div>
                    </div>

                    <button className='btn bg-green text-white px-6'>
                        Update Item <FaUtensils />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UpdateMenu;
