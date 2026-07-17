// ======================================
// Online Examination System
// exam.js (Part 1)
// ======================================

// ======================================
// Student Login Check
// ======================================

const studentName = sessionStorage.getItem("studentName");
const rollNumber = sessionStorage.getItem("rollNumber");
const studentSubject = sessionStorage.getItem("studentSubject");

if (!studentName || !rollNumber) {

    alert("Please login first.");

    window.location.href = "index.html";

}

// ======================================
// One Attempt Check
// ======================================

const examKey = "examCompleted_" + rollNumber;

if (localStorage.getItem(examKey) === "true") {

    alert("You have already completed this exam.");

    window.location.href = "index.html";

}

// ======================================
// Validate Questions
// ======================================

if (
    typeof questions === "undefined" ||
    !Array.isArray(questions) ||
    questions.length === 0
) {

    alert("No questions available.");

    window.location.href = "index.html";

}

// ======================================
// Display Student Details
// ======================================

document.getElementById("studentName").textContent =
    "Student : " + studentName;

document.getElementById("rollNumber").textContent =
    "Roll No : " + rollNumber;

// ======================================
// Variables
// ======================================

let currentQuestion = 0;

let score = 0;

let submitted = false;

let userAnswers = new Array(questions.length).fill(null);

// ======================================
// Load Question
// ======================================

function loadQuestion() {

    const q = questions[currentQuestion];

    document.getElementById("questionNumber").textContent =
        "Question " +
        (currentQuestion + 1) +
        " of " +
        questions.length;

    document.getElementById("questionText").textContent =
        q.question;

    const optionBox =
        document.getElementById("options");

    optionBox.innerHTML = "";

    q.options.forEach(function (option, index) {

        const label =
            document.createElement("label");

        label.className = "option";

        label.innerHTML = `

            <input
                type="radio"
                name="answer"
                value="${index}"
                ${userAnswers[currentQuestion] === index ? "checked" : ""}
            >

            ${option}

        `;

        optionBox.appendChild(label);

    });

    updatePalette();

    updateProgress();

}

// ======================================
// Save Selected Answer
// ======================================

document.addEventListener("change", function (e) {

    if (e.target.name === "answer") {

        userAnswers[currentQuestion] =
            Number(e.target.value);

        updatePalette();

        updateProgress();

    }

});

// ======================================
// Create Question Palette
// ======================================

function createPalette() {

    const palette =
        document.getElementById("paletteContainer");

    palette.innerHTML = "";

    questions.forEach(function (q, index) {

        const btn =
            document.createElement("button");

        btn.className = "palette-btn";

        btn.textContent = index + 1;

        if (index === currentQuestion) {

            btn.classList.add("active");

        }

        if (userAnswers[index] !== null) {

            btn.classList.add("answered");

        }

        btn.onclick = function () {

            currentQuestion = index;

            loadQuestion();

        };

        palette.appendChild(btn);

    });

}

// ======================================
// Update Palette
// ======================================

function updatePalette() {

    const buttons =
        document.querySelectorAll(".palette-btn");

    buttons.forEach(function (btn, index) {

        btn.classList.remove("active");

        btn.classList.remove("answered");

        if (index === currentQuestion) {

            btn.classList.add("active");

        }

        if (userAnswers[index] !== null) {

            btn.classList.add("answered");

        }

    });

}

// ======================================
// Initial Load
// ======================================

createPalette();

loadQuestion();
// ======================================
// Progress Bar
// ======================================

function updateProgress() {

    const answered =
        userAnswers.filter(answer => answer !== null).length;

    document.getElementById("progressText").textContent =
        answered + " / " + questions.length + " Answered";

    const percentage =
        (answered / questions.length) * 100;

    document.getElementById("progressFill").style.width =
        percentage + "%";

}

// ======================================
// Previous Button
// ======================================

document.getElementById("previousBtn").addEventListener("click", function () {

    if (currentQuestion > 0) {

        currentQuestion--;

        loadQuestion();

    }

});

// ======================================
// Next Button
// ======================================

document.getElementById("nextBtn").addEventListener("click", function () {

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        loadQuestion();

    }

});

// ======================================
// Submit Button
// ======================================

document.getElementById("submitBtn").addEventListener("click", function () {

    submitExam(false);

});

// ======================================
// Submit Exam
// ======================================

function submitExam(autoSubmit = false) {

    if (submitted) return;

    if (!autoSubmit) {

        const ok = confirm(
            "Are you sure you want to submit the exam?"
        );

        if (!ok) return;

    }

    submitted = true;

    clearInterval(countdown);

    score = 0;

    questions.forEach(function (question, index) {

        if (userAnswers[index] === question.answer) {

            score++;

        }

    });

    sessionStorage.setItem("score", score);

    sessionStorage.setItem(
        "totalQuestions",
        questions.length
    );

    sessionStorage.setItem(
        "userAnswers",
        JSON.stringify(userAnswers)
    );

    localStorage.setItem(examKey, "true");

    let results =
        JSON.parse(localStorage.getItem("studentResults")) || [];

    results = results.filter(function (result) {

        return result.roll !== rollNumber;

    });

    results.push({

        name: studentName,

        roll: rollNumber,

        subject: studentSubject,

        score: score,

        total: questions.length,

        percentage:
            ((score / questions.length) * 100).toFixed(2),

        date: new Date().toLocaleString()

    });

    localStorage.setItem(
        "studentResults",
        JSON.stringify(results)
    );

    window.location.href = "result.html";

}
// ======================================
// Timer (30 Minutes)
// ======================================

let totalTime = 30 * 60;

const timerElement = document.getElementById("timer");

const countdown = setInterval(function () {

    if (submitted) {

        clearInterval(countdown);

        return;

    }

    const minutes = Math.floor(totalTime / 60);

    const seconds = totalTime % 60;

    timerElement.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");

    if (totalTime <= 0) {

        clearInterval(countdown);

        alert("Time is over. Your exam will be submitted.");

        submitExam(true);

        return;

    }

    totalTime--;

}, 1000);

// ======================================
// Disable Browser Back
// ======================================

history.pushState(null, "", location.href);

window.addEventListener("popstate", function () {

    history.pushState(null, "", location.href);

});

// ======================================
// Warn Before Refresh/Close
// ======================================

window.addEventListener("beforeunload", function (e) {

    if (!submitted) {

        e.preventDefault();

        e.returnValue = "";

    }

});

// ======================================
// Disable Right Click
// ======================================

document.addEventListener("contextmenu", function (e) {

    e.preventDefault();

});

// ======================================
// Disable Shortcut Keys
// ======================================

document.addEventListener("keydown", function (e) {

    if (

        e.key === "F12" ||

        (e.ctrlKey && e.shiftKey && e.key === "I") ||

        (e.ctrlKey && e.shiftKey && e.key === "J") ||

        (e.ctrlKey && e.shiftKey && e.key === "C") ||

        (e.ctrlKey && e.key === "U")

    ) {

        e.preventDefault();

    }

});

// ======================================
// Fullscreen
// ======================================

function enterFullscreen() {

    if (!document.fullscreenElement) {

        if (document.documentElement.requestFullscreen) {

            document.documentElement.requestFullscreen().catch(() => {});

        }

    }

}

// Start fullscreen after user interaction
document.addEventListener("click", function fullscreenStart() {

    enterFullscreen();

    document.removeEventListener("click", fullscreenStart);

});

document.addEventListener("fullscreenchange", function () {

    if (!document.fullscreenElement && !submitted) {

        alert("Please stay in Fullscreen Mode during the exam.");

    }

});

// ======================================
// Initialize
// ======================================

updateProgress();

updatePalette();

createPalette();

loadQuestion();