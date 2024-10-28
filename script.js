let quizData;
let currentQuestionIndex = 0;
let score = 0;

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
        optionButton.addEventListener("click", () => checkAnswer(questionData[optionKey], questionData["Correct Answer"]));
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
    document.getElementById("quiz-container").innerHTML = `Quiz Completed! Your Score: ${score}/${quizData.length}`;
}
