import dotenv from "dotenv";
dotenv.config()
import jwt from "jsonwebtoken"
import userModel from "../model/user_data_model.js";

// Check is email exist before registration
const isEmailExist = async (req, resp, next) => {
    const email = req.body.user_email
    const record_exist = await userModel.findOne({
        user_email: email
    })
    if (!record_exist) {
        next()
    } else {
        resp.json({
            status: "0",
            message: `Email Already Exist ${email}`
        })
    }
}

// Check for any extra fields in the request
const validateRequestFields = async (req, resp, next) => {
    const allowedFields = Object.keys(userModel.schema.paths);
    const receivedFields = Object.keys(req.body);
    // Compare with schema to check in request invalid properties 
    const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
        return resp.json({
            status: "0",
            message: `Invalid fields detected: ${invalidFields.join(", ")}`
        });
    } else {
        next()
    }
}
// Check empty User and password isEmpty and email format
const validateEmpty = async (req, resp, next) => {
    try {
        const { user_password, user_email } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Check if email or password is empty
        if (!user_email?.trim() || !user_password?.trim()) {
            return resp.json({
                status: "0",
                message: "Email or password is empty"
            });
        }

        // Validate email format using regex
        if (!emailRegex.test(user_email)) {
            return resp.json({
                status: "0",
                message: "Invalid email format. Please enter a valid email address."
            });
        }

        next();
    } catch (error) {
        resp.json({
            status: "0",
            message: `User Login Error ${error}`
        })
    }
}

// Check and validate the token
const verifyToken = async (req, resp, next) => {
    try {
        const { authorization } = req.headers;

        // Check if token is provided
        if (!authorization) {
            return resp.json({
                status: "0",
                message: "Token Required"
            });
        }

        // Verify JWT Token
        const token = authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const record = await userModel.findById(decoded.userID).select("-user_password");

        if (!record) {
            return resp.json({
                status: "0",
                message: "User not found"
            });
        }
        req.user_record = record;
        next()

    } catch (error) {
        if (error.name == "TokenExpiredError") {
            return resp.json({
                status: "0",
                message: "Token has expired. Please login."
            });
        }
        if (error.name == "JsonWebTokenError") {
            return resp.json({
                status: "0",
                message: "Invalid token"
            });
        }

        // General Error Response
        resp.json({
            status: "0",
            message: `Token Verification Error: ${error.message}`
        });
    }
};

export { validateRequestFields, isEmailExist, validateEmpty, verifyToken }