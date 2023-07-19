
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Token = require('../models/tokenModel');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require('../utils/cloudinary');



const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
}


// @desc Register user
const registerUser = asyncHandler(
    async (req, res) => {
        const { name, email, password, registerid, phone, role, image } = req.body;



        // Handle Image upload
        let fileData = {};
        if (req.file) {
            // Save image to cloudinary
            let uploadedFile;
            try {
                uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                    folder: "user images",
                    resource_type: "image",
                });
            } catch (error) {
                res.status(500);
                throw new Error("Image could not be uploaded");
            }

            fileData = {
                fileName: req.file.originalname,
                filePath: uploadedFile.secure_url,
                fileType: req.file.mimetype,
                fileSize: fileSizeFormatter(req.file.size, 2),
            };
        }

        // validate email
        if (!email || !name || !password) {
            res.status(400);
            throw new Error('Please fill all fields');
        }

        if (password.length < 6) {
            res.status(400)
            throw new Error('Password must be at least 6 characters');
        }

        //Check if the user email already exists

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('This email has already been registered');
        }

        // check if the registerid already exists
        const registeridExists = await User.findOne({ registerid });

        if (registeridExists) {
            res.status(400);
            throw new Error('This Registerid has already been registered');
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            registerid,
            role,
            image: fileData,
        });

        //Genarate token
        const token = generateToken(user._id);

        //send HTTP-only cookie
        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), //1day
            sameSite: 'none',
            secure: true, // secure
        });

        if (user) {

            const { _id, email, password, name, image, phone, registerid, role } = user
            res.status(201).json({
                _id,
                email,
                password,
                name,
                image: fileData,
                phone,
                role,
                registerid,
                token
            })
        } else {
            res.status(400);
            throw new Error('Invalid user data received');
        }


    }
);


//login user

const loginUser = asyncHandler(
    async (req, res) => {

        const { email, password } = req.body;

        //validate email
        if (!email || !password) {
            res.status(400);
            throw new Error('Please fill all fields');
        }
        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            res.status(400);
            throw new Error('Invalid email or password');
        };
        // Check if password is correct
        const passwordIsCorrect = await bcrypt.compare(password, user.password);

        //Genarate token
        const token = generateToken(user._id);

        //send HTTP-only cookie
        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), //1day
            sameSite: 'none',
            secure: true, // secure
        });

        if (user && passwordIsCorrect) {
            const { _id, email, password, name, image, phone, registerid, role } = user;
            res.status(200).json({
                _id,
                email,
                password,
                name,
                image,
                role,
                phone,
                registerid,
                token,
            });
        } else {
            res.status(400);
            throw new Error('Invalid email or password');
        }
    });


//logout user
const logoutUser = asyncHandler(
    async (req, res) => {
        res.cookie('token', '', {
            path: '/',
            httpOnly: true,
            expires: new Date(0),
            sameSite: 'none',
            secure: true
        });
        res.status(200).json({ message: 'Logged out successfully' });
    }
);

// get user profile

const getUser = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.user._id)
        if (user) {
            const { _id, name, email, phone, registerid, image, role } = user;
            res.status(201).json({
                _id,
                name,
                email,
                phone,
                role,
                registerid,
                image,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    }
);

// Get Login status

const loginStatus = asyncHandler(
    async (req, res) => {
        const token = req.cookies.token;
        if (!token) {
            return res.json(false);
        }

        //verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        if (verified) {
            return res.json(true);
        } else {
            return res.json(false);
        }
    }
);



//Update user profile

const updateUser = asyncHandler(
    async (req, res) => {

        const user = await User.findById(req.user._id);

        if (user) {
            const { name, email, phone, registerid, image, role } = user;
            user.email = email;
            user.name = req.body.name || name;
            user.phone = req.body.phone || phone;
            user.registerid = req.body.registerid || registerid;
            user.role = req.body.role || role;
            user.image = req.body.image || image;


            const updateUser = await user.save();

            res.status(200).json(
                {
                    _id: updateUser._id,
                    name: updateUser.name,
                    email: updateUser.email,
                    phone: updateUser.phone,
                    registerid: updateUser.registerid,
                    image: updateUser.image,
                    role: updateUser.role,
                }
            );
        } else {
            res.status(404);
            throw new Error('User not found');
        }

    });



//Update user password
const updatePassword = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.user._id);

        const { oldPassword, password } = req.body;

        // Validate User
        if (!user) {
            res.status(404);
            throw new Error('User not found , Please sign in');
        }

        //Validate password
        if (!oldPassword || !password) {
            res.status(400);
            throw new Error('Please fill all fields');
        }

        // Validate oldpassword
        const oldPasswordMatching = await bcrypt.compare(oldPassword, user.password);


        if (user && oldPasswordMatching) {
            user.password = password;
            await user.save();
            res.status(200).json({ message: 'Password updated successfully' });
        } else {

            res.status(400);
            throw new Error('Invalid Old password');
        }


    });



// forgot password

const forgotPassword = asyncHandler(
    async (req, res) => {
        const { email } = req.body;
        const user = await User.findOne({ email })

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // delete token if it exists
        let token = await Token.findOne({ userId: user._id });
        if (token) {
            await token.deleteOne();
        }

        // create reset token
        let resetToken = crypto.randomBytes(32).toString("hex") + user._id


        // Hash token before saving password

        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // save Token to database

        await new Token({
            token: hashedToken,
            userId: user._id,
            createdAt: Date.now(),
            expiresAt: Date.now() + 24 * (60 * 1000)

        }).save()


        // Construct new url
        const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`

        // Reset Email

        const message = `<h2> Hello ${user.name} </h2>
        
        <p> Please click on the following link to reset your password:</p>
        <a title="Click to visit" href="${resetUrl}" clicktravking = "off" >${resetUrl}</a>
        `;

        const subject = "Your password reset request"
        const send_to = user.email
        const sent_from = process.env.EMAIL_USER


        try {
            await sendEmail(subject, message, send_to, sent_from)
            res.status(200).json({ success: true, message: 'Email sent successfully' })
        } catch (error) {

            res.status(500)
            throw new Error("Email reset request failed please try again")

        }

    });


// Reset password

const resetPassword = asyncHandler(
    async (req, res) => {


        const { password } = req.body;
        const { resetToken } = req.params;

        // Hash token then compare against token in db

        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Find token in database
        const userToken = await Token.findOne({
            token: hashedToken,
            expiresAt: { $gt: Date.now() },
        });

        if (!userToken) {
            res.status(404);
            throw new Error('Token not found');
        }

        // find the user

        const user = await User.findOne({
            _id: userToken.userId
        });
        user.password = password
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });

    });


// Update user details by ID
const updateUserById = asyncHandler(async (req, res) => {
    const { id } = req.params; // User ID to update
    
    const userToUpdate = await User.findById(id);

    if (!userToUpdate) {
        res.status(404);
        throw new Error('User to update not found');
    }

    // Update user details
    userToUpdate.name = req.body.name || userToUpdate.name;
    userToUpdate.email = req.body.email || userToUpdate.email;
    userToUpdate.phone = req.body.phone || userToUpdate.phone;
    userToUpdate.registerid = req.body.registerid || userToUpdate.registerid;
    userToUpdate.role = req.body.role || userToUpdate.role;
    userToUpdate.image = req.body.image || userToUpdate.image;

    const updatedUser = await userToUpdate.save();

    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        registerid: updatedUser.registerid,
        image: updatedUser.image,
        role: updatedUser.role,
    });
});


// Get all users
const getAllUsers = asyncHandler(async (req, res) => {

    // Fetch all users from the database
    const users = await User.find({});

    return res.status(200).json(users);
});



module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    updateUser,
    updatePassword,
    forgotPassword,
    resetPassword,
    updateUserById,
    getAllUsers
}