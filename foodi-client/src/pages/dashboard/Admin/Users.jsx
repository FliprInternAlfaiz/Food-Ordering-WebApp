import { useQuery, useMutation } from '@tanstack/react-query';
import React from 'react';
import { FaTrash, FaUser } from "react-icons/fa";
import Swal from 'sweetalert2'; // Import SweetAlert2
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Users = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch users
  const { refetch, data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const response = await axiosSecure.get(`/users`);
        if (response.status !== 200) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }
        return response.data;
      } catch (err) {
        console.error('Error:', err.message);
        throw err;
      }
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      try {
        const response = await axiosSecure.delete(`/users/${userId}`);
        if (response.status !== 200) {
          throw new Error(`Failed to delete user: ${response.statusText}`);
        }
        return response.data;
      } catch (err) {
        console.error('Error:', err.message);
        throw err;
      }
    },
    onSuccess: () => {
      refetch(); // Refetch users after successful deletion
    },
  });

  // Make admin mutation
  const makeAdminMutation = useMutation({
    mutationFn: async (userId) => {
      try {
        const response = await axiosSecure.patch(`/users/admin/${userId}`);
        if (response.status !== 200) {
          throw new Error(`Failed to make admin: ${response.statusText}`);
        }
        return response.data;
      } catch (err) {
        console.error('Error:', err.message);
        throw err;
      }
    },
    onSuccess: () => {
      refetch(); // Refetch users after successfully making an admin
      Swal.fire('Success!', 'The user has been made an admin.', 'success');
    },
    onError: () => {
      Swal.fire('Error!', 'There was an issue making the user an admin.', 'error');
    },
  });

  // Handle delete action with SweetAlert
  const handleDelete = (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUserMutation.mutate(userId, {
          onSuccess: () => {
            Swal.fire('Deleted!', 'The user has been deleted.', 'success');
          }
        });
      }
    });
  };

  // Handle make admin action
  const handleMakeAdmin = (user) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to promote ${user.name} to admin?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, make admin'
    }).then((result) => {
      if (result.isConfirmed) {
        makeAdminMutation.mutate(user._id);
      }
    });
  };

  return (
    <div>
      <div className='flex items-center justify-between mx-4 my-4'>
        <h5>All Users</h5>
        <h5>Total Users : {users.length}</h5>
      </div>

      <div>
        <div className="overflow-x-auto">
          <table className="table table-zebra md:w-[870px]">
            <thead className='bg-green text-white rounded-lg'>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item, index) => (
                <tr key={item._id}>
                  <th>{index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    {item.role === 'admin' 
                      ? 'Admin' 
                      : <button 
                          onClick={() => handleMakeAdmin(item)} 
                          className='btn btn-xs bg-indigo-500 text-white'
                        >
                          <FaUser />
                        </button>
                    }
                  </td>
                  <td>
                    <button 
                      className='btn btn-xs bg-orange-500 text-white' 
                      onClick={() => handleDelete(item._id)}
                    >
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

export default Users;
