import User from '../model/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../lib/couldinary.lib.js';
import { generateToken } from '../lib/utils.js';

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be atleast 6 characters long' });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'email already exists ' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' + error });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const loguser = await User.findOne({ email });
        if (!loguser) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, loguser.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        generateToken(loguser._id, res);
        res.status(200).json({
            _id: loguser._id,
            name: loguser.name,
            email: loguser.email,
            profileimage:loguser.profileimage
        });

    } catch (error) {
        res.status(500).json({ message: 'User Not Found. Try Again!'});
    }

};

export const logout = (req, res) => {
    try {
        if (!req.cookies.JWT) {
            return res.status(400).json({ message: 'User not logged in' });
        }
        res.cookie('JWT', '', { maxAge: 1 });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' + error });
    }
};

export const updateProfile = async (req, res) => {
    const { profileimage } = req.body;
    try {
        const userid = req.user._id;
        if (!profileimage) {
            return res.status(400).json({ message: 'Please upload an image' });
        }
        const resimage = await cloudinary.uploader.upload(profileimage)
        const updateduser = await User.findByIdAndUpdate(userid, { profileimage: resimage.secure_url }, { new: true });
        res.status(200).json(updateduser);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' + error });
    }
};

export const checkToken = (req, res) => {
    try{
        res.status(200).json(req.user);
    }
    catch(error){
        res.status(500).json({ message: 'Internal server error' + error });
    }
}