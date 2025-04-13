const mongoose = require('mongoose');

const donateSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    foodType: {
        type: String,
        required: true,
        enum: ['veg', 'non-veg'],
    },
    fullAddress: {
        type: String,
        required: true,
    },
    foodQuantity: {
        type: String,
        required: true,
    },
    
})

module.exports = mongoose.model('donate', donateSchema);