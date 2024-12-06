const mongoose = require("mongoose");
const ExpanceCategoryModel = require("../models/ExpanceCategoryModel");
const expanceModel = require("../models/ExpanceModel")

// @Request   GET
// @Route     http://localhost:5000/api/expance/category
// @Access    Private
const getExpanceCategory = async (req, res) => {
    try {
        const ExpanceCategory = await ExpanceCategoryModel.find();

        if (!ExpanceCategory.length) return res.status(404).json({ err: "No Expance Categories Data Found" });

        return res.status(201).json(ExpanceCategory);
    } catch (error) {
        console.log("Error Reading All Expance Categories ", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message })
    }
}


// @Request   GET
// @Route     http://localhost:5000/api/expance/category/active/E
// @Access    Private
const getActiveExpanceCategory = async (req, res) => {
    try {
        const ActiveExpanceCategory = await ExpanceCategoryModel.find({ ExpanceCategoryStatus: "active" });

        if (!ActiveExpanceCategory.length) return res.status(404).json({ err: "No Active Expance Categories Found" });

        return res.status(201).json(ActiveExpanceCategory);
    } catch (error) {
        console.log("Error Reading Active Expance Category ", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message })
    }
}

// @Request   GET
// @Route     http://localhost:5000/api/expance/category
// @Access    Private
const getSingleExpanceCategory = async (req, res) => {
    try {
        const _id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({ err: "Invalid Id Format" });

        const ExpanceCategory = await ExpanceCategoryModel.findOne({ _id });

        if (!ExpanceCategory) return res.status(404).json({ err: "No Expance Category Found" });

        return res.status(201).json(ExpanceCategory);
    } catch (error) {
        console.log("Error Reading Single Expance Category ", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message })
    }
}

// @Request   POST
// @Route     http://localhost:5000/api/expance/category
// @Access    Private
const createExpanceCategory = async (req, res) => {
    try {
        const { ExpanceCategoryName, ExpanceCategoryColor } = req.body;

        const ExpanceCategoryNameRegex = /^[A-Za-z0-9\s]+$/;
        const HexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;


        if (!ExpanceCategoryName || !ExpanceCategoryNameRegex.test(ExpanceCategoryName)) return res.status(400).json({ err: "Invalid Expance Category Name. Only letters, numbers, and spaces are allowed." })
        if (!ExpanceCategoryColor || !HexColorRegex.test(ExpanceCategoryColor)) return res.status(400).json({ err: "Invalid Expance Category Color. Only hexadecimal color codes (e.g., #FFFFFF or #FFF) are allowed." })

        const ExpanceCategoryNameExistanceCheck = await ExpanceCategoryModel.findOne({ ExpanceCategoryName });
        if (ExpanceCategoryNameExistanceCheck) return res.status(400).json({ err: "Expance Category Already Exists" });

        const ExpanceCategoryColorExistanceCheck = await ExpanceCategoryModel.findOne({ ExpanceCategoryColor });
        if (ExpanceCategoryColorExistanceCheck) return res.status(400).json({ err: "Expance Category Color Already Exists" });

        const newExpanceCategory = await ExpanceCategoryModel.create({ ExpanceCategoryName, ExpanceCategoryColor });

        return res.status(201).json({ msg: "Expance Category Created Successfully", newExpanceCategory });

    } catch (error) {
        console.log("Error creating Expance Category ", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message })
    }
}

// @Request   PUT
// @Route      http://localhost:5000/api/expance/category/:id
// @Access    Private
const updateExpanceCategory = async (req, res) => {
    try {
        const _id = req.params.id;
        const { ExpanceCategoryName, ExpanceCategoryColor, ExpanceCategoryStatus } = req.body;

        const ExpanceCategoryNameRegex = /^[A-Za-z0-9\s]+$/;
        const HexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        const ExpanceCategoryStatusRegex = /^(active|inactive)$/; // Regex to validate expanceCategoryStatus

        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({ err: "Invalid Id Format" });

        if (!ExpanceCategoryName || !ExpanceCategoryNameRegex.test(ExpanceCategoryName)) return res.status(400).json({ err: "Invalid Expance Category Name. Only letters, numbers, and spaces are allowed." })
        if (!ExpanceCategoryColor || !HexColorRegex.test(ExpanceCategoryColor)) return res.status(400).json({ err: "Invalid Expance Category Color. Only  are allowed." })
        if (!ExpanceCategoryStatus || !ExpanceCategoryStatusRegex.test(ExpanceCategoryStatus)) return res.status(400).json({ err: "Invalid Expance Category status. It should be either 'active' or 'inactive'." })

        const ExpanceCategory = await ExpanceCategoryModel.findById({ _id });
        if (!ExpanceCategory) return res.status(400).json({ err: "Expance Category not found" });


        const newExpanceCategory = await ExpanceCategoryModel.findByIdAndUpdate({ _id }, { ExpanceCategoryName, ExpanceCategoryStatus, ExpanceCategoryColor }, { new: true });

        return res.status(201).json({ msg: "Expance Category Updated Successfully", newExpanceCategory });

    } catch (error) {
        console.log("Error Updating Expance Category ", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message })
    }
}

// @Request   DELETE
// @Route      http://localhost:5000/api/expance/category/:id
// @Access    Private
const deleteExpanceCategory = async (req, res) => {
    try {
        const _id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({ err: "Invalid Object Id" });

        // Check if the category is assigned to any expense
        const checkExistanceInExpanceModel = await expanceModel.findOne({ expanceCategory: _id });

        if (checkExistanceInExpanceModel) return res.status(400).json({ err: "Category is assigned to an expense. Please reassign the category before deletion." });

        const deletedExpanceCategory = await ExpanceCategoryModel.findOneAndDelete({ _id });

        if (!deletedExpanceCategory) return res.status(404).json({ err: "Expance Category Not Found" });

        return res.status(201).json({ msg: "Expance Category Deleted Successfully", deletedExpanceCategory })
    } catch (error) {
        console.log("Error Deleting Expance Category ", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message })
    }
}


module.exports = { getExpanceCategory, getActiveExpanceCategory, getSingleExpanceCategory, createExpanceCategory, updateExpanceCategory, deleteExpanceCategory };