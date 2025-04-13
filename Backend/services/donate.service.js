const donateModel = require('../models/donateModel.js')

const donateService = async (data) => {
    try {
        const { fullname, email, phone, foodType, fullAddress, foodQuantity } = data;
        
        const newDonate = await donateModel.create({
            fullname,
            email,
            phone,
            foodType,
            fullAddress,
            foodQuantity
        });
        return newDonate;
    } catch (error) {
        console.error("Error creating donation:", error);
        throw error;
    }
};

module.exports = donateService;