import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const COLORS = ["#6366F1", "#FA2C37", "#FF6900", "#4f39f5", "#00b8a3", "#f59e0b"];

const ExpenseCategoryBreakdown = () => {
    const [breakdown, setBreakdown] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchBreakdown = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.EXPENSE.BY_CATEGORY);
            setBreakdown(response.data?.breakdown || []);
        } catch (error) {
            console.error("Error fetching category breakdown:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBreakdown();
        return () => {};
    }, []);

    const total = breakdown.reduce((sum, item) => sum + item.total, 0);

    return (
        <div className='card'>
            <h5 className='text-lg mb-4'>Spending by Category (Last 30 Days)</h5>

            {breakdown.length === 0 ? (
                <p className='text-sm text-gray-400'>No expenses in the last 30 days.</p>
            ) : (
                <div className='space-y-4'>
                    {breakdown.map((item, index) => {
                        const percentage = total > 0 ? (item.total / total) * 100 : 0;
                        return (
                            <div key={item._id}>
                                <div className='flex justify-between items-center mb-1'>
                                    <span className='text-sm text-gray-700 font-medium'>{item._id}</span>
                                    <span className='text-sm text-gray-500'>{"\u20B9"}{item.total}</span>
                                </div>
                                <div className='w-full bg-gray-100 rounded-full h-2'>
                                    <div
                                        className='h-2 rounded-full'
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: COLORS[index % COLORS.length],
                                        }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ExpenseCategoryBreakdown;