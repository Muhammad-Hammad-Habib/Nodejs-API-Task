import mongoose from "mongoose";
const user_schema = new mongoose.Schema({
    user_name: {
        type: String,
        // required: true,
        trim: true
    },
    user_email: {
        type: String,
        required: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format. Please enter a valid email address."]
    },
    user_password: {
        type: String,
        trim: true,
        required: true
    }
});

const userModel = new mongoose.model("User", user_schema)

export default userModel;