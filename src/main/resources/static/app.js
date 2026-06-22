/**
 * Aegis | Student Management System (Frontend Application Logic)
 * Version 2.1: Course Video Storage via File API & Object URLs
 */

// ============================================================================
// 1. SIMULATED ASYNC API SERVICE LAYER (In-Memory Database Mock)
// ============================================================================

// APIService is now defined in api.js to separate REST client APIs from UI Controller logic.


// ============================================================================
// 2. UI CONTROLLER LOGIC
// ============================================================================

const UIController = {
  deleteTarget: null,

  init() {
    this.bindDOMEvents();
    this.refreshAllViews();
  },

  bindDOMEvents() {
    // Navigation Toggling
    document.querySelectorAll(".sidebar-menu .menu-item").forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = item.getAttribute("data-target");
        this.switchSection(targetId);
      });
    });

    // Shortcuts
    document.getElementById("shortcut-add-student").addEventListener("click", () => {
      this.openStudentModal("add");
    });
    document.getElementById("shortcut-add-instructor").addEventListener("click", () => {
      this.openInstructorModal("add");
    });
    document.getElementById("shortcut-add-course").addEventListener("click", () => {
      this.openCourseModal("add");
    });
    document.getElementById("shortcut-enroll").addEventListener("click", () => {
      this.switchSection("enrollments-section");
    });

    // Add Modals Trigger
    document.getElementById("btn-add-student-modal").addEventListener("click", () => {
      this.openStudentModal("add");
    });
    document.getElementById("btn-add-instructor-modal").addEventListener("click", () => {
      this.openInstructorModal("add");
    });
    document.getElementById("btn-add-course-modal").addEventListener("click", () => {
      this.openCourseModal("add");
    });

    // Form Submissions
    document.getElementById("student-form").addEventListener("submit", (e) => this.handleStudentFormSubmit(e));
    document.getElementById("instructor-form").addEventListener("submit", (e) => this.handleInstructorFormSubmit(e));
    document.getElementById("course-form").addEventListener("submit", (e) => this.handleCourseFormSubmit(e));
    document.getElementById("enrollment-form").addEventListener("submit", (e) => this.handleEnrollmentFormSubmit(e));

    // Close Modals buttons
    document.querySelectorAll("[data-close]").forEach(btn => {
      btn.addEventListener("click", () => {
        const modalId = btn.getAttribute("data-close");
        this.closeModal(modalId);
      });
    });

    // Confirm Delete action
    document.getElementById("btn-confirm-delete").addEventListener("click", () => {
      this.handleConfirmedDelete();
    });

    // Search and Filter Listeners
    document.getElementById("student-search").addEventListener("input", () => this.renderStudentsTable());
    document.getElementById("student-filter-major").addEventListener("change", () => this.renderStudentsTable());

    document.getElementById("instructor-search").addEventListener("input", () => this.renderInstructorsTable());
    document.getElementById("instructor-filter-dept").addEventListener("change", () => this.renderInstructorsTable());

    document.getElementById("course-search").addEventListener("input", () => this.renderCoursesGrid());
    document.getElementById("course-filter-credits").addEventListener("change", () => this.renderCoursesGrid());

    document.getElementById("enrollment-search").addEventListener("input", () => this.renderEnrollmentsTable());
    document.getElementById("enrollment-filter-course").addEventListener("change", () => this.renderEnrollmentsTable());

    // Student Autocomplete Search in Enrollments
    const enrollStudentSearchInput = document.getElementById("enroll-student-search");
    enrollStudentSearchInput.addEventListener("input", () => this.handleEnrollStudentSearch());
    enrollStudentSearchInput.addEventListener("focus", () => this.handleEnrollStudentSearch());
    
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".enroll-autocomplete-group")) {
        document.getElementById("student-autocomplete-results").style.display = "none";
      }
    });

    // Clear Selected Student badge
    document.getElementById("clear-selected-student").addEventListener("click", () => {
      this.clearSelectedEnrollmentStudent();
    });
  },

  switchSection(sectionId) {
    document.querySelectorAll(".sidebar-menu .menu-item").forEach(item => {
      if (item.getAttribute("data-target") === sectionId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    document.querySelectorAll(".content-section").forEach(sec => {
      if (sec.id === sectionId) {
        sec.classList.add("active");
      } else {
        sec.classList.remove("active");
      }
    });

    const titleHeader = document.getElementById("page-display-title");
    let titleHTML = "";
    if (sectionId === "dashboard-section") {
      titleHTML = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; color: var(--primary);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg> Dashboard`;
    } else if (sectionId === "students-section") {
      titleHTML = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; color: var(--primary);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> Students Registry`;
    } else if (sectionId === "instructors-section") {
      titleHTML = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; color: var(--primary);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> Instructors Registry`;
    } else if (sectionId === "courses-section") {
      titleHTML = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; color: var(--primary);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13" /></svg> Academic Syllabus`;
    } else if (sectionId === "enrollments-section") {
      titleHTML = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; color: var(--primary);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg> Enrollments Panel`;
    }
    titleHeader.innerHTML = titleHTML;

    this.refreshSectionData(sectionId);
  },

  async refreshAllViews() {
    this.renderHeaderMiniStats();
    
    const activeSection = document.querySelector(".content-section.active");
    if (activeSection) {
      this.refreshSectionData(activeSection.id);
    }
  },

  async refreshSectionData(sectionId) {
    if (sectionId === "dashboard-section") {
      this.renderDashboard();
    } else if (sectionId === "students-section") {
      await this.populateMajorDropdownFilters();
      this.renderStudentsTable();
    } else if (sectionId === "instructors-section") {
      await this.populateDeptDropdownFilters();
      this.renderInstructorsTable();
    } else if (sectionId === "courses-section") {
      this.renderCoursesGrid();
    } else if (sectionId === "enrollments-section") {
      await this.populateEnrollmentFormSelects();
      this.renderEnrollmentsTable();
    }
  },

  async renderHeaderMiniStats() {
    const students = await APIService.getAllStudents();
    const courses = await APIService.getAllCourses();
    
    document.getElementById("mini-student-count").textContent = students.length;
    document.getElementById("mini-course-count").textContent = courses.length;
  },

  // ==========================================
  // VIEW RENDERERS: DASHBOARD
  // ==========================================
  
  async renderDashboard() {
    const students = await APIService.getAllStudents();
    const instructors = await APIService.getAllInstructors();
    const courses = await APIService.getAllCourses();
    const enrollments = await APIService.getAllEnrollments();
    const activities = await APIService.getActivities();

    document.getElementById("card-total-students").textContent = students.length;
    document.getElementById("card-total-instructors").textContent = instructors.length;
    document.getElementById("card-total-courses").textContent = courses.length;
    document.getElementById("card-total-enrollments").textContent = enrollments.length;

    // Update mini header stats
    document.getElementById("mini-student-count").textContent = students.length;
    document.getElementById("mini-course-count").textContent = courses.length;

    const feed = document.getElementById("dashboard-activity-list");
    if (activities.length === 0) {
      feed.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 40px 20px;">
          No recent activity recorded. Run CRUD actions to populate activity streams.
        </div>
      `;
      return;
    }

    feed.innerHTML = activities.map(act => {
      let icon = "";
      if (act.type === 'enroll') {
        icon = `<div class="activity-icon enroll"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg></div>`;
      } else if (act.type === 'unenroll') {
        icon = `<div class="activity-icon unenroll"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" /></svg></div>`;
      } else if (act.type === 'student') {
        icon = `<div class="activity-icon student"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>`;
      } else if (act.type === 'course') {
        icon = `<div class="activity-icon course"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13" /></svg></div>`;
      }

      return `
        <div class="activity-item">
          ${icon}
          <div class="activity-details">
            <div class="activity-desc">${act.desc}</div>
            <div class="activity-time">${act.time}</div>
          </div>
        </div>
      `;
    }).join("");
  },

  // ==========================================
  // VIEW RENDERERS: STUDENTS REGISTRY
  // ==========================================
  
  async populateMajorDropdownFilters() {
    const students = await APIService.getAllStudents();
    const filterSelect = document.getElementById("student-filter-major");
    const currentValue = filterSelect.value;

    const majors = [...new Set(students.map(s => s.major))].sort();
    
    let optionsHTML = `<option value="all">All Majors</option>`;
    majors.forEach(major => {
      optionsHTML += `<option value="${major}">${major}</option>`;
    });

    filterSelect.innerHTML = optionsHTML;
    filterSelect.value = currentValue || "all";
  },

  async renderStudentsTable() {
    const students = await APIService.getAllStudents();
    const enrollments = await APIService.getAllEnrollments();
    const query = document.getElementById("student-search").value.toLowerCase().trim();
    const selectedMajor = document.getElementById("student-filter-major").value;

    const tableBody = document.getElementById("students-table-body");

    const filteredStudents = students.filter(student => {
      const matchesSearch = String(student.id).toLowerCase().includes(query) || 
                            student.name.toLowerCase().includes(query) || 
                            student.email.toLowerCase().includes(query);
      const matchesMajor = selectedMajor === "all" || student.major === selectedMajor;
      return matchesSearch && matchesMajor;
    });

    if (filteredStudents.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="empty-state">
              <div class="empty-state-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z" /></svg>
              </div>
              <span class="empty-state-title">No Students Found</span>
              <p class="empty-state-desc">Create student profiles to populate the student records directory.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filteredStudents.map(student => {
      const enrolledCoursesCount = enrollments.filter(e => e.studentId === student.id).length;
      const initials = student.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();

      return `
        <tr>
          <td>
            <span class="badge badge-neutral" style="font-family: monospace; font-size: 0.8rem; letter-spacing:0.5px;">${student.id}</span>
          </td>
          <td>
            <div class="table-profile">
              <div class="table-profile-avatar">${initials}</div>
              <div class="table-profile-info">
                <span class="table-profile-name">${student.name}</span>
                <span class="table-profile-id" style="font-size:0.78rem;">${student.email}</span>
              </div>
            </div>
          </td>
          <td>${student.age} y/o</td>
          <td>
            <span class="badge badge-secondary" style="font-size: 0.75rem;">${student.major}</span>
          </td>
          <td>
            <span class="badge badge-info" style="font-weight: 700;">${enrolledCoursesCount} Class${enrolledCoursesCount !== 1 ? 'es' : ''}</span>
          </td>
          <td>
            <div class="action-group">
              <button class="btn btn-outline btn-sm btn-icon-only" onclick="UIController.openStudentDetail('${student.id}')" title="View Profile">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7" /></svg>
              </button>
              <button class="btn btn-outline btn-sm btn-icon-only" onclick="UIController.openStudentModal('edit', '${student.id}')" title="Edit Student">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button class="btn btn-danger btn-sm btn-icon-only" onclick="UIController.triggerDelete('student', '${student.id}')" title="Delete Student">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" /></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  // ==========================================
  // VIEW RENDERERS: INSTRUCTORS REGISTRY
  // ==========================================
  
  async populateDeptDropdownFilters() {
    const instructors = await APIService.getAllInstructors();
    const filterSelect = document.getElementById("instructor-filter-dept");
    const currentValue = filterSelect.value;

    const depts = [...new Set(instructors.map(i => i.department))].sort();
    
    let optionsHTML = `<option value="all">All Departments</option>`;
    depts.forEach(dept => {
      optionsHTML += `<option value="${dept}">${dept}</option>`;
    });

    filterSelect.innerHTML = optionsHTML;
    filterSelect.value = currentValue || "all";
  },

  async renderInstructorsTable() {
    const instructors = await APIService.getAllInstructors();
    const courses = await APIService.getAllCourses();
    const query = document.getElementById("instructor-search").value.toLowerCase().trim();
    const selectedDept = document.getElementById("instructor-filter-dept").value;

    const tableBody = document.getElementById("instructors-table-body");

    const filteredInstructors = instructors.filter(inst => {
      const matchesSearch = String(inst.id).toLowerCase().includes(query) || 
                            inst.name.toLowerCase().includes(query) || 
                            inst.email.toLowerCase().includes(query);
      const matchesDept = selectedDept === "all" || inst.department === selectedDept;
      return matchesSearch && matchesDept;
    });

    if (filteredInstructors.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="empty-state">
              <div class="empty-state-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>
              </div>
              <span class="empty-state-title">No Instructors Found</span>
              <p class="empty-state-desc">Register faculty members to allocate courses and manage instruction rosters.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filteredInstructors.map(inst => {
      const coursesTaughtCount = courses.filter(c => c.instructorId === inst.id).length;
      const initials = inst.name.replace(/^(Dr\.|Prof\.)\s+/i, "").split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();

      return `
        <tr>
          <td>
            <span class="badge badge-neutral" style="font-family: monospace; font-size: 0.8rem; letter-spacing:0.5px;">${inst.id}</span>
          </td>
          <td>
            <div class="table-profile">
              <div class="table-profile-avatar" style="background-color: var(--warning-light); color: var(--warning);">${initials}</div>
              <div class="table-profile-info">
                <span class="table-profile-name">${inst.name}</span>
                <span class="table-profile-id" style="font-size:0.78rem;">${inst.email}</span>
              </div>
            </div>
          </td>
          <td>
            <span class="badge badge-secondary" style="font-size: 0.75rem;">${inst.department}</span>
          </td>
          <td>
            <span class="badge badge-success" style="font-weight: 700;">${coursesTaughtCount} Course${coursesTaughtCount !== 1 ? 's' : ''}</span>
          </td>
          <td>
            <div class="action-group">
              <button class="btn btn-outline btn-sm btn-icon-only" onclick="UIController.openInstructorDetail('${inst.id}')" title="View Profile">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7" /></svg>
              </button>
              <button class="btn btn-outline btn-sm btn-icon-only" onclick="UIController.openInstructorModal('edit', '${inst.id}')" title="Edit Instructor">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button class="btn btn-danger btn-sm btn-icon-only" onclick="UIController.triggerDelete('instructor', '${inst.id}')" title="Delete Instructor">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" /></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  // ==========================================
  // VIEW RENDERERS: COURSE CATALOG
  // ==========================================
  
  async renderCoursesGrid() {
    const courses = await APIService.getAllCourses();
    const instructors = await APIService.getAllInstructors();
    const enrollments = await APIService.getAllEnrollments();
    const query = document.getElementById("course-search").value.toLowerCase().trim();
    const selectedCredits = document.getElementById("course-filter-credits").value;

    const gridContainer = document.getElementById("courses-grid-container");

    const filteredCourses = courses.filter(course => {
      const instructor = instructors.find(i => i.id === course.instructorId);
      const instructorName = instructor ? instructor.name : "Unassigned";

      const matchesSearch = String(course.id).toLowerCase().includes(query) ||
                            course.courseCode.toLowerCase().includes(query) ||
                            course.name.toLowerCase().includes(query) ||
                            instructorName.toLowerCase().includes(query);
      const matchesCredits = selectedCredits === "all" || course.credits.toString() === selectedCredits;
      return matchesSearch && matchesCredits;
    });

    if (filteredCourses.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; width: 100%;">
          <div class="empty-state" style="background-color: var(--card-bg); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
            <div class="empty-state-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13" /></svg>
            </div>
            <span class="empty-state-title">No Courses Found</span>
            <p class="empty-state-desc">Draft curriculum items in the registry to build the course database.</p>
          </div>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = filteredCourses.map(course => {
      const studentCount = enrollments.filter(e => e.courseId === course.id).length;
      const instructor = instructors.find(i => i.id === course.instructorId);
      
      let instructorStr = "";
      if (instructor) {
        instructorStr = instructor.name;
      } else {
        instructorStr = `<span style="color:var(--danger); font-style:italic; font-weight:500;">Unassigned</span>`;
      }

      return `
        <div class="course-card">
          <div>
            <div class="course-header">
              <span class="course-code">${course.courseCode || course.id}</span>
              <span class="course-credits">${course.credits} Credits</span>
            </div>
            <div class="course-body" style="margin-top: 14px;">
              <h4 class="course-title">${course.name}</h4>
              <span class="course-instructor" style="margin-top: 6px;">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Instructor: ${instructorStr}
              </span>
            </div>
          </div>
          
          <div class="course-footer">
            <span class="course-students-count">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857" /></svg>
              ${studentCount} Enrolled
            </span>
            <div class="action-group">
              <button class="btn btn-outline btn-sm btn-icon-only" onclick="UIController.openCourseDetail('${course.id}')" title="View Details">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7" /></svg>
              </button>
              <button class="btn btn-outline btn-sm btn-icon-only" onclick="UIController.openCourseModal('edit', '${course.id}')" title="Edit Course">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button class="btn btn-danger btn-sm btn-icon-only" onclick="UIController.triggerDelete('course', '${course.id}')" title="Delete Course">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  // ==========================================
  // VIEW RENDERERS: ENROLLMENTS & ASSIGNMENTS
  // ==========================================
  
  async populateEnrollmentFormSelects() {
    const courses = await APIService.getAllCourses();
    const courseSelect = document.getElementById("enroll-course-select");
    const filterCourseSelect = document.getElementById("enrollment-filter-course");
    
    const currentSelectVal = courseSelect.value;
    const currentFilterVal = filterCourseSelect.value;

    let optionsHTML = `<option value="">-- Choose Course --</option>`;
    let filterOptionsHTML = `<option value="all">All Courses</option>`;

    courses.forEach(c => {
      const valStr = `${c.courseCode || c.id} - ${c.name}`;
      optionsHTML += `<option value="${c.id}">${valStr}</option>`;
      filterOptionsHTML += `<option value="${c.id}">${c.courseCode || c.id}</option>`;
    });

    courseSelect.innerHTML = optionsHTML;
    courseSelect.value = currentSelectVal;

    filterCourseSelect.innerHTML = filterOptionsHTML;
    filterCourseSelect.value = currentFilterVal || "all";
  },

  async renderEnrollmentsTable() {
    const enrollments = await APIService.getAllEnrollments();
    const students = await APIService.getAllStudents();
    const courses = await APIService.getAllCourses();

    const query = document.getElementById("enrollment-search").value.toLowerCase().trim();
    const selectedCourseFilter = document.getElementById("enrollment-filter-course").value;

    const tableBody = document.getElementById("enrollments-table-body");

    const filteredEnrollments = enrollments.filter(e => {
      const student = students.find(s => s.id === e.studentId);
      const course = courses.find(c => c.id === e.courseId);

      if (!student || !course) return false;

      const matchesSearch = student.name.toLowerCase().includes(query) || 
                            String(student.id).toLowerCase().includes(query) ||
                            course.name.toLowerCase().includes(query) || 
                            String(course.id).toLowerCase().includes(query);
      
      const matchesCourse = selectedCourseFilter === "all" || e.courseId === selectedCourseFilter;
      
      return matchesSearch && matchesCourse;
    });

    if (filteredEnrollments.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4">
            <div class="empty-state">
              <div class="empty-state-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg>
              </div>
              <span class="empty-state-title">No Enrollments Found</span>
              <p class="empty-state-desc">Use the enrollment panel form to register students in classes.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filteredEnrollments.map(e => {
      const student = students.find(s => s.id === e.studentId);
      const course = courses.find(c => c.id === e.courseId);

      return `
        <tr>
          <td>
            <div style="display:flex; flex-direction:column;">
              <span style="font-weight:600; color:var(--text-main);">${student.name}</span>
              <span style="font-size:0.75rem; color:var(--text-muted); font-family: monospace;">ID: ${student.id}</span>
            </div>
          </td>
          <td>
            <div style="display:flex; flex-direction:column;">
              <span style="font-weight:600; color:var(--text-main);">${course.name}</span>
              <span style="font-size:0.75rem; color:var(--primary); font-weight:700; font-family: monospace;">${course.courseCode || course.id}</span>
            </div>
          </td>
          <td>
            <span class="badge badge-neutral" style="font-size:0.75rem; font-family:monospace;">${e.enrollDate}</span>
          </td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="UIController.triggerDelete('enrollment', '${e.studentId}', '${e.courseId}')">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:14px; height:14px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" /></svg>
              Unenroll
            </button>
          </td>
        </tr>
      `;
    }).join("");
  },

  // ==========================================
  // AUTOCOMPLETE & INPUT FLOWS
  // ==========================================

  async handleEnrollStudentSearch() {
    const query = document.getElementById("enroll-student-search").value.toLowerCase().trim();
    const dropdown = document.getElementById("student-autocomplete-results");

    if (query.length < 1) {
      dropdown.innerHTML = "";
      dropdown.style.display = "none";
      return;
    }

    const students = await APIService.getAllStudents();
    const matches = students.filter(s => s.name.toLowerCase().includes(query) || String(s.id).toLowerCase().includes(query));

    if (matches.length === 0) {
      dropdown.innerHTML = `<div style="padding:10px 14px; font-size:0.8rem; color:var(--text-muted);">No student matches.</div>`;
      dropdown.style.display = "block";
      return;
    }

    dropdown.innerHTML = matches.map(s => `
      <div class="autocomplete-item" onclick="UIController.selectEnrollmentStudent('${s.id}', '${s.name}')">
        <span>${s.name}</span>
        <span class="item-meta">${s.id}</span>
      </div>
    `).join("");
    dropdown.style.display = "block";
  },

  selectEnrollmentStudent(id, name) {
    document.getElementById("enroll-student-id").value = id;
    document.getElementById("enroll-student-search").value = "";
    document.getElementById("student-autocomplete-results").style.display = "none";
    
    const badge = document.getElementById("enroll-student-badge");
    const badgeText = document.getElementById("enroll-student-badge-text");
    badgeText.textContent = `${name} (${id})`;
    badge.style.display = "inline-flex";
    
    document.getElementById("enroll-student-search").style.display = "none";
  },

  clearSelectedEnrollmentStudent() {
    document.getElementById("enroll-student-id").value = "";
    document.getElementById("enroll-student-search").value = "";
    document.getElementById("enroll-student-search").style.display = "block";
    document.getElementById("enroll-student-badge").style.display = "none";
    document.getElementById("enroll-student-search").focus();
  },

  // ==========================================
  // SELECT POPULATION HELPERS
  // ==========================================

  async populateInstructorDropdownInCourseForm() {
    const instructors = await APIService.getAllInstructors();
    const select = document.getElementById("course-instructor-select");
    const currentVal = select.value;

    let optionsHTML = `<option value="">-- Choose Instructor --</option>`;
    instructors.forEach(inst => {
      optionsHTML += `<option value="${inst.id}">${inst.name} (${inst.department})</option>`;
    });

    select.innerHTML = optionsHTML;
    select.value = currentVal;
  },

  // ==========================================
  // DIALOG/MODAL ACTIONS
  // ==========================================
  
  openModal(modalId) {
    document.getElementById(modalId).classList.add("active");
  },

  closeModal(modalId) {
    document.getElementById(modalId).classList.remove("active");
  },

  openStudentModal(mode, studentId = null) {
    const form = document.getElementById("student-form");
    form.reset();
    
    const idInput = document.getElementById("student-id");
    const modeInput = document.getElementById("student-form-mode");
    const originalIdInput = document.getElementById("student-form-original-id");
    const title = document.getElementById("student-modal-title");

    if (mode === "add") {
      modeInput.value = "add";
      title.textContent = "Add New Student";
      idInput.value = "";
      idInput.disabled = false;
      idInput.parentElement.style.display = "block";
    } else {
      modeInput.value = "edit";
      title.textContent = "Edit Student Profile";
      idInput.parentElement.style.display = "block";
      
      APIService.getStudentById(studentId).then(student => {
        if (!student) return;
        originalIdInput.value = student.id;
        idInput.value = student.id;
        idInput.disabled = true;
        
        document.getElementById("student-name").value = student.name;
        document.getElementById("student-email").value = student.email;
        document.getElementById("student-age").value = student.age;
        document.getElementById("student-major").value = student.major;
      });
    }

    this.openModal("student-modal");
  },

  openInstructorModal(mode, instructorId = null) {
    const form = document.getElementById("instructor-form");
    form.reset();
    
    const idInput = document.getElementById("instructor-id");
    const modeInput = document.getElementById("instructor-form-mode");
    const originalIdInput = document.getElementById("instructor-form-original-id");
    const title = document.getElementById("instructor-modal-title");

    if (mode === "add") {
      modeInput.value = "add";
      title.textContent = "Add New Instructor";
      idInput.value = "";
      idInput.disabled = false;
      idInput.parentElement.style.display = "block";
    } else {
      modeInput.value = "edit";
      title.textContent = "Edit Instructor Credentials";
      idInput.parentElement.style.display = "block";
      
      APIService.getInstructorById(instructorId).then(inst => {
        if (!inst) return;
        originalIdInput.value = inst.id;
        idInput.value = inst.id;
        idInput.disabled = true;
        
        document.getElementById("instructor-name").value = inst.name;
        document.getElementById("instructor-email").value = inst.email;
        document.getElementById("instructor-dept").value = inst.department;
      });
    }

    this.openModal("instructor-modal");
  },

  async openCourseModal(mode, courseId = null) {
    const form = document.getElementById("course-form");
    form.reset();

    const instructors = await APIService.getAllInstructors();
    if (instructors.length === 0) {
      this.showToast("Instructor Required", "You must register at least one instructor before creating courses.", "warning");
      this.switchSection("instructors-section");
      return;
    }

    await this.populateInstructorDropdownInCourseForm();

    const idInput = document.getElementById("course-id");
    const modeInput = document.getElementById("course-form-mode");
    const originalIdInput = document.getElementById("course-form-original-id");
    const title = document.getElementById("course-modal-title");

    if (mode === "add") {
      modeInput.value = "add";
      title.textContent = "Create Course Catalog";
      idInput.disabled = false;
    } else {
      modeInput.value = "edit";
      title.textContent = "Edit Course Syllabus";

      APIService.getCourseById(courseId).then(course => {
        if (!course) return;
        originalIdInput.value = course.id;          // integer PK for API
        idInput.value = course.courseCode || course.id; // string CRS-xxx for display
        idInput.disabled = true;

        document.getElementById("course-name").value = course.name;
        document.getElementById("course-instructor-select").value = course.instructorId;
        document.getElementById("course-credits").value = course.credits;
      });
    }

    this.openModal("course-modal");
  },

  async openStudentDetail(studentId) {
    const student = await APIService.getStudentById(studentId);
    if (!student) return;

    const enrolledCourses = await APIService.getCoursesForStudent(studentId);
    const initials = student.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
    
    document.getElementById("detail-student-avatar").textContent = initials;
    document.getElementById("detail-student-name").textContent = student.name;
    document.getElementById("detail-student-major").textContent = student.major;
    document.getElementById("detail-student-id").textContent = student.id;
    document.getElementById("detail-student-age").textContent = student.age;
    document.getElementById("detail-student-email").textContent = student.email;
    document.getElementById("detail-student-course-count").textContent = enrolledCourses.length;

    const listContainer = document.getElementById("detail-student-courses-list");
    if (enrolledCourses.length === 0) {
      listContainer.innerHTML = `<span style="font-size:0.85rem; color:var(--text-muted); font-style:italic;">No active course registrations.</span>`;
    } else {
      listContainer.innerHTML = enrolledCourses.map(c => `
        <div style="display:flex; justify-content:space-between; align-items:center; background-color:white; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color);">
          <span style="font-size:0.88rem; font-weight:600; color:var(--text-main);">${c.name}</span>
          <span class="badge badge-info" style="font-family: monospace;">${c.courseCode || c.id} (${c.credits}cr)</span>
        </div>
      `).join("");
    }

    this.openModal("student-detail-modal");
  },

  async openInstructorDetail(instructorId) {
    const inst = await APIService.getInstructorById(instructorId);
    if (!inst) return;

    const coursesTaught = await APIService.getCoursesForInstructor(instructorId);
    const initials = inst.name.replace(/^(Dr\.|Prof\.)\s+/i, "").split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
    
    document.getElementById("detail-instructor-avatar").textContent = initials;
    document.getElementById("detail-instructor-name").textContent = inst.name;
    document.getElementById("detail-instructor-dept").textContent = inst.department;
    document.getElementById("detail-instructor-id").textContent = inst.id;
    document.getElementById("detail-instructor-email").textContent = inst.email;
    document.getElementById("detail-instructor-course-count").textContent = coursesTaught.length;

    const listContainer = document.getElementById("detail-instructor-courses-list");
    if (coursesTaught.length === 0) {
      listContainer.innerHTML = `<span style="font-size:0.85rem; color:var(--text-muted); font-style:italic;">This instructor is not teaching any courses.</span>`;
    } else {
      listContainer.innerHTML = coursesTaught.map(c => `
        <div style="display:flex; justify-content:space-between; align-items:center; background-color:white; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color);">
          <span style="font-size:0.88rem; font-weight:600; color:var(--text-main);">${c.name}</span>
          <span class="badge badge-info" style="font-family: monospace;">${c.courseCode || c.id}</span>
        </div>
      `).join("");
    }

    this.openModal("instructor-detail-modal");
  },

  async openCourseDetail(courseId) {
    const course = await APIService.getCourseById(courseId);
    if (!course) return;

    const instructors = await APIService.getAllInstructors();
    const instructor = instructors.find(i => i.id === course.instructorId);
    const instructorName = instructor ? instructor.name : "Unassigned";

    const registeredStudents = await APIService.getStudentsForCourse(courseId);

    const codeSplit = String(course.courseCode || course.id).split("-");
    const initials = codeSplit[0] ? codeSplit[0].substring(0, 2).toUpperCase() : "CO";
    
    document.getElementById("detail-course-avatar").textContent = initials;
    document.getElementById("detail-course-title").textContent = course.name;
    document.getElementById("detail-course-id").textContent = course.courseCode || course.id;
    document.getElementById("detail-course-credits").textContent = course.credits;
    document.getElementById("detail-course-instructor").textContent = instructorName;
    document.getElementById("detail-course-student-count").textContent = registeredStudents.length;

    const listContainer = document.getElementById("detail-course-students-list");
    if (registeredStudents.length === 0) {
      listContainer.innerHTML = `<span style="font-size:0.85rem; color:var(--text-muted); font-style:italic;">No students currently registered.</span>`;
    } else {
      listContainer.innerHTML = registeredStudents.map(s => `
        <div style="display:flex; justify-content:space-between; align-items:center; background-color:white; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color);">
          <div style="display:flex; flex-direction:column;">
            <span style="font-size:0.88rem; font-weight:600; color:var(--text-main);">${s.name}</span>
            <span style="font-size:0.75rem; color:var(--text-muted);">${s.email}</span>
          </div>
          <span class="badge badge-secondary">${s.id}</span>
        </div>
      `).join("");
    }

    this.openModal("course-detail-modal");
  },

  // ==========================================
  // CRUD FORM SUBMISSIONS
  // ==========================================

  async handleStudentFormSubmit(e) {
    e.preventDefault();
    const mode = document.getElementById("student-form-mode").value;
    const originalId = document.getElementById("student-form-original-id").value;

    const studentId = document.getElementById("student-id").value.trim();
    const name = document.getElementById("student-name").value.trim();
    const email = document.getElementById("student-email").value.trim();
    const age = parseInt(document.getElementById("student-age").value);
    const major = document.getElementById("student-major").value.trim();

    if (!studentId || !name || !email || isNaN(age) || !major) {
      this.showToast("Required Fields", "Please complete all fields marked with an asterisk (*).", "warning");
      return;
    }

    if (isNaN(parseInt(studentId))) {
      this.showToast("Invalid ID Format", "Student ID must be a number.", "warning");
      return;
    }

    if (age < 15 || age > 100) {
      this.showToast("Invalid Age", "Age must be between 15 and 100.", "warning");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      this.showToast("Invalid Email", "Please supply a valid email address.", "warning");
      return;
    }

    const payload = { id: parseInt(studentId), name, email, age, major };

    try {
      if (mode === "add") {
        delete payload.id;
        await APIService.addStudent(payload);
        this.showToast("Student Registered", `Enrolled ${name} into registry database.`, "success");
      } else {
        await APIService.updateStudent(originalId, payload);
        this.showToast("Profile Updated", `Profile records for ${name} were updated.`, "success");
      }
      this.closeModal("student-modal");
      this.refreshAllViews();
    } catch (err) {
      this.showToast("Operation Failed", err.message, "error");
    }
  },

  async handleInstructorFormSubmit(e) {
    e.preventDefault();
    const mode = document.getElementById("instructor-form-mode").value;
    const originalId = document.getElementById("instructor-form-original-id").value;

    const instructorId = document.getElementById("instructor-id").value.trim();
    const name = document.getElementById("instructor-name").value.trim();
    const email = document.getElementById("instructor-email").value.trim();
    const department = document.getElementById("instructor-dept").value.trim();

    if (!instructorId || !name || !email || !department) {
      this.showToast("Required Fields", "Please complete all fields marked with an asterisk (*).", "warning");
      return;
    }

    if (isNaN(parseInt(instructorId))) {
      this.showToast("Invalid ID Format", "Instructor ID must be a number.", "warning");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      this.showToast("Invalid Email", "Please supply a valid email address.", "warning");
      return;
    }

    const payload = { id: parseInt(instructorId), name, email, department };

    try {
      if (mode === "add") {
        delete payload.id;
        await APIService.addInstructor(payload);
        this.showToast("Instructor Registered", `Successfully registered ${name} in department ${department}.`, "success");
      } else {
        await APIService.updateInstructor(originalId, payload);
        this.showToast("Profile Updated", `Faculty credentials for ${name} were updated.`, "success");
      }
      this.closeModal("instructor-modal");
      this.refreshAllViews();
    } catch (err) {
      this.showToast("Operation Failed", err.message, "error");
    }
  },

  async handleCourseFormSubmit(e) {
    e.preventDefault();
    const mode = document.getElementById("course-form-mode").value;
    const originalId = document.getElementById("course-form-original-id").value; // integer PK

    const courseId = document.getElementById("course-id").value.trim();           // CRS-xxx string
    const name = document.getElementById("course-name").value.trim();
    const instructorId = document.getElementById("course-instructor-select").value;
    const credits = parseInt(document.getElementById("course-credits").value);

    if (!courseId || !name || !instructorId || isNaN(credits)) {
      this.showToast("Required Fields", "Please complete all course syllabus fields.", "warning");
      return;
    }

    if (!/^CRS-\d+$/i.test(courseId)) {
      this.showToast("Invalid ID Format", "Course ID must begin with CRS- followed by numbers (e.g. CRS-101).", "warning");
      return;
    }

    // payload uses course_id (CRS-xxx) as display identifier, id is the integer PK handled server-side
    const payload = { courseCode: courseId.toUpperCase(), name, instructorId, credits };

    try {
      if (mode === "add") {
        await APIService.addCourse(payload);
        this.showToast("Course Created", `${courseId} (${name}) has been cataloged.`, "success");
      } else {
        await APIService.updateCourse(originalId, payload);  // originalId is integer PK
        this.showToast("Course Updated", `Syllabus specifications for ${courseId} have been updated.`, "success");
      }
      this.closeModal("course-modal");
      this.refreshAllViews();
    } catch (err) {
      this.showToast("Operation Failed", err.message, "error");
    }
  },

  async handleEnrollmentFormSubmit(e) {
    e.preventDefault();
    const studentId = document.getElementById("enroll-student-id").value;
    const courseId = document.getElementById("enroll-course-select").value;

    if (!studentId) {
      this.showToast("Student Required", "Please select a student from search list autocomplete dropdown.", "warning");
      return;
    }
    if (!courseId) {
      this.showToast("Course Required", "Please select a course to enroll.", "warning");
      return;
    }

    try {
      await APIService.enrollStudent(studentId, courseId);
      this.showToast("Enrollment Complete", "Registered student in course classlist.", "success");
      
      this.clearSelectedEnrollmentStudent();
      document.getElementById("enroll-course-select").value = "";

      this.refreshAllViews();
    } catch (err) {
      this.showToast("Enrollment Failed", err.message, "error");
    }
  },

  // ==========================================
  // RECORD DELETION FLOWS (CONFIRM DIALOG)
  // ==========================================
  
  triggerDelete(type, id, extraId = null) {
    this.deleteTarget = { type, id, extraId };
    
    const title = document.getElementById("confirm-title");
    const desc = document.getElementById("confirm-desc");

    if (type === "student") {
      title.textContent = "Remove Student Profile";
      desc.innerHTML = `Are you sure you want to delete student <strong>${id}</strong>? All associated registrations and enrollments will be deleted permanently.`;
    } else if (type === "instructor") {
      title.textContent = "De-register Faculty Member";
      desc.innerHTML = `Are you sure you want to remove instructor <strong>${id}</strong>? All courses currently taught by this instructor will remain in catalog but be marked as <strong style="color:var(--danger)">Unassigned</strong>.`;
    } else if (type === "course") {
      title.textContent = "Dissolve Course Syllabus";
      desc.innerHTML = `Are you sure you want to remove course <strong>${id}</strong>? All registered student links will be immediately severed.`;
    } else if (type === "enrollment") {
      title.textContent = "Unenroll Student";
      desc.innerHTML = `Are you sure you want to remove enrollment of student <strong>${id}</strong> from class <strong>${extraId}</strong>?`;
    }

    this.openModal("confirm-modal");
  },

  async handleConfirmedDelete() {
    if (!this.deleteTarget) return;
    const { type, id, extraId } = this.deleteTarget;

    try {
      if (type === "student") {
        await APIService.deleteStudent(id);
        this.showToast("Record Purged", "Student profile and enrollment mappings deleted.", "success");
      } else if (type === "instructor") {
        await APIService.deleteInstructor(id);
        this.showToast("Instructor Removed", "Faculty member removed. Assigned courses set to Unassigned.", "success");
      } else if (type === "course") {
        await APIService.deleteCourse(id);
        this.showToast("Catalog Item Removed", "Course syllabus dropped from program registry.", "success");
      } else if (type === "enrollment") {
        await APIService.removeEnrollment(id, extraId);
        this.showToast("Enrollment Voided", "Student has been unenrolled from the class syllabus.", "success");
      }
      this.closeModal("confirm-modal");
      this.refreshAllViews();
    } catch (err) {
      this.showToast("Deletion Failed", err.message, "error");
    } finally {
      this.deleteTarget = null;
    }
  },

  // ==========================================
  // FLOATING TOAST NOTIFICATION CONTAINER
  // ==========================================
  
  showToast(title, message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let icon = "";
    if (type === "success") {
      icon = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    } else if (type === "error") {
      icon = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    } else if (type === "warning") {
      icon = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
    } else {
      icon = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close">&times;</button>
    `;

    container.appendChild(toast);

    toast.querySelector(".toast-close").addEventListener("click", () => {
      this.removeToast(toast);
    });

    setTimeout(() => {
      this.removeToast(toast);
    }, 4500);
  },

  removeToast(toast) {
    if (toast.parentElement && !toast.classList.contains("removing")) {
      toast.classList.add("removing");
      toast.addEventListener("animationend", () => {
        toast.remove();
      });
    }
  }
};

// Start the Application when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  UIController.init();
});
