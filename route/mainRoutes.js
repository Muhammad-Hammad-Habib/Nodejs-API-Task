import express from "express";
const route = express.Router();
import user_api from "../controllers/api_user_control.js";
import { verifyToken, validateRequestFields, isEmailExist, validateEmpty } from "../middleware/middleware.js"

// 
// Apply middlewares On 
route.use("/register_user", [validateRequestFields, validateEmpty, isEmailExist])
route.use("/login_user", [validateRequestFields, validateEmpty])
route.use("/change_password", verifyToken)


// public API (No need JWT)
route.post("/register_user", user_api.registerUser)
route.post("/login_user", user_api.userLogin)

// Privte API (need JWT Verification)
route.post("/change_password", user_api.change_password)

export default route