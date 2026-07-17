// ======================================
// Online Exam Security
// ======================================

// Warning Counter

let warningCount = 0;

const MAX_WARNINGS = 3;

// ======================================
// Disable Right Click
// ======================================

document.addEventListener("contextmenu", function(e){

    e.preventDefault();

    alert("Right Click Disabled");

});

// ======================================
// Disable Copy
// ======================================

document.addEventListener("copy", function(e){

    e.preventDefault();

});

// ======================================
// Disable Cut
// ======================================

document.addEventListener("cut", function(e){

    e.preventDefault();

});

// ======================================
// Disable Paste
// ======================================

document.addEventListener("paste", function(e){

    e.preventDefault();

});

// ======================================
// Disable Text Selection
// ======================================

document.onselectstart = function(){

    return false;

};

// ======================================
// Disable Drag
// ======================================

document.ondragstart = function(){

    return false;

};

// ======================================
// Disable Keyboard Shortcuts
// ======================================

document.addEventListener("keydown", function(e){

    // F12

    if(e.key==="F12"){

        e.preventDefault();

    }

    // Ctrl+Shift+I

    if(e.ctrlKey && e.shiftKey && e.key==="I"){

        e.preventDefault();

    }

    // Ctrl+Shift+J

    if(e.ctrlKey && e.shiftKey && e.key==="J"){

        e.preventDefault();

    }

    // Ctrl+Shift+C

    if(e.ctrlKey && e.shiftKey && e.key==="C"){

        e.preventDefault();

    }

    // Ctrl+U

    if(e.ctrlKey && e.key==="u"){

        e.preventDefault();

    }

    // Ctrl+S

    if(e.ctrlKey && e.key==="s"){

        e.preventDefault();

    }

});

// ======================================
// Full Screen
// ======================================

function openFullscreen(){

    if(document.documentElement.requestFullscreen){

        document.documentElement.requestFullscreen();

    }

}

openFullscreen();

// ======================================
// Detect Exit Full Screen
// ======================================

document.addEventListener("fullscreenchange", function(){

    if(!document.fullscreenElement){

        warningCount++;

        alert(

        "Warning "+warningCount+

        "/"+MAX_WARNINGS+

        "\\nPlease stay in Full Screen."

        );

        if(warningCount>=MAX_WARNINGS){

            alert("Exam Submitted.");

            submitExam();

        }

    }

});

// ======================================
// Detect Tab Change
// ======================================

document.addEventListener("visibilitychange",function(){

    if(document.hidden){

        warningCount++;

        alert(

        "Tab Switching Detected\\nWarning "

        +warningCount+

        "/"+MAX_WARNINGS

        );

        if(warningCount>=MAX_WARNINGS){

            alert("Exam Submitted.");

            submitExam();

        }

    }

});

// ======================================
// Disable Back Button
// ======================================

history.pushState(null,null,location.href);

window.onpopstate=function(){

    history.go(1);

};

// ======================================
// Refresh Warning
// ======================================

window.onbeforeunload=function(){

    return "Leaving this page will submit your exam.";

};