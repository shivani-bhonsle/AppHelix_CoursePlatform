const {
  getAllCourses,
  addCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("./controllers/courseController");
const {
  getStudents,
  registerStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("./controllers/studentController");
const db = require("./database/db");

const handler = async (event) => {
  try {
    const res = await db.query("SELECT current_database()");
    return {
      statusCode: 200,
      body: JSON.stringify({ database: res.rows[0].current_database }),
    };
  } catch (err) {
    console.error("Error while connecting to db:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Database query failed: ${err}` }),
    };
  }
};

const studentRouterHandler = (event) => {
  if (event.httpMethod === "GET" && event.path === "/student") {
    return getStudents(event);
  } else if (event.httpMethod === "POST" && event.path === "/student") {
    return registerStudent(event);
  } else if (event.httpMethod === "GET" && event.resource === "/student/{id}") {
    return getStudentById(event);
  } else if (event.httpMethod === "PUT" && event.resource === "/student/{id}") {
    return updateStudent(event);
  } else if (
    event.httpMethod === "DELETE" &&
    event.resource === "/student/{id}"
  ) {
    return deleteStudent(event);
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Not Found" }),
    };
  }
};

const courseRouterHandler = (event) => {
  if (event.httpMethod === "GET" && event.path === "/course") {
    return getAllCourses(event);
  } else if (event.httpMethod === "POST" && event.path === "/course") {
    return addCourse(event);
  } else if (event.httpMethod === "GET" && event.resource === "/course/{id}") {
    return getCourseById(event);
  } else if (event.httpMethod === "PUT" && event.resource === "/course/{id}") {
    return updateCourse(event);
  } else if (
    event.httpMethod === "DELETE" &&
    event.resource === "/course/{id}"
  ) {
    return deleteCourse(event);
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Not Found" }),
    };
  }
};

module.exports = { handler, studentRouterHandler, courseRouterHandler };
