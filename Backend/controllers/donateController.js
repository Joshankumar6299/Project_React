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
    try {
        const userId = req.user?._id;
        
        if (!userId) {
            console.log("getUserDonations - No authenticated user, returning empty list");
            // Return an empty list instead of throwing an error
            return res
                .status(200)
                .json(
                    new ApiResponse(200, "No authenticated user found - returning empty donation list", [])
                );
        }
        
        console.log("Fetching donations for user ID:", userId.toString());
        
        // Get donations directly linked to this user
        const donations = await getDonationsByUserService(userId);
        console.log(`Found ${donations.length} donations for user ${userId.toString()}`);
        
        return res
        .status(200)
        .json(
            new ApiResponse(200, "User donations retrieved successfully", donations)
        );
    } catch (error) {
        console.error("Error in getUserDonations controller:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json(
                new ApiResponse(400, "Invalid user ID format", null)
            );
        }
        
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json(
            new ApiResponse(statusCode, error.message || "Error retrieving user donations", null)
        );
    }
});

// Update donation status
const updateDonationStatus = asyncHandler(async(req, res) => {
    // Check if req.body exists before trying to destructure from it
    if (!req.body) {
        return res.status(400).json(
            new ApiResponse(400, "Request body is missing", null)
        );
    }
    
    const { donationId, status } = req.body;
    
    // Validate required parameters
    if (!donationId) {
        return res.status(400).json(
            new ApiResponse(400, "Donation ID is required", null)
        );
    }
    
    if (!status || !['pending', 'accepted', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json(
            new ApiResponse(400, "Valid status is required", null)
        );
    }
    
    // Check if user is authenticated
    if (!req.user) {
        console.log("updateDonationStatus - No authenticated user");
        return res
            .status(403)
            .json(
                new ApiResponse(403, "Authentication required to update donation status", null)
            );
    }
    
    // Check if admin or owner of the donation
    const isAdmin = req.user?.role === 'admin';
    
    if (!isAdmin) {
        return res.status(403).json(
            new ApiResponse(403, "You don't have permission to update donation status", null)
        );
    }
    
    try {
        const donation = await updateDonationStatusService(donationId, status);
        
        return res
            .status(200)
            .json(
                new ApiResponse(200, "Donation status updated successfully", donation)
            );
    } catch (error) {
        console.error("Error updating donation status:", error);
        
        if (error.message === "Donation not found") {
            return res.status(404).json(
                new ApiResponse(404, "Donation not found", null)
            );
        }
        
        if (error.name === 'CastError') {
            return res.status(400).json(
                new ApiResponse(400, "Invalid donation ID format", null)
            );
        }
        
        return res.status(500).json(
            new ApiResponse(500, error.message || "Error updating donation status", null)
        );
    }
});

module.exports = {
    donateFood,
    getAllDonations,
    getUserDonations,
    updateDonationStatus
}