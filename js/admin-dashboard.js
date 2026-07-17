// ======================================
// Admin Dashboard - Full Combined Script
// ======================================
// Sections:
//   1. Auth check
//   2. Helpers (escapeHTML)
//   3. Question Manager
//   4. Student Management
//   5. Student Results
//   6. Dashboard Statistics
//
// SECURITY NOTE: Student passwords are stored in plain text in localStorage.
// Fine for a local prototype/demo, but a real system must hash passwords
// server-side and never store raw credentials client-side.
// ======================================

// ------------------------------
// 1. Auth Check (stops script if not logged in)
// ------------------------------
(function checkAuth() {
    if (sessionStorage.getItem("adminLoggedIn") !== "true") {
        window.location.href = "admin-login.html";
        throw new Error("Not authenticated - redirecting to login.");
    }
})();

const adminNameEl = document.getElementById("adminName");
if (adminNameEl) {
    adminNameEl.textContent = sessionStorage.getItem("adminName") || "Admin";
}

// ------------------------------
// 2. Helpers
// ------------------------------
function escapeHTML(str) {
    if (str === undefined || str === null) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// ==========================================================
// 3. Question Manager
// ==========================================================

const STORAGE_KEY = "examQuestions";

let questions = [];
try {
    questions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (!Array.isArray(questions)) questions = [];
} catch {
    questions = [];
}

let editingIndex = -1;

function saveStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

function renderTable() {
    const table = document.getElementById("questionTable");
    if (!table) return;

    table.innerHTML = "";

    questions.forEach((q, index) => {
        const questionText = escapeHTML(q.question);
        const answerText = escapeHTML(
            Array.isArray(q.options) ? q.options[q.answer] : ""
        );

        table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${questionText}</td>
                <td>${answerText}</td>
                <td>
                    <button class="btn btn-primary" onclick="editQuestion(${index})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteQuestion(${index})">Delete</button>
                </td>
            </tr>
        `;
    });

    const totalEl = document.getElementById("totalQuestions");
    if (totalEl) totalEl.textContent = questions.length;
}

function clearForm() {
    const ids = ["question", "option1", "option2", "option3", "option4"];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    const answerEl = document.getElementById("answer");
    if (answerEl) answerEl.value = 0;
}

const saveQuestionBtn = document.getElementById("saveQuestion");
if (saveQuestionBtn) {
    saveQuestionBtn.addEventListener("click", function () {
        const question = (document.getElementById("question")?.value || "").trim();
        const option1 = (document.getElementById("option1")?.value || "").trim();
        const option2 = (document.getElementById("option2")?.value || "").trim();
        const option3 = (document.getElementById("option3")?.value || "").trim();
        const option4 = (document.getElementById("option4")?.value || "").trim();
        const answerRaw = document.getElementById("answer")?.value;
        const answer = Number(answerRaw);

        if (!question || !option1 || !option2 || !option3 || !option4) {
            alert("Please fill all fields.");
            return;
        }

        if (!Number.isInteger(answer) || answer < 0 || answer > 3) {
            alert("Please select a valid correct answer.");
            return;
        }

        const obj = {
            question: question,
            options: [option1, option2, option3, option4],
            answer: answer
        };

        if (editingIndex === -1) {
            questions.push(obj);
        } else {
            questions[editingIndex] = obj;
            editingIndex = -1;
            saveQuestionBtn.textContent = "Save Question";
        }

        saveStorage();
        renderTable();
        clearForm();
        updateDashboardStats();
    });
}

function deleteQuestion(index) {
    if (!confirm("Delete this question?")) return;
    questions.splice(index, 1);
    saveStorage();
    renderTable();
    updateDashboardStats();
}

function editQuestion(index) {
    const q = questions[index];
    if (!q) return;

    editingIndex = index;

    const fieldMap = {
        question: q.question,
        option1: q.options?.[0],
        option2: q.options?.[1],
        option3: q.options?.[2],
        option4: q.options?.[3],
        answer: q.answer
    };

    Object.entries(fieldMap).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.value = value ?? "";
    });

    const btn = document.getElementById("saveQuestion");
    if (btn) btn.textContent = "Update Question";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

const exportBtn = document.getElementById("exportBtn");
if (exportBtn) {
    exportBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const data = JSON.stringify(questions, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "questions.json";
        a.click();
        URL.revokeObjectURL(url);
    });
}

const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");

if (importBtn && importFile) {
    importBtn.addEventListener("click", function (e) {
        e.preventDefault();
        importFile.click();
    });

    importFile.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function () {
            try {
                const imported = JSON.parse(reader.result);

                if (!Array.isArray(imported)) {
                    throw new Error("Not an array.");
                }

                const isValid = imported.every(q =>
                    q &&
                    typeof q.question === "string" &&
                    Array.isArray(q.options) &&
                    q.options.length === 4 &&
                    q.options.every(o => typeof o === "string") &&
                    Number.isInteger(q.answer) &&
                    q.answer >= 0 &&
                    q.answer <= 3
                );

                if (!isValid) {
                    throw new Error("Invalid question structure.");
                }

                questions = imported;
                saveStorage();
                renderTable();
                updateDashboardStats();
                alert("Questions Imported Successfully.");
            } catch {
                alert("Invalid JSON File. Each question needs 'question', 4 'options', and a valid 'answer' index (0-3).");
            } finally {
                importFile.value = "";
            }
        };

        reader.readAsText(file);
    });
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        sessionStorage.removeItem("adminLoggedIn");
        sessionStorage.removeItem("adminName");
        window.location.href = "admin-login.html";
    });
}

renderTable();

// ==========================================================
// 4. Student Management
// ==========================================================

const STUDENT_KEY = "students";

let students = [];
try {
    students = JSON.parse(localStorage.getItem(STUDENT_KEY)) || [];
    if (!Array.isArray(students)) students = [];
} catch {
    students = [];
}

let editingStudent = -1; // holds student's id, not array index

const saveStudentBtn = document.getElementById("saveStudent");
const studentTableEl = document.getElementById("studentTable");
const searchStudentEl = document.getElementById("searchStudent");

function saveStudents() {
    localStorage.setItem(STUDENT_KEY, JSON.stringify(students));
}

if (saveStudentBtn) {
    saveStudentBtn.addEventListener("click", function () {
        const name = (document.getElementById("studentName")?.value || "").trim();
        const roll = (document.getElementById("studentRoll")?.value || "").trim();
        const password = (document.getElementById("studentPassword")?.value || "").trim();
        const subject = (document.getElementById("studentSubject")?.value || "").trim();
        const status = document.getElementById("studentStatus")?.value || "Active";

        if (!name || !roll || !password || !subject) {
            alert("Please fill all fields.");
            return;
        }

        if (editingStudent === -1) {
            const exists = students.find(s => s.roll === roll);
            if (exists) {
                alert("Roll Number already exists.");
                return;
            }

            const nextId = students.length > 0
                ? Math.max(...students.map(s => s.id)) + 1
                : 1;

            students.push({
                id: nextId,
                name,
                roll,
                password,
                subject,
                status
            });
        } else {
            const rollTaken = students.find(
                s => s.roll === roll && s.id !== editingStudent
            );
            if (rollTaken) {
                alert("Roll Number already exists for another student.");
                return;
            }

            const idx = students.findIndex(s => s.id === editingStudent);
            if (idx !== -1) {
                students[idx] = {
                    id: editingStudent,
                    name,
                    roll,
                    password,
                    subject,
                    status
                };
            }

            editingStudent = -1;
            saveStudentBtn.textContent = "Save Student";
        }

        saveStudents();
        renderStudents(searchStudentEl ? searchStudentEl.value : "");
        clearStudentForm();
        updateDashboardStats();
    });
}

function renderStudents(search = "") {
    if (!studentTableEl) return;

    studentTableEl.innerHTML = "";

    const term = search.toLowerCase();

    students
        .filter(student =>
            (student.name || "").toLowerCase().includes(term) ||
            (student.roll || "").toLowerCase().includes(term)
        )
        .forEach(student => {
            studentTableEl.innerHTML += `
                <tr>
                    <td>${escapeHTML(student.id)}</td>
                    <td>${escapeHTML(student.name)}</td>
                    <td>${escapeHTML(student.roll)}</td>
                    <td>${escapeHTML(student.subject)}</td>
                    <td>${escapeHTML(student.status)}</td>
                    <td>
                        <button onclick="editStudent(${student.id})">Edit</button>
                        <button onclick="deleteStudent(${student.id})">Delete</button>
                    </td>
                </tr>
            `;
        });
}

function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    editingStudent = id;

    const nameEl = document.getElementById("studentName");
    const rollEl = document.getElementById("studentRoll");
    const passwordEl = document.getElementById("studentPassword");
    const subjectEl = document.getElementById("studentSubject");
    const statusEl = document.getElementById("studentStatus");

    if (nameEl) nameEl.value = student.name;
    if (rollEl) rollEl.value = student.roll;
    if (passwordEl) passwordEl.value = student.password;
    if (subjectEl) subjectEl.value = student.subject;
    if (statusEl) statusEl.value = student.status;

    if (saveStudentBtn) saveStudentBtn.textContent = "Update Student";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteStudent(id) {
    if (!confirm("Delete this student?")) return;

    students = students.filter(s => s.id !== id);
    saveStudents();
    renderStudents(searchStudentEl ? searchStudentEl.value : "");
    updateDashboardStats();
}

function clearStudentForm() {
    const ids = ["studentName", "studentRoll", "studentPassword", "studentSubject"];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    const statusEl = document.getElementById("studentStatus");
    if (statusEl) statusEl.value = "Active";
}

if (searchStudentEl) {
    searchStudentEl.addEventListener("keyup", function () {
        renderStudents(this.value);
    });
}

renderStudents();

// ==========================================================
// 5. Student Results
// ==========================================================

let results = [];
try {
    results = JSON.parse(localStorage.getItem("studentResults")) || [];
    if (!Array.isArray(results)) results = [];
} catch {
    results = [];
}

function renderResults(search = "") {
    const table = document.getElementById("resultsTable");
    if (!table) return;

    table.innerHTML = "";

    const term = search.toLowerCase();
    const filtered = results.filter(result =>
        (result.name || "").toLowerCase().includes(term) ||
        (result.roll || "").toLowerCase().includes(term)
    );

    if (filtered.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center">No Results Found</td>
            </tr>
        `;
        return;
    }

    filtered.forEach((result, index) => {
        table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHTML(result.name)}</td>
                <td>${escapeHTML(result.roll)}</td>
                <td>${escapeHTML(result.subject)}</td>
                <td>${escapeHTML(result.score)}/${escapeHTML(result.total)}</td>
                <td>${escapeHTML(result.percentage)}%</td>
                <td>${escapeHTML(result.date)}</td>
                <td>
                    <button onclick="deleteResult(${index})">Delete</button>
                </td>
            </tr>
        `;
    });
}

if (document.getElementById("resultsTable")) {
    renderResults();
}

const resultSearchEl = document.getElementById("resultSearch");
if (resultSearchEl) {
    resultSearchEl.addEventListener("keyup", function () {
        renderResults(this.value);
    });
}

function deleteResult(index) {
    if (!confirm("Delete this result?")) return;
    results.splice(index, 1);
    localStorage.setItem("studentResults", JSON.stringify(results));
    renderResults(resultSearchEl ? resultSearchEl.value : "");
    updateDashboardStats();
}

const exportResultsBtn = document.getElementById("exportResultsBtn");
if (exportResultsBtn) {
    exportResultsBtn.onclick = function () {
        const data = JSON.stringify(results, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "student-results.json";
        a.click();
        URL.revokeObjectURL(url);
    };
}

// ==========================================================
// 6. Dashboard Statistics
// ==========================================================

function updateDashboardStats() {
    const totalStudentsEl = document.getElementById("totalStudents");
    const totalQuestionsEl = document.getElementById("totalQuestions");
    const totalExamsEl = document.getElementById("totalExams");
    const averageScoreEl = document.getElementById("averageScore");
    const passCountEl = document.getElementById("passCount");
    const failCountEl = document.getElementById("failCount");

    if (
        !totalStudentsEl && !totalQuestionsEl && !totalExamsEl &&
        !averageScoreEl && !passCountEl && !failCountEl
    ) {
        return;
    }

    let statStudents = [];
    let statQuestions = [];
    let statResults = [];

    try {
        statStudents = JSON.parse(localStorage.getItem("students")) || [];
        if (!Array.isArray(statStudents)) statStudents = [];
    } catch { statStudents = []; }

    try {
        statQuestions = JSON.parse(localStorage.getItem("examQuestions")) || [];
        if (!Array.isArray(statQuestions)) statQuestions = [];
    } catch { statQuestions = []; }

    try {
        statResults = JSON.parse(localStorage.getItem("studentResults")) || [];
        if (!Array.isArray(statResults)) statResults = [];
    } catch { statResults = []; }

    if (totalStudentsEl) totalStudentsEl.textContent = statStudents.length;
    if (totalQuestionsEl) totalQuestionsEl.textContent = statQuestions.length;
    if (totalExamsEl) totalExamsEl.textContent = statResults.length;

    let totalScore = 0;
    let pass = 0;
    let fail = 0;

    statResults.forEach(result => {
        const pct = Number(result.percentage) || 0;
        totalScore += pct;
        if (pct >= 50) {
            pass++;
        } else {
            fail++;
        }
    });

    const average = statResults.length > 0
        ? (totalScore / statResults.length).toFixed(2)
        : 0;

    if (averageScoreEl) averageScoreEl.textContent = average + "%";
    if (passCountEl) passCountEl.textContent = pass;
    if (failCountEl) failCountEl.textContent = fail;
}

updateDashboardStats();