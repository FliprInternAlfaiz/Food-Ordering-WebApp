const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email };

  try {
    const user = await User.findOne(query);
    const isAdmin = user?.role === 'admin';

    if (!isAdmin) {
      return res.status(401).json({ message: "Unauthorized: Admin access required" });
    }

    next(); // Only proceed to the next middleware if the user is an admin
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = verifyAdmin;
