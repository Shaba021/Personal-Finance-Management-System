// Simple linear regression: given y-values (monthly totals),
// predicts the next value in the sequence.
const predictNextMonth = (monthlyTotals) => {
    const n = monthlyTotals.length;

    // x = [0, 1, 2, ...], y = monthlyTotals
    const xValues = Array.from({ length: n }, (_, i) => i);
    const yValues = monthlyTotals;

    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);

    // Standard least-squares formulas for slope (m) and intercept (b)
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const nextX = n; // next month's index
    const prediction = slope * nextX + intercept;

    return {
        predictedNextMonth: Math.max(0, Math.round(prediction * 100) / 100),
        trendSlope: Math.round(slope * 100) / 100,
    };
};

module.exports = predictNextMonth;