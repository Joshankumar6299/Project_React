const donateModel = require('../models/donateModel.js')
const mongoose = require('mongoose')

// Create a new donation
const createDonation = async (data) => {
    console.log('Starting donation creation with data:', {
        ...data,
        user: data.user ? (typeof data.user === 'object' ? 'ObjectId instance' : data.user) : null
    });
    
    try {
        // Sanitize data to prevent errors
        const sanitizedData = { ...data };
        
        // Check if mongoose is properly imported
        console.log('Mongoose version:', mongoose.version);
        console.log('Is ObjectId valid function available:', typeof mongoose.Types.ObjectId.isValid === 'function');
        
        // Handle user ID - ensure it's either a valid ObjectId or null
        if (sanitizedData.user) {
            try {
                // If it's already an ObjectId instance
                if (sanitizedData.user instanceof mongoose.Types.ObjectId) {
                    console.log('User ID is already an ObjectId instance:', sanitizedData.user.toString());
                }
                // If it's a string, check if valid and convert
                else if (typeof sanitizedData.user === 'string') {
                    console.log('Checking if string is valid ObjectId:', sanitizedData.user);
                    if (mongoose.Types.ObjectId.isValid(sanitizedData.user)) {
                        sanitizedData.user = new mongoose.Types.ObjectId(sanitizedData.user);
                        console.log('Converted string to ObjectId successfully:', sanitizedData.user.toString());
                    } else {
                        console.warn('Invalid ObjectId string, setting to null:', sanitizedData.user);
                        sanitizedData.user = null;
                    }
                }
                // Handle other types
                else {
                    console.warn('User ID is not an ObjectId or string, setting to null:', 
                        typeof sanitizedData.user);
                    sanitizedData.user = null;
                }
            } catch (err) {
                console.error('Error processing user ID (setting to null):', err);
                sanitizedData.user = null;
            }
        } else {
            console.log('No user ID provided, donation will be anonymous');
            sanitizedData.user = null;
        }
        
        // Remove any fields that might cause issues
        if (sanitizedData._id) {
            delete sanitizedData._id;
        }
        
        console.log('Creating donation with final sanitized data:', {
            ...sanitizedData,
            user: sanitizedData.user ? sanitizedData.user.toString() : 'null (Anonymous)'
        });
        
        // Create the donation with explicit schema validation
        const newDonate = await donateModel.create(sanitizedData);
        
        console.log('Donation created successfully with ID:', newDonate._id.toString());
        console.log('User associated with donation:', newDonate.user ? newDonate.user.toString() : 'Anonymous');
        
        return newDonate;
    } catch (error) {
        console.error("❌ Error creating donation:", error);
        
        // Detailed error reporting for different error types
        if (error.name === 'ValidationError') {
            console.error('Validation error details:', JSON.stringify(error.errors));
            const errorMessages = Object.values(error.errors).map(err => err.message).join(', ');
            console.error('Validation errors:', errorMessages);
        } else if (error.name === 'CastError') {
            console.error('Cast error details:', {
                value: error.value,
                path: error.path,
                kind: error.kind
            });
        } else if (error.code === 11000) {
            console.error('Duplicate key error:', error.keyValue);
        }
        
        throw error;
    }
};

// Get all donations
const getAllDonations = async () => {
    try {
        const donations = await donateModel.find()
            .populate('user', 'name email') // Populate user details
            .sort({ createdAt: -1 }); // Most recent first
        return donations;
    } catch (error) {
        console.error("Error retrieving donations:", error);
        throw error;
    }
};

// Get donations by user ID
const getDonationsByUser = async (userId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid user ID format");
        }
        
        const donations = await donateModel.find({ user: userId })
            .sort({ createdAt: -1 }); // Most recent first
        return donations;
    } catch (error) {
        console.error("Error retrieving user donations:", error);
        throw error;
    }
};

// Update donation status
const updateDonationStatus = async (donationId, status) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(donationId)) {
            throw new Error("Invalid donation ID format");
        }
        
        const updatedDonation = await donateModel.findByIdAndUpdate(
            donationId,
            { status },
            { new: true, runValidators: true }
        );
        
        if (!updatedDonation) {
            throw new Error("Donation not found");
        }
        
        return updatedDonation;
    } catch (error) {
        console.error("Error updating donation status:", error);
        throw error;
    }
};

module.exports = {
    createDonation,
    getAllDonations,
    getDonationsByUser,
    updateDonationStatus
};