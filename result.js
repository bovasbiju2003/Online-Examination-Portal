// ======================================
// Student Result Details
// ======================================

const studentName = sessionStorage.getItem("studentName");
const rollNumber = sessionStorage.getItem("rollNumber");
const score = Number(sessionStorage.getItem("score"));
const totalQuestions = Number(sessionStorage.getItem("totalQuestions"));
const userAnswers =
    JSON.parse(sessionStorage.getItem("userAnswers")) || [];

// Check Login
if (!studentName || !rollNumber) {

    alert("Please login first.");

    window.location.href = "index.html";

}

// ======================================
// Display Student Details
// ======================================

document.getElementById("studentName").innerHTML =
    studentName;

document.getElementById("rollNumber").innerHTML =
    rollNumber;

document.getElementById("score").innerHTML =
    score;

document.getElementById("total").innerHTML =
    totalQuestions;


// ======================================
// Percentage
// ======================================

const percentage =
    ((score / totalQuestions) * 100).toFixed(2);

document.getElementById("percentage").innerHTML =
    percentage + "%";


// ======================================
// Pass / Fail
// ======================================

const statusElement =
    document.getElementById("status");

if (percentage >= 50) {

    statusElement.innerHTML = "PASS";

    statusElement.style.color = "green";

} else {

    statusElement.innerHTML = "FAIL";

    statusElement.style.color = "red";

}


// ======================================
// Review Answers
// ======================================

const reviewContainer =
    document.getElementById("reviewContainer");

let html = "";

questions.forEach((question, index) => {

    const studentAnswer =
        userAnswers[index];

    const correctAnswer =
        question.answer;

    const isCorrect =
        studentAnswer === correctAnswer;

    html += `

    <div class="review-card">

        <h3>
            Question ${index + 1}
        </h3>

        <p>

            <strong>
            ${question.question}
            </strong>

        </p>

        <p>

            Your Answer :

            ${
                studentAnswer !== null
                ?
                question.options[studentAnswer]
                :
                "Not Answered"
            }

        </p>

        <p>

            Correct Answer :

            ${question.options[correctAnswer]}

        </p>

        <p style="color:${
            isCorrect ? "green" : "red"
        }">

            ${
                isCorrect
                ?
                "✔ Correct"
                :
                "✖ Wrong"
            }

        </p>

    </div>

    `;

});

reviewContainer.innerHTML = html;


// ======================================
// Print Result
// ======================================

document.getElementById("printBtn").onclick =
function(){

    window.print();

};


// ======================================
// Home Button
// ======================================

document.getElementById("homeBtn").onclick =
function(){

    sessionStorage.clear();

    window.location.href = "index.html";

};