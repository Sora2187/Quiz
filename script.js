let quizData;
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

// Load JSON data (replace 'quiz_data.json' with the JSON file path)
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
    questionElement.innerText = questionData.Question;
    
    // Clear previous options
    optionsElement.innerHTML = "";

    // Show options
    ['Option 1', 'Option 2'].forEach(optionKey => {
        let optionButton = document.createElement("button");
        optionButton.innerText = questionData[optionKey];
        optionButton.addEventListener("click", () => {
            userAnswers.push({ 
                question: questionData.Question,
                selected: questionData[optionKey],
                correct: questionData["Correct Answer"]
            });
            checkAnswer(questionData[optionKey], questionData["Correct Answer"]);
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

function showResult() {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = `<h2>Quiz Completed!</h2><p>Your Score: ${score}/${quizData.length}</p>`;
    
    // Display incorrect answers and correct answers
    const resultContainer = document.createElement("div");
    resultContainer.id = "result-details";

    userAnswers.forEach((answer, index) => {
        if (answer.selected !== answer.correct) {
            const incorrectAnswerDiv = document.createElement("div");
            incorrectAnswerDiv.classList.add("incorrect-answer");
            incorrectAnswerDiv.innerHTML = `
                <p><strong>Question ${index + 1}:</strong> ${answer.question}</p>
                <p>Your Answer: ${answer.selected}</p>
                <p>Correct Answer: ${answer.correct}</p>
            `;
            resultContainer.appendChild(incorrectAnswerDiv);
        }
    });

    if (resultContainer.innerHTML === "") {
        resultContainer.innerHTML = "<p>Great job! You answered all questions correctly.</p>";
    }
    
    quizContainer.appendChild(resultContainer);
}
