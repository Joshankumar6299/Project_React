const express = require('express');
const router = express.Router();
const {login, register, logout, updateUser, deleteUser} = require("../controllers/userController.js")

router.post("/register", register)
router.post("/login", login)
router.get('/logout',logout)

router.put("/update/:userId", updateUser);
router.delete("/delete/", deleteUser);

module.exports = router;