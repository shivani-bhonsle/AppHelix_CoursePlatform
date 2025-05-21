const db = require("../database/db");

const addCourse = async (event) => {
  const client = await db.connect();
  try {
    client.query("BEGIN");
    const body = JSON.parse(event.body);

    const courseValues = [
      body.title,
      body.description,
      body.authorName,
      body.authorEmail,
      body.isbn,
      body.standard,
    ];
    const insertQuery = ` INSERT INTO COURSES (title, description, author_name, author_email, isbn, standard)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING id`;
    const courseRes = await client.query(insertQuery, courseValues);

    const courseId = courseRes.rows[0].id;
    const insertChapterQuery = `INSERT INTO chapters (title, description, course_id) VALUES ($1, $2, $3)`;
    for (const chapter of body.chapters) {
      await client.query(insertChapterQuery, [
        chapter.title,
        chapter.description,
        courseId,
      ]);
    }
    client.query("COMMIT");
    return {
      statusCode: 200,
      body: JSON.stringify({ rowsAffected: courseRes.rowCount }),
    };
  } catch (error) {
    client.query("ROLLBACK");
    console.log("Error while adding course", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error while adding course" }),
    };
  } finally {
    client.release();
  }
};

const getAllCourses = async (event) => {
  try {
    const query = `
      SELECT 
        c.id AS course_id,
        c.title AS course_title,
        c.description AS course_description,
        c.author_name,
        c.author_email,
        c.isbn,
        c.standard,
        ch.id AS chapter_id,
        ch.title AS chapter_title,
        ch.description AS chapter_description
      FROM COURSES c
      INNER JOIN CHAPTERS ch ON c.id = ch.course_id
    `;

    const res = await db.query(query);

    const coursesMap = {};
    res.rows.forEach((row) => {
      const courseId = row.course_id;
      if (!coursesMap[courseId]) {
        coursesMap[courseId] = {
          id: courseId,
          title: row.course_title,
          description: row.course_description,
          author_name: row.author_name,
          author_email: row.author_email,
          isbn: row.isbn,
          standard: row.standard,
          chapters: [],
        };
      }
      coursesMap[courseId].chapters.push({
        id: row.chapter_id,
        title: row.chapter_title,
        description: row.chapter_description,
      });
    });

    const groupedCourses = Object.values(coursesMap);

    return {
      statusCode: 200,
      body: JSON.stringify({ data: groupedCourses }),
    };
  } catch (error) {
    console.error("Error while fetching courses", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ errorMsg: "Error while fetching courses" }),
    };
  }
};

const getCourseById = async (event) => {
  try {
    const courseId = event.pathParameters?.id;
    const query = `
      SELECT 
        c.id AS course_id,
        c.title AS course_title,
        c.description AS course_description,
        c.author_name,
        c.author_email,
        c.isbn,
        c.standard,
        ch.id AS chapter_id,
        ch.title AS chapter_title,
        ch.description AS chapter_description
      FROM COURSES c
      INNER JOIN CHAPTERS ch ON c.id = ch.course_id
      WHERE c.id = $1
    `;

    const res = await db.query(query, [courseId]);

    const coursesMap = {};
    res.rows.forEach((row) => {
      const courseId = row.course_id;
      if (!coursesMap[courseId]) {
        coursesMap[courseId] = {
          id: courseId,
          title: row.course_title,
          description: row.course_description,
          author_name: row.author_name,
          author_email: row.author_email,
          isbn: row.isbn,
          standard: row.standard,
          chapters: [],
        };
      }
      coursesMap[courseId].chapters.push({
        id: row.chapter_id,
        title: row.chapter_title,
        description: row.chapter_description,
      });
    });

    const course = Object.values(coursesMap);

    return {
      statusCode: 200,
      body: JSON.stringify({ data: course }),
    };
  } catch (error) {
    console.error("Error while fetching courses", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ errorMsg: "Error while fetching courses" }),
    };
  }
};

const updateCourse = async (event) => {
  const client = await db.connect();
  try {
    client.query("BEGIN");
    const body = JSON.parse(event.body);
    const courseId = event.pathParameters?.id;

    const result = await db.query("SELECT * FROM COURSES WHERE id = $1", [
      courseId,
    ]);

    if (result.rows.length === 0) {
      client.query("ROLLBACK");
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Course not found" }),
      };
    }

    const courseRes = await client.query(
      `UPDATE COURSES SET title=$1,description = $2,author_name = $3,author_email = $4,isbn = $5, standard=$6 WHERE id = $7`,
      [
        body.title,
        body.description,
        body.authorName,
        body.authorEmail,
        body.isbn,
        body.standard,
        courseId,
      ]
    );
    const updateChaptersQuery = `UPDATE CHAPTERS SET title=$1,description = $2 WHERE course_id = $3`;
    for (const chapter of body.chapters) {
      await client.query(updateChaptersQuery, [
        chapter.title,
        chapter.description,
        courseId,
      ]);
    }
    client.query("COMMIT");
    return {
      statusCode: 200,
      body: JSON.stringify({ rowsAffected: courseRes.rowCount }),
    };
  } catch (error) {
    client.query("ROLLBACK");
    console.log("Error while updating course", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error while updating course" }),
    };
  } finally {
    client.release();
  }
};

const deleteCourse = async (event) => {
  const client = await db.connect();
  try {
    client.query("BEGIN");
    const courseId = event.pathParameters?.id;
    const result = await db.query("SELECT * FROM COURSES WHERE id = $1", [
      courseId,
    ]);

    if (result.rows.length === 0) {
      client.query("ROLLBACK");
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Course not found" }),
      };
    }
    await client.query(`DELETE FROM COURSES WHERE id = $1`, [courseId]);
    await client.query(`DELETE FROM CHAPTERS WHERE course_id = $1`, [courseId]);
    client.query("COMMIT");
    return {
      statusCode: 200,
      body: JSON.stringify({ rowsAffected: "Course Deleted successfully!" }),
    };
  } catch (error) {
    client.query("ROLLBACK");
    console.log("Error while deleting course", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error while deleting course" }),
    };
  } finally {
    client.release();
  }
};

module.exports = {
  addCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
