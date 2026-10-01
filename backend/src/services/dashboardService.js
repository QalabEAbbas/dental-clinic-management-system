const db = require('../config/database');

const getDashboardStats = async () => {
    const [doctorRows] = await db.query(`
        SELECT COUNT(*) AS total_doctors
        FROM doctors
        WHERE is_active = TRUE
    `);

    const [upcomingRows] = await db.query(`
        SELECT COUNT(*) AS upcoming_appointments
        FROM appointments
        WHERE appointment_date >= NOW()
        AND status IN ('pending', 'confirmed')
    `);

    const [todayRows] = await db.query(`
        SELECT COUNT(*) AS today_appointments
        FROM appointments
        WHERE DATE(appointment_date) = CURDATE()
        AND status != 'cancelled'
    `);

    const [pendingRows] = await db.query(`
        SELECT COUNT(*) AS pending_appointments
        FROM appointments
        WHERE status = 'pending'
    `);

    return {
        total_doctors: doctorRows[0].total_doctors,
        upcoming_appointments: upcomingRows[0].upcoming_appointments,
        today_appointments: todayRows[0].today_appointments,
        pending_appointments: pendingRows[0].pending_appointments
    };
};

const getUpcomingAppointments = async () => {
    const [rows] = await db.query(`
        SELECT
            a.id,
            a.patient_name,
            a.patient_contact,
            a.doctor_id,
            d.name AS doctor_name,
            d.specialization,
            a.appointment_date,
            a.reason,
            a.status
        FROM appointments a
        INNER JOIN doctors d
            ON a.doctor_id = d.id
        WHERE a.appointment_date >= NOW()
        AND a.status != 'cancelled'
        ORDER BY a.appointment_date ASC
        LIMIT 10
    `);

    return rows;
};

module.exports = {
    getDashboardStats,
    getUpcomingAppointments
};