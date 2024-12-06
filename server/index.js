const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const ConnectDB = require("./config/Db")
const path = require("path")


//cors is a middleware used as a bridge for connection between server and client 
const corOptions = {
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true
};

// middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corOptions));

//    routes
app.use("/api/role", require("./routers/RoleRoute"));
app.use("/api/employee", require("./routers/EmployeeRoute"));
app.use("/api/employee/login", require("./routers/LoginRoute"));
app.use("/api/expance/category", require("./routers/ExpanceCategoryRoute"));
app.use("/api/expance", require("./routers/ExpanceRoute"));
app.use("/api/attendance", require("./routers/AttendanceRoute"));

// deployment
if (process.env.NODE_ENV === "production") {
   const dirPath = path.resolve();
   app.use(express.static(path.join("client/build")));
   app.get("*",(req,res)=>{
    res.sendFile(path.resolve(dirPath,"client","build","index.html"));
   }) 
}

// Server Listening
const PORT = process.env.Port || 6000;
ConnectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server is successfully running on http://localhost:${PORT}/`)
    })
})