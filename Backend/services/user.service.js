const bcrypt = require("bcrypt");
const ApiError = require("../utils/errorHandler.js")
const User = require("../models/userModel.js");

const registerService = async (data) => {
    try {

        const existingUser = await User.findOne({ email: data.email});
        // console.log(existingUser);
        
        if(existingUser){
            throw new ApiError(409, "User already exists with this email")
        }
        const existingPhone = await User.findOne({phone : data.phone});
        // console.log(existingPhone);
        
        if(existingPhone){
            throw new ApiError(409, "User with this phone already exists")
        }

        const newUser = await User.create({
            fullname: data.fullname,
            password: data.password,
            email: data.email,
            phone: data.phone
        });

        newUser.password = undefined; 

        return newUser;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

const loginService = async (data) => {
    try {
        const user = await User.findOne({ email: data.email });

        if (!user) {
            throw new ApiError(400, "User not found");
        }

        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) {
            throw new ApiError(401, "Invalid credentials");
        }

        return user


    } catch (error) {
        throw error;
    }
};

module.exports = {
    registerService,
    loginService
}