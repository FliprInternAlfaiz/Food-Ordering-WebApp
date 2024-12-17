import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';

const useMenu = () => {
    const axiosPublic = useAxiosPublic();
    const queryClient = useQueryClient();

    const fetchMenu = async () => {
        const response = await axiosPublic.get('/menu'); // Ensure the endspoint matches your API route
        return response.data;
    };

    const deleteMenuItem = async (id) => {
        await axiosPublic.delete(`/menu/${id}`); // Ensure the endpoint matches your API route
    };

    const { data: menu, error, isLoading, isError } = useQuery({
        queryKey: ['menu'],
        queryFn: fetchMenu,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteMenuItem,
        onSuccess: () => {
            queryClient.invalidateQueries('menu');
        },
    });

    return { menu, error, isLoading, isError, deleteMutation };
};

export default useMenu;
