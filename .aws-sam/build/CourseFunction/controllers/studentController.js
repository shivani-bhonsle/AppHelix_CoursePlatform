const db = require("../database/db");

const registerStudent = async (event) => {
  try {
    const student = JSON.parse(event.body);
    console.log(student);
    const query = `INSERT INTO STUDENTS (name, email) VALUES($1, $2)`;
    const res = await db.query(query, [student.name, student.email]);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Student registered successfully" }),
    };
  } catch (error) {
    console.error("Error while resgistering a student", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ errorMsg: "Error while resgistering a student" }),
    };
  }
};

const getStudents = async (event) => {
  try {
    res = await db.query("SELECT * FROM STUDENTS");
    return {
      statusCode: 200,
      body: JSON.stringify({ data: res.rows }),
    };
  } catch (error) {
    console.error("Error while fetching a student", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ errorMsg: "Error while fetching students" }),
    };
  }
};

const getStudentById = async (event) => {
  try {
    let id = event.pathParameters?.id;
    res = await db.query("SELECT * FROM STUDENTS WHERE id = $1", [id]);
    console.log(res.rows);
    return {
      statusCode: 200,
      body: JSON.stringify({ data: res.rows }),
    };
  } catch (error) {
    console.error("Error while fetching a student", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ errorMsg: "Error while fetching student by id" }),
    };
  }
};

const updateStudent = async (event) => {
  try {
    let id = event.pathParameters?.id;
    const student = JSON.parse(event.body);
    console.log(student);
    res = await db.query(
      `UPDATE students SET name = $1, email = $2 WHERE id = $3`,
      [student.name, student.email, id]
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Student updated successfully" }),
    };
  } catch (error) {
    console.error("Error while updating a student", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ errorMsg: "Error while updating student" }),
    };
  }
};

const deleteStudent = async (event) => {
  try {
    let id = event.pathParameters?.id;
    res = await db.query(`DELETE FROM students WHERE id = $1`, [id]);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Student deleted successfully" }),
    };
  } catch (error) {
    console.error("Error while deleting a student", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ errorMsg: "Error while deleting student" }),
    };
  }
};

module.exports = {
  registerStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
