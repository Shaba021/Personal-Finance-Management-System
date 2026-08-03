const { Types } = require("mongoose");

const xlsx  = require('xlsx');
const Expense = require("../models/Expense")
const predictNextMonth = require("../utils/forecastUtil");
const categorizeExpense = require("../utils/categorize");   

// Add Expense Source
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, description, amount, date } = req.body;

        if(!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            description,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get All Expense Source
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id; 
    try{
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get expense breakdown by category (this month)
exports.getExpenseByCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        const breakdown = await Expense.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
                },
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" },
                },
            },
            { $sort: { total: -1 } },
        ]);

        res.json({ breakdown });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Suggest a category based on typed description
exports.suggestCategory = async (req, res) => {
    try {
        const { description } = req.body;

        if (!description || !description.trim()) {
            return res.status(400).json({ message: "Description is required" });
        }

        const category = categorizeExpense(description);
        res.json({ category });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get expense forecast for next month
exports.getExpenseForecast = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        const monthlyData = await Expense.aggregate([
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
                message: "Need at least 2 months of expense data to forecast",
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

// Delete Expense Source
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Download Excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        const data = expense.map((item) => ({
            Category: item.category, 
            Description: item.description,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, 'expense_details.xlsx');
        res.download('expense_details.xlsx');
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};