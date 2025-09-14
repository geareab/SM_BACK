const pool = require('../config/database');

class User {
    constructor(email, password, username) {
        this.email = email;
        this.password = password;
        this.username = username;
    }

    // Create a new user
    static async create(email, password, username) {
        const query = 'INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *';
        const values = [email, password, username];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get user by ID
    static async findById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const values = [id];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get user by username
    static async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = $1';
        const values = [username];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get user by email
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const values = [email];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Update user
    static async update(id, email, password, username) {
        const query = 'UPDATE users SET email = $1, password = $2, username = $3 WHERE id = $4 RETURNING *';
        const values = [email, password, username, id];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Delete user
    static async delete(id) {
        const query = 'DELETE FROM users WHERE id = $1';
        const values = [id];

        try {
            const result = await pool.query(query, values);
            return result.rowCount > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;
