const User = require("../models/Users");

const getAllUser = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users); // Send all users
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    const user = req.body;
    const query = { email: user.email };
    try {
        const userExisting = await User.findOne(query);

        if (userExisting) {
            return res.status(202).json({ message: "User Already exists" }); // Return to stop further execution
        }

        const result = await User.create(user);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User does not exist" }); // Return to stop further execution
        }

        res.status(200).json({ message: "User Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Admin
const getAdmin = async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    try {
        const user = await User.findOne(query);

        if (email !== req.decoded.email) {
            return res.status(403).send({ message: "Forbidden Access" }); // Return to stop further execution
        }

        let admin = false;
        if (user) {
            admin = user.role === "admin";
        }
        res.status(200).json({ admin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Make admin of a user
const makeAdmin = async (req, res) => {
    const userId = req.params.id;
    const { name, email, photoURL, role } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role: "admin" },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ message: "User Not Found" }); // Return to stop further execution
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUser,
    createUser,
    deleteUser,
    getAdmin,
    makeAdmin
};  
