const express = require('express');
const router = express.Router();
const Task = require('../Models/task');
const Finance = require('../Models/finance');

router.get('/', async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        // Tasks Analysis
        const tasksThisMonth = await Task.countDocuments({
            startDate: { $lte: endOfMonth },
            endDate: { $gte: startOfMonth }
        });

        const tasksLastMonth = await Task.countDocuments({
            startDate: { $lte: endOfLastMonth },
            endDate: { $gte: startOfLastMonth }
        });

        const totalTasksThisYear = await Task.countDocuments({
            startDate: { $gte: startOfYear },
            endDate: { $lte: endOfMonth }
        });

        // Finance Analysis
        const financeThisMonth = await Finance.aggregate([
            {
                $match: {
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: '$status',
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const financeLastMonth = await Finance.aggregate([
            {
                $match: {
                    date: { $gte: startOfLastMonth, $lte: endOfLastMonth }
                }
            },
            {
                $group: {
                    _id: '$status',
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const financeThisYear = await Finance.aggregate([
            {
                $match: {
                    date: { $gte: startOfYear, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: '$status',
                    total: { $sum: '$amount' }
                }
            }
        ]);

        // Process data for response
        const thisMonthPaid = financeThisMonth.find(f => f._id === 'paid')?.total || 0;
        const thisMonthUnpaid = financeThisMonth.find(f => f._id === 'unpaid')?.total || 0;
        const lastMonthPaid = financeLastMonth.find(f => f._id === 'paid')?.total || 0;
        const lastMonthUnpaid = financeLastMonth.find(f => f._id === 'unpaid')?.total || 0;
        const yearTotalPaid = financeThisYear.find(f => f._id === 'paid')?.total || 0;
        const yearTotalUnpaid = financeThisYear.find(f => f._id === 'unpaid')?.total || 0;

        // Calculate percentages
        const taskPercentage = calculatePercentageChange(tasksLastMonth, tasksThisMonth);
        const totalFinancePercentage = calculatePercentageChange(
            lastMonthPaid + lastMonthUnpaid,
            thisMonthPaid + thisMonthUnpaid
        );
        const paidPercentage = calculatePercentageChange(lastMonthPaid, thisMonthPaid);
        const unpaidPercentage = calculatePercentageChange(lastMonthUnpaid, thisMonthUnpaid);

        const analytics = [
            {
                title: 'Total Tasks',
                amount: tasksThisMonth.toString(),
                background: 'bg-light-primary',
                border: 'border-primary',
                icon: taskPercentage >= 0 ? 'rise' : 'fall',
                percentage: `${Math.abs(taskPercentage).toFixed(1)}%`,
                color: taskPercentage >= 0 ? 'text-primary' : 'text-warning',
                number: totalTasksThisYear.toString()
            },
            {
                title: 'Total Amount',
                amount: `$${(thisMonthPaid + thisMonthUnpaid).toFixed(2)}`,
                background: 'bg-light-primary',
                border: 'border-primary',
                icon: totalFinancePercentage >= 0 ? 'rise' : 'fall',
                percentage: `${Math.abs(totalFinancePercentage).toFixed(1)}%`,
                color: totalFinancePercentage >= 0 ? 'text-primary' : 'text-warning',
                number: `$${(yearTotalPaid + yearTotalUnpaid).toFixed(2)}`
            },
            {
                title: 'Paid Amount',
                amount: `$${thisMonthPaid.toFixed(2)}`,
                background: 'bg-light-warning',
                border: 'border-warning',
                icon: paidPercentage >= 0 ? 'rise' : 'fall',
                percentage: `${Math.abs(paidPercentage).toFixed(1)}%`,
                color: paidPercentage >= 0 ? 'text-primary' : 'text-warning',
                number: `$${yearTotalPaid.toFixed(2)}`
            },
            {
                title: 'Unpaid Amount',
                amount: `$${thisMonthUnpaid.toFixed(2)}`,
                background: 'bg-light-warning',
                border: 'border-warning',
                icon: unpaidPercentage >= 0 ? 'rise' : 'fall',
                percentage: `${Math.abs(unpaidPercentage).toFixed(1)}%`,
                color: unpaidPercentage >= 0 ? 'text-primary' : 'text-warning',
                number: `$${yearTotalUnpaid.toFixed(2)}`
            }
        ];

        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

function calculatePercentageChange(oldValue, newValue) {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / oldValue) * 100;
}

router.get('/monthly-statistics', async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        
        // Get monthly task counts
        const monthlyTasks = await Task.aggregate([
            {
                $match: {
                    startDate: {
                        $gte: new Date(year, 0, 1),
                        $lt: new Date(year + 1, 0, 1)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$startDate" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Get monthly paid amounts
        const monthlyPaidAmounts = await Finance.aggregate([
            {
                $match: {
                    status: 'paid',
                    date: {
                        $gte: new Date(year, 0, 1),
                        $lt: new Date(year + 1, 0, 1)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$date" },
                    total: { $sum: "$amount" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Fill in missing months with zeros
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        const taskData = months.map(month => ({
            month: month,
            count: monthlyTasks.find(item => item._id === month)?.count || 0
        }));

        const paidData = months.map(month => ({
            month: month,
            amount: monthlyPaidAmounts.find(item => item._id === month)?.total || 0
        }));

        // Get weekly data for current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const weeklyTasks = await Task.aggregate([
            {
                $match: {
                    startDate: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$startDate" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const weeklyPaidAmounts = await Finance.aggregate([
            {
                $match: {
                    status: 'paid',
                    date: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$date" },
                    total: { $sum: "$amount" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json({
            monthly: {
                tasks: taskData.map(d => d.count),
                paid: paidData.map(d => d.amount)
            },
            weekly: {
                tasks: Array.from({ length: 7 }, (_, i) => 
                    weeklyTasks.find(item => item._id === i + 1)?.count || 0
                ),
                paid: Array.from({ length: 7 }, (_, i) => 
                    weeklyPaidAmounts.find(item => item._id === i + 1)?.total || 0
                )
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/monthly-stats', async (req, res) => {
    try {
        // Get current date info
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        // Get weekly total
        const weeklyStats = await Finance.aggregate([
            {
                $match: {
                    date: {
                        $gte: startOfWeek,
                        $lte: endOfWeek
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        // Get monthly data
        const monthlyStats = await Finance.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(now.getFullYear(), 0, 1),
                        $lte: new Date(now.getFullYear(), 11, 31)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$date' },
                        status: '$status'
                    },
                    total: { $sum: '$amount' }
                }
            },
            {
                $sort: {
                    '_id.month': 1
                }
            }
        ]);

        // Process monthly data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const paidData = new Array(12).fill(0);
        const unpaidData = new Array(12).fill(0);

        monthlyStats.forEach(stat => {
            const monthIndex = stat._id.month - 1;
            if (stat._id.status === 'paid') {
                paidData[monthIndex] = Math.round(stat.total);
            } else {
                unpaidData[monthIndex] = Math.round(stat.total);
            }
        });

        const response = {
            series: [
                {
                    name: 'Paid Amount',
                    data: paidData
                },
                {
                    name: 'Unpaid Amount',
                    data: unpaidData
                }
            ],
            categories: months,
            weeklyTotal: weeklyStats[0]?.total || 0
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;