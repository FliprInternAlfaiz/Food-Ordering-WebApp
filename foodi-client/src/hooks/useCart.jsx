  import { useContext } from 'react';
  import { AuthContext } from '../contexts/AuthProvider';
  import { useQuery } from '@tanstack/react-query';

  const useCart = () => {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem('access-token')
    const { refetch, data: cart = [] } = useQuery({
      queryKey: ['carts', user?.email],
      queryFn: async () => {
        console.log(user.email);
        
        if (!user?.email) {
          return []; 
        }
        
        const response = await fetch(`http://localhost:3000/carts?email=${user.email}`,{
          headers:{
            authorization:`Bearer ${token}`
          }
        });
        console.log(response);
        
        
        if (!response.ok) {
          throw new Error('Failed to fetch cart data');
        }
        return response.json();
      },
      enabled: !!user?.email, // Only enable the query if user.email is available
    });

    return [cart, refetch];
  };

  export default useCart;
