const jwt = require("jsonwebtoken");
const userModel = require("../models/EmployeeModel");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ err: "Unauthorized: Token not found" });

  const jwtToken = token.replace("Bearer ", "").trim();

  try {
    // Verifying the token
    const isVerified = jwt.verify(jwtToken, process.env.Jwt_secret_key);

    // Fetch user data, excluding the password field
    const userData = await userModel
      .findOne({ employeeEmail: isVerified.useremail })
      .select({ employeePassword: 0 });

    // Handle case where user doesn't exist
    if (!userData) {
      return res.status(404).json({ err: "Unauthorized: User does not exist" });
    }

    // Assign values to request object
    req.user = userData;
    req.token = jwtToken;
    req.userId = userData.employeeId;

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ err: "Unauthorized: Token expired" });
    } else {
      return res.status(403).json({ err: "Unauthorized: Invalid token" });
    }
  }
};

module.exports = authMiddleware;

// const res = await axios.get("/api/role", {
//     headers: {
//       Authorization: `Bearer ${token}`  // Add token to headers
//     }}
