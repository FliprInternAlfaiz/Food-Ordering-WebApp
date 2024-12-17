import React, { useContext, useState } from "react";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import axios from "axios";

const Modal = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { signUpWithGmail, login } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState("");

    // Redirecting to home page or specific page
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";

    const onSubmit = (data) => {
        const email = data.email;
        const password = data.password;
        const userinfo = {
            email: data.email
        }
        login(email, password)
            .then((result) => {

                axios.post("http://localhost:3000/users", userinfo).then((response) => {
                    console.log(response);
                    alert("Login successful");
                    document.getElementById("my_modal_5").close();
                    navigate(from, { replace: true });
                });


            })
            .catch((error) => {
                const errorMessage = error.message;
                setErrorMessage("Provide a correct email and password!");
            });
    };

    // Google SignIn
    const handleLogin = () => {
        signUpWithGmail()

            .then((result) => {
                const userinfo = {
                    name: result?.user?.displayName,
                    email: result?.user?.email,
                }
                console.log(userinfo.name);
                
                axios.post("http://localhost:3000/users", userinfo).then((response) => {
                    console.log(response);
                    alert('signUp Sucessfully');
                    navigate("/");
                })
            })
            .catch((error) => console.log(error));
    };

    return (
        <dialog id="my_modal_5" className="modal modal-middle sm:modal-middle">
            <div className="modal-box">
                <div className="modal-action flex flex-col justify-center mt-0">
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body" method="dialog">
                        <h3 className="font-bold text-lg">Please Login!</h3>

                        {/* Email */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="email"
                                className="input input-bordered"
                                {...register("email")}
                            />
                        </div>

                        {/* Password */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="password"
                                className="input input-bordered"
                                {...register("password")}
                            />
                            <label className="label mt-1">
                                <a href="#" className="label-text-alt link link-hover">
                                    Forgot password?
                                </a>
                            </label>
                        </div>

                        {/* Error */}
                        {errorMessage && <p className="text-red-500 text-xs italic">{errorMessage}</p>}

                        {/* Login Button */}
                        <div className="form-control mt-4">
                            <input
                                type="submit"
                                value="Login"
                                className="btn bg-green text-white"
                            />
                        </div>

                        <p className="text-center my-2">
                            Don't have an account?{" "}
                            <Link to="/signup" className="underline text-red-500 ml-1">
                                Signup Now
                            </Link>
                        </p>

                        {/* Close button */}
                        <button
                            onClick={() => document.getElementById("my_modal_5").close()}
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >✕</button>
                    </form>

                    {/* Social SignIn */}
                    <div className="text-center space-x-3 mb-5">
                        <button className="btn btn-circle hover:bg-green hover:text-white" onClick={handleLogin}>
                            <FaGoogle />
                        </button>
                        <button className="btn btn-circle hover:bg-green hover:text-white">
                            <FaFacebookF />
                        </button>
                        <button className="btn btn-circle hover:bg-green hover:text-white">
                            <FaGithub />
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    );
};

export default Modal;