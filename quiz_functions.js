/*
Quiz Functions for organization and modularity
This file contains functions to handle quiz interactions, such as starting the quiz and submitting answers.
*/
var quizFuncs = {};
//hold quiz state variables
var quizState = {
    quizScore: 0,
    quizQuestions: 0,
    quizAnswered: 0,
    quizStartTime: null,
    maxScore: 0
};
/*------------------------------------------------------------
    Array for all quiz questions and answers
    Normally would be filled through function calls or external files
    Done manually for brevity
------------------------------------------------------------*/
var questionsData = [
    {
        type: "mc",
        question: "Why is phishing often more appealing to attackers than malware?",
        answers: [
            { text: "Obtaining credentials makes intrusions difficult to detect", correct: true },
            { text: "Obtaining credentials allows them to bypass all security measures", correct: false },
            { text: "Stealing credentials requires less skill", correct: false },
            { text: "Attackers can guarantee administrator access with phishing", correct: false }
        ]
    },
    {
        type: "tf",
        question: "True or False: Using different variations of the same password for multiple accounts can be an effective security measure.",
        answers: [
            { text: "True", correct: false },
            { text: "False", correct: true }
        ]
    },
    {
        type: "ms",
        question: "Select all the items below which could be characteristics of a strong password:",
        answers: [
            { text: "Is a randomized string of characters", correct: true },
            { text: "Is a combination of several unrelated words", correct: true },
            { text: "Is at least 16 characters long", correct: true },
            { text: "Is easy to memorize", correct: false },
            { text: "It is unique and not reused across accounts", correct: true }

        ]
    },
    {
        type: "mc",
        question: "Multi-factor authentication enhances security by:",
        answers: [
            { text: "Requiring attackers to compromise both the user's password and second factor", correct: true },
            { text: "Eliminating the need for passwords entirely by using other authentication methods", correct: false },
            { text: "Storing and encrypting all of the user's passwords securely", correct: false },
            { text: "Reducing the number of steps to log in", correct: false }
        ]
    },
    {
        type: "ms",
        question: "Why is it so important to follow the 4 best practices with passwords?",
        answers: [
            { text: "Failing to follow them can lead to data breaches and leaks", correct: true },
            { text: "Attackers can cause significant damage to personal and organizational security", correct: true },
            { text: "To reduce the number of passwords you need to remember", correct: false },
            { text: "Weak passwords act as easy access points for attackers to exploit", correct: true }
        ]
    }
]
/*------------------------------------------------------------
    initialize the quiz and set all state vartiables
------------------------------------------------------------*/
quizFuncs.init = function() {
    // Initialize quiz variables and start the quiz
    quizState.quizQuestions = questionsData.length;
    quizState.quizStartTime = new Date();
    quizState.quizScore = 0;
    quizState.quizAnswered = 0;
    quizState.maxScore = quizFuncs.calculateMaxScore();
    // ScormProcessInitialize();
    //call question rendering function
    quizFuncs.renderQuestions();
};


/*------------------------------------------------------------
    function to calculate the maximum score, including multi-select questions
    This is used to determine the total points possible for the quiz
------------------------------------------------------------*/
quizFuncs.calculateMaxScore = function(isMSExtra = false) {
    if(!isMSExtra) {
        return questionsData.length; // 1 point per question if not each ms answer as 1 point
    }
    // Calculate the maximum score based on the number of questions and ms questions
    let maxScore = 0;
    questionsData.forEach(q => {
        if (q.type === "mc" || q.type === "tf" || q.type === "text") {
            maxScore += 1; // 1 point for single choice and text questions
        } else if (q.type === "ms") {
            maxScore += q.answers.filter(a => a.correct).length; // points for each correct answer in multi-select
        }
    });
    return maxScore;
};

/*------------------------------------------------------------
    function for rendering the questions to the page
    Creates the HTML for each question and its answers using questionData
------------------------------------------------------------*/
quizFuncs.renderQuestions = function() {
    const quizForm = document.getElementById("quiz_form");
    quizForm.innerHTML = ""; // Clear existing content;
    questionsData.forEach((q, index) => {
        let html = `<div class="question"><p><strong>Q${index + 1}:</strong> ${q.question}</p>`;
        if (q.type === "mc") {
            q.answers.forEach((a, i) => {
                html += `<label><input type="radio" name="q${index}" value="${i}"> ${a.text}</label><br>`;
            });
        } else if (q.type === "tf") {
            q.answers.forEach((a, i) => {
                html += `<label><input type="radio" name="q${index}" value="${i}"> ${a.text}</label><br>`;
            });
        } else if (q.type === "ms") {
            q.answers.forEach((a, i) => {
                html += `<label><input type="checkbox" name="q${index}" value="${i}"> ${a.text}</label><br>`;
            });
        } else if (q.type === "text") {
            html += `<input type="text" name="q${index}" placeholder="Your answer here"><br>`;
        }
        html += `</div>`;
        quizForm.innerHTML += html;
    });
    quizForm.innerHTML += `<button type="submit">Submit Quiz</button>`;
    // Add event listener for form submission
    quizForm.addEventListener("submit", function(event) {
        event.preventDefault();
        quizFuncs.submitQuiz();
    });
};

/*------------------------------------------------------------
    function for submitting the quiz
    This will check answers, calculate score, and update SCORM values
------------------------------------------------------------*/
quizFuncs.submitQuiz = function() {
    // if (!confirm("Are you sure you want to submit your answers?")) {
    //     return false;  // Cancel submission
    // }
    quizState.quizScore = 0;
    questionsData.forEach((q, index) => {
        const answerElements = document.getElementsByName(`q${index}`);
        if (q.type === "mc" || q.type === "tf") {
            const selected = Array.from(answerElements).find(el => el.checked);
            if (selected && q.answers[selected.value].correct) {
                quizState.quizScore++;
            }
        } else if (q.type === "ms") {
            //award 1 score if all correct boxes are checked and no incorrect boxes are checked
            const selected = Array.from(answerElements).filter(el => el.checked);
            const answers = Array.from(answerElements);
            let allCorrect = true;
            let noIncorrect = true;
            for (let i = 0; i < answers.length; i++) {
                if (selected.includes(answers[i])) {
                    if (!q.answers[answers[i].value].correct) {
                        noIncorrect = false;
                    }
                }if (!selected.includes(answers[i])) {
                    if (q.answers[answers[i].value].correct) {
                        allCorrect = false;
                    }
                }
            }
            if (allCorrect && noIncorrect) {
                quizState.quizScore++;
            }
        } else if (q.type === "text") {
            const input = answerElements[0].value.trim();
            if (input.toLowerCase() === q.answers[0].text.toLowerCase()) {
                quizState.quizScore++;
            }
        }

    });
    quizFuncs.finishQuiz();
    window.close();
    return false;
};

/*------------------------------------------------------------
    function to finish the quiz
    Helper for updating SCORM values
------------------------------------------------------------*/
quizFuncs.finishQuiz = function() {
    let scorePercentage = (quizState.quizScore / quizState.maxScore) * 100;
    let timeTaken = Math.round((new Date() - quizState.quizStartTime) / 1000); // in seconds
    let status = (scorePercentage >= 80) ? "passed" : "failed";
    let suspendData = ScormProcessGetValue("cmi.suspend_data");
    let video_time = 0;
    try {
        let dataObj = JSON.parse(suspendData);
        video_time = dataObj.time_elapsed || 0;
    } catch (e) {
        console.warn("Error parsing suspend data:", e);
    }
    let totalTime = video_time + timeTaken;
    ScormProcessSetValue("cmi.score.min", 0);
    ScormProcessSetValue("cmi.score.max", quizState.maxScore);
    ScormProcessSetValue("cmi.score.raw", quizState.quizScore);
    ScormProcessSetValue("cmi.score.scaled", scorePercentage/100);
    ScormProcessSetValue("cmi.completion_status", "completed");
    ScormProcessSetValue("cmi.progress_measure", 1);
    ScormProcessSetValue("cmi.success_status", status);
    ScormProcessSetValue("cmi.session_time", quizFuncs.toScormTime(totalTime));
    //Exit process
    alert(`Quiz completed! You scored ${quizState.quizScore} out of ${quizState.maxScore} (${scorePercentage.toFixed(2)}%).\nTime taken: ${timeTaken} seconds.\nStatus: ${status}.`);
    ScormProcessCommit();
    ScormProcessSetValue("cmi.exit", "");
    ScormProcessTerminate();

};

/*------------------------------------------------------------
    Function to convert total seconds to SCORM time format
    Format: PT#H#M#S (e.g., PT1H30M15S for 1 hour, 30 minutes, and 15 seconds)
------------------------------------------------------------*/
quizFuncs.toScormTime = function(totalSeconds) {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    return `PT${hours}H${minutes}M${seconds}S`;
}
