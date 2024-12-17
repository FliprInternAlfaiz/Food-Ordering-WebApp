import React from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useAdmin = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Use `useQuery` to fetch admin status
    const { refetch, data: isAdmin, isLoading } = useQuery({
        queryKey: ['users/admin', user?.email], // Query key adjusted for correct invalidation
        queryFn: async () => {
            if (!user?.email) {
                return false; // Return false if user email is not available
            }
            const res = await axiosSecure.get(`users/admin/${user.email}`);
            console.log(res.data);

            return res.data.admin; // Assuming the API response structure includes `admin` field
        },
        enabled: !!user?.email, // Only run query if user email is available
    });

    return [isAdmin, isLoading, refetch]; // Return refetch for potential refetching needs
}

export default useAdmin;
