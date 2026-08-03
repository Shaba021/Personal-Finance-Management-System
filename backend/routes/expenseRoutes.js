const express = require("express");
const {
    addExpense,
    getAllExpense,
    deleteExpense,
    downloadExpenseExcel,
    getExpenseByCategory,
    getExpenseForecast,
    suggestCategory,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpense);
router.get("/by-category", protect, getExpenseByCategory);
router.get("/forecast", protect, getExpenseForecast);
router.get("/downloadexcel", protect, downloadExpenseExcel);
router.delete("/:id", protect, deleteExpense);
router.post("/suggest-category", protect, suggestCategory);

module.exports = router;