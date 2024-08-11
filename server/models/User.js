import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    // Other fields can go here...
});

userSchema.methods.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
