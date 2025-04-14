const ApiError = require("../utils/errorHandler.js")
const ApiResponse = require('../utils/apiResponse.js')
const asyncHandler = require('../utils/asyncHandler.js')
const mongoose = require('mongoose')
const { 
    createDonation, 
    getAllDonations: getAllDonationsService, 
    getDonationsByUser: getDonationsByUserService, 
    updateDonationStatus: updateDonationStatusService 
} = require('../services/donate.service.js')

const donateFood = asyncHandler(async(req, res) => {
    try {
        console.log('📥 Donation request received:', req.body);
        
        const {fullname, email, phone, foodType, fullAddress, foodQuantity, notes, user: bodyUserId} = req.body;
        
        // Comprehensive validation
        const validationErrors = [];
        
        if (!phone) validationErrors.push("Phone number is required");
        else if (!/^\d{10}$/.test(phone)) validationErrors.push("Phone number must be 10 digits");
        
        if (!email) validationErrors.push("Email is required");
        else if (!/\S+@\S+\.\S+/.test(email)) validationErrors.push("Email format is invalid");
        
        if (!fullname) validationErrors.push("Full name is required");
        if (!foodType) validationErrors.push("Food type is required");
        if (!fullAddress) validationErrors.push("Address is required");
        
        if (!foodQuantity) validationErrors.push("Food quantity is required");
        else if (parseInt(foodQuantity) <= 0) validationErrors.push("Food quantity must be greater than 0");
        
        if (validationErrors.length > 0) {
            console.log('❌ Validation errors:', validationErrors);
            return res.status(400).json(
                new ApiResponse(400, validationErrors.join(", "), null)
            );
        }
        
        // Handle user ID safely
        let userId = null;
        
        // First check if authenticated user is available
        if (req.user && req.user._id) {
            try {
                userId = req.user._id; // Already an ObjectId
                console.log('✅ Using authenticated user ID:', userId.toString());
            } catch (error) {
                console.error('❌ Error using authenticated user ID:', error);
                userId = null;
            }
        } 
        // Then try to use ID from request body if valid
        else if (bodyUserId) {
            try {
                console.log('🔍 Checking user ID from request body:', bodyUserId);
                if (mongoose.Types.ObjectId.isValid(bodyUserId)) {
                    userId = new mongoose.Types.ObjectId(bodyUserId);
                    console.log('✅ Using validated user ID from request body:', userId.toString());
                } else {
                    console.warn('⚠️ Invalid user ID format in request body, will be null:', bodyUserId);
                }
            } catch (error) {
                console.error('❌ Error processing user ID from body:', error);
            }
        }
        
        console.log('✏️ User ID sources - Auth:', req.user?._id?.toString() || 'none', 'Body:', bodyUserId || 'none');
        console.log('✅ Final user ID being used:', userId?.toString() || 'null (Anonymous)');
        
        // Prepare donation data
        const data = {
            user: userId, // Will be null if no valid user ID was found
            fullname, 
            email, 
            phone, 
            foodType, 
            fullAddress, 
            foodQuantity,
            notes: notes || '',
            donationDate: new Date()
        }
        
        console.log('🚀 Sending donation data to service:', {
            ...data,
            user: data.user ? data.user.toString() : 'null (Anonymous)'
        });
        
        // Create the donation
        const donate = await createDonation(data);
        
        console.log('✅ Donation created successfully - ID:', donate._id.toString(), 'User:', donate.user?.toString() || 'Anonymous');
        
        return res
            .status(201) 
            .json(
                new ApiResponse(201, "Donation recorded successfully", donate)
            );
    } catch (error) {
        console.error("❌ Donation controller error:", error);
        
        // Handle different types of errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json(
                new ApiResponse(400, errors.join(", "), null)
            );
        }
        
        if (error.code === 11000) {
            return res.status(400).json(
                new ApiResponse(400, "Duplicate entry error", null)
            );
        }
        
        // For other errors, return a generic 500 error
        return res.status(500).json(
            new ApiResponse(500, "Server error: " + (error.message || "Unknown error"), null)
        );
    }
});

// Get all donations
const getAllDonations = asyncHandler(async(req, res) => {
    const donations = await getAllDonationsService();
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, "Donations retrieved successfully", donations)
    )
});

// Get user donations
const getUserDonations = asyncHandler(async(req, res) => {
    const userId = req.user?._id;
    
    if (!userId) throw new ApiError(401, "Authentication required");
    
    const donations = await getDonationsByUserService(userId);
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, "User donations retrieved successfully", donations)
    )
});

// Update donation status
const updateDonationStatus = asyncHandler(async(req, res) => {
    const { donationId, status } = req.body;
    
    if (!donationId) throw new ApiError(400, "Donation ID is required");
    if (!status || !['pending', 'accepted', 'completed', 'cancelled'].includes(status)) {
        throw new ApiError(400, "Valid status is required");
    }
    
    // Check if admin or owner of the donation
    const isAdmin = req.user?.role === 'admin';
    
    if (!isAdmin) {
        throw new ApiError(403, "You don't have permission to update donation status");
    }
    
    const donation = await updateDonationStatusService(donationId, status);
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, "Donation status updated successfully", donation)
    )
});

module.exports = {
    donateFood,
    getAllDonations,
    getUserDonations,
    updateDonationStatus
}