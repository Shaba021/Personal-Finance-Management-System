const CATEGORY_KEYWORDS = {
    "Groceries": ["fruits", "vegetables", "milk", "grocery", "groceries", "bigbasket", "blinkit", "vegetable", "fruit"],
    "Food & Dining": ["tea", "coffee", "restaurant", "lunch", "dinner", "breakfast", "swiggy", "zomato", "cafe", "snacks"],
    "Transport": ["uber", "ola", "cab", "petrol", "fuel", "bus", "metro", "auto", "train", "flight"],
    "Rent": ["rent", "landlord", "housing"],
    "Utilities": ["electricity", "wifi", "internet", "water bill", "recharge", "gas bill", "phone bill"],
    "Entertainment": ["movie", "netflix", "spotify", "game", "concert", "prime video", "hotstar"],
    "Shopping": ["amazon", "flipkart", "clothes", "shoes", "myntra", "shopping"],
    "Healthcare": ["medicine", "doctor", "hospital", "pharmacy", "medical"],
    "Education": ["course", "book", "tuition", "fees", "udemy", "books", "stationery"],
};

const categorizeExpense = (description) => {
    if (!description) return "Other";
    const text = description.toLowerCase().trim();

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some((keyword) => text.includes(keyword))) {
            return category;
        }
    }

    return "Other";
};

module.exports = categorizeExpense;