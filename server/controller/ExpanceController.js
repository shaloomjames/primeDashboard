const mongoose = require("mongoose");
const ExpanceModel = require("./../models/ExpanceModel");
const ExpanceCategoryModel = require("../models/ExpanceCategoryModel");

// @Request   GET
// @Route     http://localhost:5000/api/expance
// @Access    Private
// const getExpance = async (req, res) => {
//     try {
//         const Expance = await ExpanceModel.find().populate("addedBy").populate("expanceCategory");

//         if (!Expance) return res.status(404).json({ err: "No Data Found" });

//         return res.status(200).json(Expance);
//     } catch (error) {
//         console.log("Error Reading Expance", error)
//         return res.status(500).json({ err: "Internal Server Error", error: error.message })
//     }
// }

const getExpance = async (req, res) => {
    try {
        const { startingDate, endingDate } = req.query;

        let filter = {};
        
        if (startingDate && endingDate) {
            filter.expanceDate = { 
                $gte: new Date(startingDate), 
                $lte: new Date(endingDate) 
            };
        }
        
        const expenses = await ExpanceModel.find(filter).populate("addedBy").populate("expanceCategory");
        
        if (!expenses.length) return res.status(404).json({ err: "No data found" });

        return res.status(200).json(expenses);
    } catch (error) {
        console.log("Error Reading Expenses:", error);
        return res.status(500).json({ err: "Internal Server Error" });
    }
};

const getTb1Expance = async (req, res) => {
    try {
        const { startingDate, endingDate } = req.query;

        let filter = {};
        
        if (startingDate && endingDate) {
            filter.expanceDate = { 
                $gte: new Date(startingDate), 
                $lte: new Date(endingDate) 
            };
        }
        
        const expenses = await ExpanceModel.find(filter).populate("expanceCategory");
        
        if (!expenses.length) return res.status(404).json({ err: "No data found" });

        return res.status(200).json(expenses);
    } catch (error) {
        console.log("Error Reading Expenses:", error);
        return res.status(500).json({ err: "Internal Server Error" });
    }
};


const getTb2Expance = async (req, res) => {
    try {
        const { startingDate, endingDate } = req.query;

        let filter = {};
        
        if (startingDate && endingDate) {
            filter.expanceDate = { 
                $gte: new Date(startingDate), 
                $lte: new Date(endingDate) 
            };
        }
        
        const expenses = await ExpanceModel.find(filter).populate("expanceCategory");
        
        if (!expenses.length) return res.status(404).json({ err: "No data found" });

        return res.status(200).json(expenses);
    } catch (error) {
        console.log("Error Reading Expenses:", error);
        return res.status(500).json({ err: "Internal Server Error" });
    }
};

// useEffect(() => {
    //         const fetchExpance = async () => {
    //             try {
    //                 const res = await axios.get("http://localhost:5000/api/expance", {
    //                     params: { startingDate, endingDate },
    //                 });
    //                 setExpanceData(res.data); // Store the fetched data
    //             } catch (error) {
    //                 console.log("Error Fetching Expance Data", error); // Handle error
    //             }
    //         };
    //         fetchExpance();
    //     }, [startingDate, endingDate]); // Re-run whenever dates change

// @Request   GET
// @Route     http://localhost:5000/api/role/:id
// @Access    Private
const getSingleExpance = async (req, res) => {
    try {
        const _id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({ err: "Invalid Id Format" });

        const Expance = await ExpanceModel.findById({ _id }).populate("addedBy").populate("expanceCategory");
        if (!Expance) return res.status(404).json({ err: "No Data Found" });

        return res.status(200).json(Expance);
    } catch (error) {
        console.log("Error Reading Expance", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message })
    }
}

// @Request   post
// @Route     http://localhost:5000/api/hall/
// @access    private
const createExpance = async (req, res) => {
    try {
        //  Check if there was an error in file upload
         if (req.fileValidationError) {
            return res.status(400).json({ err: req.fileValidationError });
        }

        const { expanceName, expanceAmount, expanceDate,expanceCategory, addedBy } = req.body;

        const expanceImage = req.file ? req.file.filename : null;

        // Validate expense name (optional)
        const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces
        const numberRegex = /^\d+$/; // Only digits
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Validate date in 'YYYY-MM-DD' format

        // Validate expanceName
        if (!expanceName || !nameRegex.test(expanceName)) return res.status(400).json({ err: "Invalid Expense Name. Only letters and spaces are allowed." });

        // Validate expanceAmount
        if (!expanceAmount || !numberRegex.test(expanceAmount)) return res.status(400).json({ err: "Invalid Expense Amount. Only numeric values are allowed." });

        // Validate expanceDate
        if (!expanceDate || !dateRegex.test(expanceDate)) return res.status(400).json({ err: "Invalid Expense Date. Date should be in 'YYYY-MM-DD' format." });

        // Ensure expanceImage is present
        // if (!expanceImage) return res.status(400).json({ err: "Expense Image is required." });

        if (!expanceCategory || !mongoose.Types.ObjectId.isValid(expanceCategory)) return res.status(400).json({ err: "Invalid Category ID Format" });
        
        if (!addedBy || !mongoose.Types.ObjectId.isValid(addedBy)) return res.status(400).json({ err: "Invalid User ID Format" });

        // Convert the expanceDate to a JavaScript Date object before saving
        const formattedDate = new Date(expanceDate);

        const newExpance = await ExpanceModel.create({
            expanceName,
            expanceAmount,
            expanceImage,
            expanceDate: formattedDate, // Storing as Date object
            expanceCategory,
            addedBy
        });

        return res.status(200).json({ msg: "Expense Added Successfully", newExpance });
    } catch (error) {
        console.log("Error Adding Expense", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
};

// @Request   PUT
// @Route     http://localhost:5000/api/expance/:id
// @Access    Private
const updateExpance = async (req, res) => {
    try {
        const _id = req.params.id;
        const { expanceName, expanceAmount, expanceDate, expanceCategory } = req.body;

        const nameRegex = /^[A-Za-z\s]+$/;  // Only letters and spaces
        const numberRegex = /^\d+$/;        // Only digits
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Validate date in 'YYYY-MM-DD' format

        // Validate expanceName
        if (!expanceName || !nameRegex.test(expanceName)) return res.status(400).json({ err: "Invalid Expense Name. Only letters and spaces are allowed." });

        // Validate expanceAmount
            if (!expanceAmount || !numberRegex.test(expanceAmount)) return res.status(400).json({ err: "Invalid Expense Amount. Only numeric values are allowed." });

        // Validate expanceDate
        if (!expanceDate || !dateRegex.test(expanceDate)) return res.status(400).json({ err: "Invalid Expense Date. Date should be in 'YYYY-MM-DD' format." });

        if (!expanceCategory || !mongoose.Types.ObjectId.isValid(expanceCategory)) return res.status(400).json({ err: "Invalid Category ID Format" });

        // If there's a file uploaded, use it; otherwise, keep the existing image
        const expanceImage = req.file ? req.file.filename : req.body.expanceImage;

        const updatedData = {
            expanceName,
            expanceAmount,
            expanceDate: new Date(expanceDate), // Ensure the date is formatted
            expanceCategory,
            expanceImage
        };

        const updatedExpance = await ExpanceModel.findByIdAndUpdate(_id, updatedData, { new: true });

        if (!updatedExpance) return res.status(404).json({ err: "Expense not found" });

        return res.status(200).json({ msg: "Expense Updated Successfully", updatedExpance });
    } catch (error) {
        console.log("Error Updating Expance", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
};

// @Request   DELETE
// @Route     http://localhost:5000/api/employee/:id
// @Access    Private
const deleteExpance = async (req, res) => {
    try {
        const _id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({ err: "Invalid ID Format" });

        const deletedExpance = await ExpanceModel.findByIdAndDelete(_id);
        if (!deletedExpance) return res.status(400).json({ err: "Expance Not Found" });

        return res.status(200).json({ msg: "Expance Deleted Successfully", deletedExpance });
    } catch (error) {
        console.log("Error Deleting Expance", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
}

module.exports = { getExpance,getTb1Expance,getTb2Expance, getSingleExpance, createExpance, updateExpance, deleteExpance }