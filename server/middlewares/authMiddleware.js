const jwt = require("jsonwebtoken")
const userModel = require("../models/EmployeeModel")

const authMiddleware =async (req,res,next)=>{
    const token = req.header("Autherization");
    if(!token) return res.status(404).json({err:"UnAuthorized Http, Token not Found"});
    // const jwtToken = token.split(" ")[1].trim();
    const jwtToken = token.replace("Bearer","").trim();
    try {
        const isVerified = jwt.verify(jwtToken,process.env.Jwt_secret_key)

        const userData = await findOne({employeeEmail:isVerified.employeeEmail}).select({employeePassword:0})

        req.user = userData;
        req.token  = token;
        req.userId = userData.employeeId
        next();
    } catch (error) {
        return res.status(404).json({err:"UnAuthorized Http, Invalid Token"});
    }
}

module.exports = authMiddleware;