import React, { useState } from 'react';
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    description: "",
    category: "",
    amount: "",
    date: "",
    icon: "",
  });

  const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

  const handleAutoDetect = async () => {
    if (!expense.description.trim()) {
      toast.error("Type what you spent on first, like 'fruits' or 'uber'");
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.EXPENSE.SUGGEST_CATEGORY, {
        description: expense.description,
      });
      handleChange("category", response.data.category);
      toast.success(`Categorized as: ${response.data.category}`);
    } catch (error) {
      toast.error("Couldn't detect category");
    }
  };

  return (
    <div>
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={expense.description}
        onChange={({ target }) => handleChange("description", target.value)}
        label="What did you spend on?"
        placeholder="Fruits, Uber ride, Rent, etc"
        type="text"
      />

      <div className='flex items-end gap-2'>
        <div className='flex-1'>
          <Input
            value={expense.category}
            onChange={({ target }) => handleChange("category", target.value)}
            label="Category"
            placeholder="Auto-detected or type manually"
            type="text"
          />
        </div>

        <button
          type="button"
          onClick={handleAutoDetect}
          className='add-btn mb-4'
        >
          ✨ Detect
        </button>
      </div>

      <Input 
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder=""
        type="number"
      />

      <Input 
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />

      <div className='flex justify-end mt-6'>
        <button 
          type="button"
          className='add-btn add-btn-fill'
          onClick={() => onAddExpense(expense)}
        >
          Add Expense
        </button>
      </div>
    </div>
  )
}

export default AddExpenseForm