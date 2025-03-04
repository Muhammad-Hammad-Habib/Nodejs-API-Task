import dotenv from "dotenv";
dotenv.config()
import express from "express";
const app = express()
const PORT = process.env.PORT;
import connect_db from "./config/connect_db.js";
import routes from "./route/mainRoutes.js";
 

//connect with DATABASE
connect_db()

// JSON for postAPI
app.use(express.json())

// User Routing
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
})