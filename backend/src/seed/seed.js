const db = require('../config/database');
require('dotenv').config();

const doctors = [
    {
        name: 'Dr. Ahmed Khan',
        specialization: 'General Dentistry',
        phone: '03001234567',
        email: 'ahmed.khan@dentalclinic.com',
        availability: 'Mon-Fri, 09:00 AM - 02:00 PM',
        is_active: true
    },
    {
        name: 'Dr. Sarah Malik',
        specialization: 'Orthodontics',
        phone: '03012345678',
        email: 'sarah.malik@dentalclinic.com',
        availability: 'Mon-Wed, 10:00 AM - 04:00 PM',
        is_active: true
    },
    {
        name: 'Dr. Hamza Ali',
        specialization: 'Endodontics',
        phone: '03023456789',
        email: 'hamza.ali@dentalclinic.com',
        availability: 'Tue-Thu, 11:00 AM - 05:00 PM',
        is_active: true
    },
    {
        name: 'Dr. Ayesha Noor',
        specialization: 'Pediatric Dentistry',
        phone: '03034567890',
        email: 'ayesha.noor@dentalclinic.com',
        availability: 'Mon-Fri, 09:00 AM - 01:00 PM',
        is_active: true
    }
];

const appointments = [
    {
        patient_name: 'Ali Raza',
        patient_contact: '03111234567',
        doctor_email: 'ahmed.khan@dentalclinic.com',
        appointment_date: '2026-10-05 10:00:00',
        reason: 'Routine dental checkup',
        status: 'pending'
    },
    {
        patient_name: 'Fatima Zahra',
        patient_contact: '03221234567',
        doctor_email: 'sarah.malik@dentalclinic.com',
        appointment_date: '2026-10-05 11:30:00',
        reason: 'Braces consultation',
        status: 'confirmed'
    },
    {
        patient_name: 'Usman Tariq',
        patient_contact: '03331234567',
        doctor_email: 'hamza.ali@dentalclinic.com',
        appointment_date: '2026-10-06 12:00:00',
        reason: 'Root canal consultation',
        status: 'pending'
    },
    {
        patient_name: 'Hina Shah',
        patient_contact: '03441234567',
        doctor_email: 'ayesha.noor@dentalclinic.com',
        appointment_date: '2026-10-06 10:30:00',
        reason: 'Child dental examination',
        status: 'confirmed'
    }
];

async function seedDatabase() {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        console.log('Starting database seed...');

        // -----------------------------------
        // 1. Insert doctors
        // -----------------------------------

        for (const doctor of doctors) {
            const [existingDoctor] = await connection.query(
                'SELECT id FROM doctors WHERE email = ? LIMIT 1',
                [doctor.email]
            );

            if (existingDoctor.length === 0) {
                await connection.query(
                    `INSERT INTO doctors
                    (name, specialization, phone, email, availability, is_active)
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        doctor.name,
                        doctor.specialization,
                        doctor.phone,
                        doctor.email,
                        doctor.availability,
                        doctor.is_active
                    ]
                );

                console.log(`Doctor inserted: ${doctor.name}`);
            } else {
                console.log(`Doctor already exists: ${doctor.name}`);
            }
        }

        // -----------------------------------
        // 2. Insert appointments
        // -----------------------------------

        for (const appointment of appointments) {
            const [doctorRows] = await connection.query(
                'SELECT id FROM doctors WHERE email = ? LIMIT 1',
                [appointment.doctor_email]
            );

            if (doctorRows.length === 0) {
                throw new Error(
                    `Doctor not found: ${appointment.doctor_email}`
                );
            }

            const doctorId = doctorRows[0].id;

            // Prevent duplicate appointment
            const [existingAppointment] = await connection.query(
                `SELECT id
                 FROM appointments
                 WHERE doctor_id = ?
                 AND appointment_date = ?
                 AND patient_name = ?
                 LIMIT 1`,
                [
                    doctorId,
                    appointment.appointment_date,
                    appointment.patient_name
                ]
            );

            if (existingAppointment.length === 0) {
                await connection.query(
                    `INSERT INTO appointments
                    (
                        patient_name,
                        patient_contact,
                        doctor_id,
                        appointment_date,
                        reason,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        appointment.patient_name,
                        appointment.patient_contact,
                        doctorId,
                        appointment.appointment_date,
                        appointment.reason,
                        appointment.status
                    ]
                );

                console.log(
                    `Appointment inserted for ${appointment.patient_name}`
                );
            } else {
                console.log(
                    `Appointment already exists for ${appointment.patient_name}`
                );
            }
        }

        await connection.commit();

        console.log('-----------------------------------');
        console.log('Database seed completed successfully.');
        console.log('-----------------------------------');

    } catch (error) {
        await connection.rollback();

        console.error('Database seed failed.');
        console.error(error);

        process.exitCode = 1;
    } finally {
        connection.release();
    }
}

seedDatabase();