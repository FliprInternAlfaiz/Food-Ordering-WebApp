import React from 'react';
import useMenu from '../../../hooks/useMenu';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const ManageItem = () => {
    const { menu, error, isLoading, isError, deleteMutation } = useMenu();

    const getImageSrc = (imagePath) => {
        if (imagePath.startsWith('/images')) {
            return imagePath;
        }
        return `http://localhost:3000/${imagePath}`;
    };

    const handleDelete = (itemId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteMutation.mutateAsync(itemId);
                    Swal.fire(
                        'Deleted!',
                        'Your item has been deleted.',
                        'success'
                    );
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        'There was an error deleting the item.',
                        'error'
                    );
                    console.error('Error deleting menu item:', error);
                }
            }
        });
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading menu items</div>;

    return (
        <div className='w-full md:w-[870px] px-4 mx-auto'>
            <h2 className='text-2xl font-semibold my-4'>Manage All <span className='text-green'>Menu Item</span></h2>

            <div>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Image</th>
                                <th>Item Name</th>
                                <th>Price</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menu.map((item, index) => (
                                <tr key={item._id}>
                                    <th>{index + 1}</th>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <img src={getImageSrc(item.image)} alt={item.name} />
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{item.name}</td>
                                    <td>$ {item.price}</td>
                                    <td>
                                        <Link to={`/dashboard/update-menu/${item._id}`}>
                                            <button className="btn btn-ghost btn-xs text-orange-700">
                                                <FaEdit />
                                            </button>
                                        </Link>
                                    </td>
                                    <td>
                                        <button 
                                            className="btn btn-ghost btn-xs text-red" 
                                            onClick={() => handleDelete(item._id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageItem;
