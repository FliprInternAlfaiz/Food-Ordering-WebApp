import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { MdDashboard, MdDashboardCustomize } from 'react-icons/md';
import { FaEdit, FaHome, FaLocationArrow, FaPlusCircle, FaQuestionCircle, FaRegUser, FaShoppingBag, FaUser } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { FaCartShopping } from 'react-icons/fa6';
import Signup from '../components/Signup';
import useAdmin from '../hooks/useAdmin';
import useAuth from '../hooks/useAuth';

const sharedLinks = (
    <>
        <li><Link to="/"><FaHome /> Home</Link></li>
        <li><Link to="/menu"><FaCartShopping /> Menu</Link></li>
        <li><Link to="/order-tracking"><FaLocationArrow /> Order Tracking</Link></li>
        <li><Link to="/customer-support"><FaQuestionCircle /> Customer Support</Link></li>
    </>
);

const DashBoardLayout = () => {
    const {loading} = useAuth(); 
    const [isAdmin, isAdminLoading] = useAdmin();

  
   
    return (
        <div>
            {isAdmin ? (
                <div className="drawer sm:drawer-open bg-white">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content flex flex-col sm:items-start sm:justify-start my-2">
                        {/* Page content here */}
                        <div className="flex items-center justify-between mx-4">
                            <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
                                <MdDashboardCustomize />
                            </label>
                            <button className="btn rounded-full flex items-center gap-2 px-6 bg-green text-white sm:hidden">
                                <FaRegUser /> Logout
                            </button>
                        </div>
                        <div className="mt-5 md:mt-2 mx-4">
                            <Outlet />
                        </div>
                    </div>

                    <div className="drawer-side bg-slate-200">
                        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 bg-slate-500">
                            <li>
                                <Link to="/dashboard" className="flex justify-start mb-3">
                                    <img src={logo} alt="Logo" className="w-20" />
                                    <span className="badge badge-primary">Admin</span>
                                </Link>
                            </li>
                            <hr />
                            {/* Sidebar content here */}
                            <li className="mt-3"><Link to="/dashboard"><MdDashboard /> Dashboard</Link></li>
                            <li><Link to="/dashboard/manage-booking"><FaShoppingBag /> Manage Booking</Link></li>
                            <li><Link to="/dashboard/add-menu"><FaPlusCircle /> Add Menu</Link></li>
                            <li><Link to="/dashboard/users"><FaUser /> All Users</Link></li>
                            <li className="mb-3"><Link to="/dashboard/manage-items"><FaEdit /> Manage Items</Link></li>
                            <hr />
                            {/* Shared Links */}
                            {sharedLinks}
                        </ul>
                    </div>
                </div>
            ) : (
                <Signup />
            )}
        </div>
    );
}

export default DashBoardLayout;
