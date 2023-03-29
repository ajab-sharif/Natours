const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please tell us your name!'],
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid email!'],
        required: [true, 'Please tell us your email!']
    },
    photo: String,
    password: {
        type: String,
        minlength: 8,
        required: [true, 'please provide a valid password!']
    },
    passwordConfirm: {
        type: String,
        required: [true, 'password not matching'],
        validate: {
            validator: function (el) {
                return this.password === el;
            },
            message: "password does't match!"
        }
    },
});
// only on save or create a d user
userSchema.pre('save', async function (next) {
    // check password change or not change
    // if passowrd not change than call next();
    if (!this.isModified('password')) return next();
    // password hashing for data base save 
    this.password = await bcrypt.hash(this.password, 12);
    // clear passwordConfirm
    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;