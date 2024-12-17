import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import Menu from "../pages/shop/Menu";
import UpdateProfile from "../pages/dashboard/UpdateProfile";
import CartPage from "../pages/shop/CartPage";
import DashBoardLayout from "../layout/DashBoardLayout";
import Signup from "../components/Signup";
import Dashboard from "../pages/dashboard/Admin/Dashboard";
import Users from "../pages/dashboard/Admin/Users";
import AddMenu from "../pages/dashboard/Admin/AddMenu";
import ManageItem from "../pages/dashboard/Admin/ManageItem";
import UpdateMenu from "../pages/dashboard/Admin/UpdateMenu";
import Payment from "../pages/shop/Payment";
import Success from "../pages/paymentConfirmation/Success";

const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/menu",
          element: <Menu />,
        },
        {
          path:"/cart-page",
          element:<CartPage/>
        },
        {
          path:"/update-profile",
          element:<UpdateProfile/>
        },
        {
          path:"/process-checkout",
          element:<Payment/>
        },
        {
          path: "/success", 
          element: <Success />,
      },
    ]
    },
    {
      path: "/signup",
      element: <Signup/>
    },
    {
      path:"/dashboard",
      element:<DashBoardLayout/>,
      children:[
        {
          path:'',
          element:<Dashboard/>
        },
        {
        path:'users',
        element:<Users/>
        },
        {
        path:'add-menu',
        element:<AddMenu/>
        },
        {
          path:'manage-items',
          element:<ManageItem/>
          },
          {
            path:"update-menu/:id",
            element:<UpdateMenu/>,
            loader:({params}) => fetch(`http://localhost:3000/menu/${params.id}`)
          }
      ]
    }
  ]);

export default router;