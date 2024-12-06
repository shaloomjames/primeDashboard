const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
    roleName: {
        type: String,
        required: [true, "User Role is required"],
        trim: true
    },
    roleStatus: {
        type: String,
        enum: ["active", "inactive"], 
        default:"active",
        required: [true, "User Role is required"],
        trim: true
    },
},
    {
        timestamps: true
    });

module.exports = mongoose.model("roleModel", roleSchema);