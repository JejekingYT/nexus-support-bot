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

        const connection = await pool.getConnection();

        console.log("✅ Connected to MySQL database.");

        // =========================
        // EVENTS TABLE
        // =========================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS events (
                id VARCHAR(20) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                date VARCHAR(100) NOT NULL,
                time VARCHAR(100) NOT NULL,
                location VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                createdBy VARCHAR(255) NOT NULL,
                createdAt DATETIME NOT NULL
            )
        `);

        console.log("✅ Events table is ready.");

        // =========================
        // REPORT COUNTER TABLE
        // =========================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS report_counter (
                id INT PRIMARY KEY,
                lastReport INT NOT NULL
            )
        `);

        await connection.query(`
            INSERT IGNORE INTO report_counter (
                id,
                lastReport
            )
            VALUES (1, 0)
        `);

        console.log("✅ Report counter is ready.");

        connection.release();

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