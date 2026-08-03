import React, { useEffect, useState } from 'react';
import { LuTrendingUp, LuTrendingDown } from 'react-icons/lu';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const IncomeForecast = () => {
    const [forecast, setForecast] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchForecast = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(API_PATHS.INCOME.FORECAST);
            setForecast(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Couldn't generate forecast");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchForecast();
        return () => {};
    }, []);

    if (loading) return null;

    return (
        <div className='card'>
            <h5 className='text-lg mb-4'>Next Month Income Forecast</h5>

            {error ? (
                <p className='text-sm text-gray-400'>{error}</p>
            ) : forecast ? (
                <div className='flex items-center justify-between'>
                    <div>
                        <p className='text-2xl font-semibold text-gray-800'>
                            {"\u20B9"}{forecast.prediction}
                        </p>
                        <p className='text-xs text-gray-400 mt-1'>
                            Predicted income based on your last {forecast.history.length} months
                        </p>
                    </div>

                    <div
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium ${
                            forecast.trend >= 0
                                ? "bg-green-50 text-green-500"
                                : "bg-red-50 text-red-500"
                        }`}
                    >
                        {forecast.trend >= 0 ? <LuTrendingUp /> : <LuTrendingDown />}
                        {"\u20B9"}{Math.abs(forecast.trend)}/mo
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default IncomeForecast;