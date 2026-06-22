/**
 * Aegis | Student Management System (REST API Service Layer)
 * Version 3.0: Database-Backed Client REST Service
 */

const API_BASE = 'http://localhost:8080';

const APIService = {
  // Helper to handle and parse backend API responses
  async _handleResponse(response) {
    if (!response.ok) {
      const errText = await response.text();
      let errMsg = "An error occurred on the server.";
      try {
        const errJson = JSON.parse(errText);
        errMsg = errJson.message || errMsg;
      } catch (e) {
        if (errText) errMsg = errText;
      }
      throw new Error(errMsg);
    }
    return response.json();
  },

  // STUDENT ENDPOINTS
  async getAllStudents() {
    const response = await fetch(`${API_BASE}/api/students`);
    const data = await this._handleResponse(response);
    return data.map(this._mapStudent);
  },

  async getStudentById(id) {
    const response = await fetch(`${API_BASE}/api/students/${id}`);
    if (response.status === 404) return null;
    const data = await this._handleResponse(response);
    return this._mapStudent(data);
  },

  _mapStudent(s) {
    return { ...s, name: s.fullName || "Unknown", major: s.program || "Undeclared" };
  },

  async addStudent(student) {
    const payload = { fullName: student.name, email: student.email, age: student.age, program: student.major };
    if (student.id) payload.id = student.id;
    const response = await fetch(`${API_BASE}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return this._handleResponse(response);
  },

  async updateStudent(id, data) {
    const payload = { fullName: data.name, email: data.email, age: data.age, program: data.major };
    if (data.id) payload.id = data.id;
    const response = await fetch(`${API_BASE}/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return this._handleResponse(response);
  },

  async deleteStudent(id) {
    const response = await fetch(`${API_BASE}/api/students/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(await response.text() || "Failed to delete student.");
    }
    return true;
  },

  // INSTRUCTOR ENDPOINTS
  async getAllInstructors() {
    const response = await fetch(`${API_BASE}/api/instructors`);
    const data = await this._handleResponse(response);
    return data.map(this._mapInstructor);
  },

  async getInstructorById(id) {
    const response = await fetch(`${API_BASE}/api/instructors/${id}`);
    if (response.status === 404) return null;
    const data = await this._handleResponse(response);
    return this._mapInstructor(data);
  },

  _mapInstructor(i) {
    return { ...i, name: i.fullName || "Unknown", department: i.Department || i.department || "Unassigned" };
  },

  async addInstructor(instructor) {
    const payload = { fullName: instructor.name, email: instructor.email, Department: instructor.department };
    if (instructor.id) payload.id = instructor.id;
    const response = await fetch(`${API_BASE}/api/instructors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return this._handleResponse(response);
  },

  async updateInstructor(id, data) {
    const payload = { fullName: data.name, email: data.email, Department: data.department };
    if (data.id) payload.id = data.id;
    const response = await fetch(`${API_BASE}/api/instructors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return this._handleResponse(response);
  },

  async deleteInstructor(id) {
    const response = await fetch(`${API_BASE}/api/instructors/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(await response.text() || "Failed to delete instructor.");
    }
    return true;
  },

  async getCoursesForInstructor(instructorId) {
    const response = await fetch(`${API_BASE}/api/instructors/${instructorId}/courses`);
    const data = await this._handleResponse(response);
    return data.map(this._mapCourse);
  },

  // COURSE ENDPOINTS
  async getAllCourses() {
    const response = await fetch(`${API_BASE}/api/courses`);
    const data = await this._handleResponse(response);
    return data.map(this._mapCourse);
  },

  async getCourseById(id) {
    const response = await fetch(`${API_BASE}/api/courses/${id}`);
    if (response.status === 404) return null;
    const data = await this._handleResponse(response);
    return this._mapCourse(data);
  },

  _mapCourse(c) {
    return {
      ...c,
      id: c.id,                          // integer PK — used for API calls
      courseCode: c.course_id || "",     // string like "CRS-101" — for display
      name: c.courseName || "Unknown Course",
      instructorId: c.instructor ? c.instructor.id : null
    };
  },

  async addCourse(course) {
    const payload = {
      course_id: course.courseCode || course.id,
      courseName: course.name,
      credits: course.credits,
      instructor: { id: parseInt(course.instructorId) }
    };
    const response = await fetch(`${API_BASE}/api/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return this._handleResponse(response);
  },

  async updateCourse(id, data) {
    const payload = {
      course_id: data.courseCode || data.id,
      courseName: data.name,
      credits: data.credits,
      instructor: { id: parseInt(data.instructorId) }
    };
    const response = await fetch(`${API_BASE}/api/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return this._handleResponse(response);
  },

  async deleteCourse(id) {
    const response = await fetch(`${API_BASE}/api/courses/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(await response.text() || "Failed to delete course.");
    }
    return true;
  },

  // COURSE VIDEOS ENDPOINTS
  async getVideosForCourse(courseId) {
    const response = await fetch(`${API_BASE}/api/courses/${courseId}/videos`);
    return this._handleResponse(response);
  },

  async addVideosForCourse(courseId, files) {
    if (!files || files.length === 0) return;
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    const response = await fetch(`${API_BASE}/api/courses/${courseId}/videos`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      throw new Error(await response.text() || "Failed to upload videos.");
    }
  },

  async removeVideoFromCourse(courseId, objectUrl) {
    const response = await fetch(`${API_BASE}/api/courses/${courseId}/videos?objectUrl=${encodeURIComponent(objectUrl)}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(await response.text() || "Failed to delete video.");
    }
  },

  // ENROLLMENT ENDPOINTS
  async getAllEnrollments() {
    const response = await fetch(`${API_BASE}/api/enrollments`);
    const data = await this._handleResponse(response);
    return data.map(e => ({ ...e, studentId: e.student ? e.student.id : null, courseId: e.course ? e.course.id : null }));
  },

  async enrollStudent(studentId, courseId) {
    const response = await fetch(`${API_BASE}/api/enrollments?student_id=${studentId}&course_id=${courseId}`, {
      method: 'POST'
    });
    return this._handleResponse(response);
  },

  async removeEnrollment(studentId, courseId) {
    const response = await fetch(`${API_BASE}/api/enrollments?student_id=${studentId}&course_id=${courseId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(await response.text() || "Failed to remove enrollment.");
    }
    return true;
  },

  async getCoursesForStudent(studentId) {
    const response = await fetch(`${API_BASE}/api/students/${studentId}/courses`);
    const data = await this._handleResponse(response);
    return data.map(this._mapCourse);
  },

  async getStudentsForCourse(courseId) {
    const response = await fetch(`${API_BASE}/api/courses/${courseId}/students`);
    const data = await this._handleResponse(response);
    return data.map(this._mapStudent);
  },

  async getActivities() {
    const response = await fetch(`${API_BASE}/api/activities`);
    const data = await this._handleResponse(response);
    return data.map(a => ({ ...a, type: a.activity_type || "", desc: a.description || "", time: a.created_at || "" }));
  }
};
