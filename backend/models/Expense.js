const mongoose = require("mongoose");

const ExpneseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", requred: true },
    icon: { type: String },
    category: { type: String, required: true }, // Example: Food, Rent, Groceries
    description: { type: String, default: "" }, // Example: Fruits, Uber ride, Milk
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Expense", ExpneseSchema);