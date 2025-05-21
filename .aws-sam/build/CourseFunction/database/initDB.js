const db = require("./db");

const createTables = async () => {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS students(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE
    );
        `);
    await db.query(`CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        author_name VARCHAR(100),
        author_email VARCHAR(100),
        standard VARCHAR(50),
        isbn VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `);
    await db.query(`CREATE TABLE IF NOT EXISTS chapters (
        id SERIAL PRIMARY KEY,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        title VARCHAR(200),
        description TEXT
            );
    `);
    await db.query(`CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
    console.log("Tables created successfully!");
  } catch (err) {
    console.error("Error while creating the tables", err);
  }
};

module.exports = createTables;
