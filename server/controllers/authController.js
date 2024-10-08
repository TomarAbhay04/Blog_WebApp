import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config();

export const registerUser = async (req, res) => {
    const { email, password, name,} = req.body;
    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
                name: user.name,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: '2d',
            },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name, // Include user details in the response
                    },
                });            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
         
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }   
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = {
            user: {
                id: user.id,
                name: user.name,
            },
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: '2d',
            },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name, // Include user details in the response
                    },
                });
            }
        );
    }   
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
