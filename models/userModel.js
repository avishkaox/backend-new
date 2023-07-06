const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter a name"]
    },
    email: {
        type: String,
        required: [true, "Please enter a email address"],
        unique: true,
        trim: true,
        match: [
            /^\w+([\\.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email address"
        ]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minLength: [6, "Password must be at least 6 characters"],
        // maxLength: [100, "Password must not be more than 100 characters"],
    },

    photo: {
        type: String,
        required: [true, "Please add a photo to your accounts"],
        default: 'https://images.unsplash.com/photo-1661956600684-97d3a4320e45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    phone: {
        type: String,
        unique: true,
        trim: true,
        default: '+19799'
    },
    bio: {
        type: String,
        default: "Biography",
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
    },

}, {

    timestamps: true,

});


//encrypted password

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
});


const User = mongoose.model('User', userSchema)
module.exports = User