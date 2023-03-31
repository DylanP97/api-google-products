const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, validator(value){
        if(!validator.isEmail(value)){
            throw new Error("invalid email")
        }
    } },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema);