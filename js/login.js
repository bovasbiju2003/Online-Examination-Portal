// ======================================
// Student Login (Corrected)
// ======================================
// Note: the original comparison logic was correct — if login was still
// failing, the real cause is almost always one of:
//   1. Admin dashboard and student login opened from different origins
//      (e.g. file:// vs http://127.0.0.1:5500) -> localStorage is
//      scoped per-origin, so saved students won't be visible.
//   2. The admin page was loading an outdated JS file where the
//      "Save Student" button had no working click handler attached.
//
// This version adds String() coercion as a defensive measure in case
// roll numbers ever end up stored as numbers vs strings, plus null-checks.

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = (document.getElementById("name")?.value || "").trim();
        const roll = (document.getElementById("roll")?.value || "").trim();
        const password = (document.getElementById("password")?.value || "").trim();

        let students = [];
        try {
            students = JSON.parse(localStorage.getItem("students")) || [];
            if (!Array.isArray(students)) students = [];
        } catch {
            students = [];
        }

        // Defensive: coerce both sides to string, in case roll was ever
        // saved as a number rather than text.
        const student = students.find(s =>
            String(s.roll) === String(roll) &&
            String(s.password) === String(password)
        );

        if (!student) {
            alert("Invalid Roll Number or Password");
            return;
        }

        if (student.status === "Blocked") {
            alert("Your account has been blocked.");
            return;
        }

        sessionStorage.setItem("studentName", student.name);
        sessionStorage.setItem("rollNumber", student.roll);
        sessionStorage.setItem("studentSubject", student.subject);
        sessionStorage.setItem("studentId", student.id);

        window.location.href = "exam.html";
    });
}