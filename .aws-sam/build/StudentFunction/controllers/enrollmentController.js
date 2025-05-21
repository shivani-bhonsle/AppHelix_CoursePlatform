const db = require("../database/db");

const enroll = async (event) => {
  try {
    const body = JSON.parse(event.body);
    let result = await db.query("SELECT * FROM STUDENTS WHERE id = $1", [
      body.studentId,
    ]);
    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Student not found" }),
      };
    }

    result = await db.query("SELECT * FROM COURSES WHERE id = $1", [
      body.courseId,
    ]);
    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Course not found" }),
      };
    }

    const query = `INSERT INTO ENROLLMENTS (student_id, course_id, status) VALUES ($1, $2, $3)`;
    const res = await db.query(query, [
      body.studentId,
      body.courseId,
      "In-Progress",
    ]);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Student enrolled successfully" }),
    };
  } catch (error) {
    console.error("Error while enrolling a student", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ errorMsg: "Error while enrolling a student" }),
    };
  }
};

const markCompletion = async (event) => {
  try {
    const body = JSON.parse(event.body);
    let result = await db.query("SELECT * FROM STUDENTS WHERE id = $1", [
      body.studentId,
    ]);
    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Student not found" }),
      };
    }

    result = await db.query("SELECT * FROM COURSES WHERE id = $1", [
      body.courseId,
    ]);
    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Course not found" }),
      };
    }

    const query = `UPDATE ENROLLMENTS SET student_id=$1, course_id=$2,status=$3 WHERE course_id=$4 `;
    const res = await db.query(query, [
      body.studentId,
      body.courseId,
      body.status,
      body.courseId,
    ]);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Course marked completed!" }),
    };
  } catch (error) {
    console.error("Error while marking course", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ errorMsg: "Error while marking course" }),
    };
  }
};

const listEnrollment = async (event) => {
  try {
    const results = await db.query("SELECT * FROM ENROLLMENTS");
    return {
      statusCode: 200,
      body: JSON.stringify({ data: results.rows }),
    };
  } catch (error) {
    console.error("Error while fetching entrollments", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ errorMsg: "Error while fetching entrollments" }),
    };
  }
};

module.exports = {
  enroll,
  markCompletion,
  listEnrollment,
};
