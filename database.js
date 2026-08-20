const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function initializeDatabase() {
    try {

        const connection =
            await pool.getConnection();

        console.log(
            "✅ Connected to MySQL database."
        );

        // =========================
        // EVENTS TABLE
        // =========================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS events (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                date VARCHAR(100) NOT NULL,
                time VARCHAR(100) NOT NULL,
                location VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                createdBy VARCHAR(255) NOT NULL,
                createdAt DATETIME NOT NULL
            )
        `);

        // =========================
        // EVENT PARTICIPANTS TABLE
        // =========================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS event_participants (
                eventId VARCHAR(50) NOT NULL,
                userId VARCHAR(255) NOT NULL,
                joinedAt DATETIME NOT NULL,

                PRIMARY KEY (
                    eventId,
                    userId
                ),

                FOREIGN KEY (
                    eventId
                )
                REFERENCES events(id)
                ON DELETE CASCADE
            )
        `);

        // =========================
        // REPORTS TABLE
        // =========================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS reports (
                id VARCHAR(50) PRIMARY KEY,
                reporterId VARCHAR(255) NOT NULL,
                reportedUserId VARCHAR(255) NOT NULL,
                reason TEXT NOT NULL,
                priority VARCHAR(50) NOT NULL,
                status VARCHAR(50) NOT NULL DEFAULT 'unclaimed',
                claimedBy VARCHAR(255) NULL,
                createdAt DATETIME NOT NULL,
                closedAt DATETIME NULL,
                closedBy VARCHAR(255) NULL
            )
        `);

        connection.release();

        console.log(
            "✅ Events table is ready."
        );

        console.log(
            "✅ Event participants table is ready."
        );

        console.log(
            "✅ Reports table is ready."
        );

    } catch (error) {

        console.error(
            "❌ MySQL connection failed:",
            error
        );

        throw error;
    }
}

module.exports = {
    pool,
    initializeDatabase
};