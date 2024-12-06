const mongoose = require("mongoose");

const ExpanceCategorySchema = mongoose.Schema({
        ExpanceCategoryName:{
            type:String,
            required:[true,"Expance Category is Required"],
            trim:true
        },
        ExpanceCategoryColor: {
            type: String,
            required: [true, "Hexadecimal value is required"],
            trim: true
        },
        ExpanceCategoryStatus:{
            type:String,
            required:[true,"Expance Category Status is Required"],
            enum:["active","inactive"],
            default:"active",
            trim:true
        }
},{
    timestamps:true
})

module.exports = mongoose.model("ExpanceCategoryModel",ExpanceCategorySchema);