const {
    getDashboardStats,
    getUpcomingAppointments
} = require('../services/dashboardService');

const getStats = async (req, res, next) => {
    try {
        const stats = await getDashboardStats();

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

const getUpcoming = async (req, res, next) => {
    try {
        const appointments = await getUpcomingAppointments();

        res.status(200).json({
            success: true,
            data: appointments
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStats,
    getUpcoming
};