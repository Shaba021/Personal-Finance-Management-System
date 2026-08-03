const xlsx  = require('xlsx');
const Income = require("../models/Income")
const { Types } = require("mongoose");
const predictNextMonth = require("../utils/forecastUtil");

// Add Income Source
exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body;

        //Validation: Check for missing fields
        if(!source || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });

        await newIncome.save();
        res.status(200).json(newIncome);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get All Income Source
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id; 
    try{
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.json(income);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete Income Source
exports.deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: "Income deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get income forecast for next month
exports.getIncomeForecast = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        const monthlyData = await Income.aggregate([
            { $match: { userId: userObjectId } },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                    },
                    total: { $sum: "$amount" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const monthlyTotals = monthlyData.map((item) => item.total);

        if (monthlyTotals.length < 2) {
            return res.status(400).json({
                message: "Need at least 2 months of income data to forecast",
            });
        }

        const { predictedNextMonth, trendSlope } = predictNextMonth(monthlyTotals);

        res.json({
            history: monthlyData,
            prediction: predictedNextMonth,
            trend: trendSlope,
        });
    } catch (error) {
        console.error("Forecast error:", error.message);
        res.status(500).json({ message: "Forecast failed", error: error.message });
    }
};

// Download Excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });

        //Prepare data form Excel
        const data = income.map((item) => ({
            Source: item.source, 
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, 'income_details.xlsx');
        res.download('income_details.xlsx');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};