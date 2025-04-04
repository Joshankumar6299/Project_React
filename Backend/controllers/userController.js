const ApiError = require("../utils/errorHandler.js")
const ApiResponse = require('../utils/apiResponse.js')
const asyncHandler = require('../utils/asyncHandler.js')
const {registerService, loginService } = require ("../services/user.service.js")
const {generateAccessToken, generateRefreshToken, setTokensCookie} = require("../utils/tokenGenerator.js")


const register = asyncHandler(async(req, res) => {
    const {phone, email, password, fullname} = req.body;
    
    if (!phone) throw new ApiError(400, "Phone number is required");
    if (!email) throw new ApiError(400, "Email is required");
    if (!password) throw new ApiError(400, "Password is required");
    if (!fullname) throw new ApiError(400, "Full name is required");

    const data = {
        phone, email, password, fullname
    }
    const user = await registerService(data);

    return res
    .status(201) 
    .json(
        new ApiResponse(200, "User created Successfully", user)
    )
});

const login = asyncHandler(async(req, res) => {
    const {email, password} = req.body;

    if (!email) throw new ApiError(400, "Email is required");
    if (!password) throw new ApiError(400, "Password is required");

    const data = {
        email, 
        password
    }
        const user = await loginService(data);

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        setTokensCookie(res, accessToken, refreshToken);
        user.password = undefined;

        return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                "User logged in successfully",
                {
                    user,
                    accessToken,
                    refreshToken
                }
            )
        )
})

// Logout Controller
const logout = asyncHandler(async (req, res) => {
    // Clear the cookies (access token and refresh token)
    res.clearCookie('accessToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    // Respond with a success message
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "User logged out successfully",
                null
            )
        );
});


module.exports = {
    register,
    login,
    logout,
}