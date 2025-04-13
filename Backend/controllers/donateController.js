const ApiError = require("../utils/errorHandler.js")
const ApiResponse = require('../utils/apiResponse.js')
const asyncHandler = require('../utils/asyncHandler.js')
const donateService = require('../services/donate.service.js')

const donateFood = asyncHandler(async(req, res) => {
    const {fullname, email, phone, foodType, fullAddress, foodQuantity} = req.body;
    
    if (!phone) throw new ApiError(400, "Phone number is required");
    if (!email) throw new ApiError(400, "Email is required");
    if (!fullname) throw new ApiError(400, "Full name is required");
    if (!foodType) throw new ApiError(400, "Food type is required");
    if (!fullAddress) throw new ApiError(400, "Address is required");
    if (!foodQuantity) throw new ApiError(400, "Food quantity is required");

    const data = {
        fullname, 
        email, 
        phone, 
        foodType, 
        fullAddress, 
        foodQuantity
    }
    
    const donate = await donateService(data);

    return res
    .status(201) 
    .json(
        new ApiResponse(201, "Donation recorded successfully", donate)
    )
});

module.exports = {
    donateFood
}