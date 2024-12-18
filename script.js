let quizData;
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

// Load JSON data
fetch('quiz_data.json')
    .then(response => response.json())
    .then(data => {
        quizData = data;
        showQuestion();
    })
    .catch(error => console.error('Error loading quiz data:', error));

    function showQuestion() {
        const questionElement = document.getElementById("question");
        const optionsElement = document.getElementById("options");
        
        let questionData = quizData[currentQuestionIndex];
        questionElement.innerText = questionData.question;
        
        // Clear previous options
        optionsElement.innerHTML = "";
    
        // Show all options
        questionData.options.forEach(option => {
            let optionButton = document.createElement("button");
            optionButton.innerText = option;
            optionButton.addEventListener("click", () => {
                userAnswers.push({ 
                    question: questionData.question,
                    selected: option,
                    correct: questionData.answer
                });
                checkAnswer(option, questionData.answer);
            });
            optionsElement.appendChild(optionButton);
        });
    }
    

function checkAnswer(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        score++;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        showQuestion();
    } else {
        showResult();
    }
}

/**
 * Shows the result of the quiz, including the score and
 * each question with the user's answer and the correct answer.
 *
 * @private
 */
function showResult() {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = `<h2>Quiz Completed!</h2><p>Your Score: ${score}/${quizData.length}</p>`;

    // Display each question with both user's answer and the correct answer
    const resultContainer = document.createElement("div");
    resultContainer.id = "result-details";

    userAnswers.forEach((answer, index) => {
        const answerDiv = document.createElement("div");
        answerDiv.classList.add("answer-summary");

        answerDiv.innerHTML = `
            <p><strong>Question ${index + 1}:</strong> ${answer.question}</p>
            <p>Your Answer: ${answer.selected}</p>
            <p>Correct Answer: ${answer.correct}</p>
        `;

        if (answer.selected !== answer.correct) {
            answerDiv.classList.add("incorrect-answer");
        } else {
            answerDiv.classList.add("correct-answer");
        }

        resultContainer.appendChild(answerDiv);
    });

    quizContainer.appendChild(resultContainer);

    // Add a download button for the report
    const downloadButton = document.createElement("button");
    downloadButton.innerText = "Download Report";
    downloadButton.addEventListener("click", generateReport);
    quizContainer.appendChild(downloadButton);
}

function generateReport() {
    let reportContent = `Quiz Report\n\nScore: ${score}/${quizData.length}\n\n`;

    userAnswers.forEach((answer, index) => {
        reportContent += `Question ${index + 1}: ${answer.question}\n`;
        reportContent += `Your Answer: ${answer.selected}\n`;
        reportContent += `Correct Answer: ${answer.correct}\n\n`;
    });

    // Create a Blob from the report content
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "Quiz_Report.txt";
    a.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
}
