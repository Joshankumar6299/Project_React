const express = require('express');
const router = express.Router();
const {login, register, logout, updateUser, deleteUser, checkJwtConfig} = require("../controllers/userController.js")

router.post("/register", register)
router.post("/login", login)
router.get('/logout',logout)

router.put("/update/:userId", updateUser);
router.delete("/delete/", deleteUser);

// Debug route - REMOVE IN PRODUCTION
router.get("/jwt-debug", checkJwtConfig);

module.exports = router;