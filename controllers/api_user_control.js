import dotenv from "dotenv";
dotenv.config()
import userModel from "../model/user_data_model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

class api_coutrol {
    // Created users with hashed password and validation for email already exist.
    static registerUser = async (req, resp) => {
        try {
            const { user_name, user_email, user_password } = req.body;
            const hashed = await bcrypt.hash(user_password, Number(process.env.SALT))
            const user_data = new userModel({
                user_name: user_name,
                user_email: user_email,
                user_password: hashed
            })
            const result = await user_data.save()
            resp.json({
                status: "1",
                record: result,
                message: "record successfully created"
            })

        } catch (error) {
            resp.json({
                status: "0",
                message: `Add user function error ${error}`
            })
        }
    }

    // validate and login
    static userLogin = async (req, resp) => {
        try {
            const { user_password, user_email } = req.body;
            // Check User is exist
            const record_exist = await userModel.findOne({
                user_email: user_email
            });

            if (record_exist) {
                const check_pass = await bcrypt.compare(user_password, record_exist.user_password)
                if (user_email == record_exist.user_email && check_pass) {
                    // Generate JWT Token
                    const token = jwt.sign({ userID: record_exist._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
                    resp.json({
                        status: "1",
                        token: token,
                        message: `Successfully login`
                    })
                } else {
                    resp.json({
                        status: "0",
                        message: "Wrong Password"
                    })
                }
            } else {
                resp.json({
                    status: "0",
                    message: `Email does not Exist ${user_email}`
                })
            }
        } catch (error) {
            resp.json({
                status: "0",
                message: `User Login Error ${error}`
            })
        }
    }

    static change_password = async (req, resp) => {
        try {
            const { user_password, confirm_password } = req.body;

            // Check if fields are provided
            if (!user_password || !confirm_password) {
                return resp.json({
                    status: "0",
                    message: "new password or confirm password is empty."
                });
            }

            // Check new password and confirm password match
            if (user_password !== confirm_password) {
                return resp.json({
                    status: "0",
                    message: "New password and confirm password must be same."
                });
            }

            // Hash new password AND Update password
            const hashed = await bcrypt.hash(user_password, Number(process.env.SALT));
            await userModel.findByIdAndUpdate(req.user_record._id, { user_password: hashed });

            resp.json({
                status: "1",
                message: "Password successfully updated."
            });

        } catch (error) {
            resp.json({
                status: "0",
                message: `Change password error: ${error.message}`
            });
        }
    };
}



export default api_coutrol;