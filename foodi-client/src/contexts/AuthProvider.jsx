import React, { createContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import app from "../firebase/firebase.config";
import axios from 'axios';

export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Create an account
    const createUser = (email, password) => {
        setLoading(true);
        console.log(email);
        console.log(password);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Signup with Gmail
    const signUpWithGmail = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    // Login using email & password
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Logout 
    const logOut = () => {
        return signOut(auth);
    };

    // Update profile
    const updateUserProfile = (name, photoURL) => {
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: photoURL
        });
    };

    // Check signed-in user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            if (currentUser) {
                const userinfo = { email: currentUser.email }
                axios.post('http://localhost:3000/jwt', userinfo)
                    .then((response) => {
                        if (response.data.token) {
                            localStorage.setItem("access-token", response.data.token)
                        }
                        console.log(response);
                    })
            }
            else {
                localStorage.removeItem("access-token")

            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        createUser,
        signUpWithGmail,
        login,
        logOut,
        updateUserProfile,
        loading
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
