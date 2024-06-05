const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Ensure correct import

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log(token);
        
        const decodedUser = jwt.verify(token, 'secretkey');
        console.log('userID >>>> ', decodedUser.userId);
        
        const user = await User.findByPk(decodedUser.userId); // Await the promise
        
        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false, message: 'Authentication failed' });
    }
};

module.exports = {
    authenticate
};
