let quizData;
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

// Load JSON data
fetch("./quiz_data.json")
  .then((response) => response.json())
  .then((data) => {
    quizData = data;
    showQuestion();
  })
  .catch((error) => {
    console.error("Error loading quiz data:", error);
    document.getElementById("quiz-container").innerHTML = `
            <p style="color: red;">Failed to load quiz data. Please try again later.</p>
        `;
  });

function showQuestion() {
  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("options");

  let questionData = quizData[currentQuestionIndex];
  questionElement.innerText = questionData.question;

  optionsElement.innerHTML = ""; // Clear previous options

  questionData.options.forEach((option) => {
    let optionButton = document.createElement("button");
    optionButton.innerText = option;
    optionButton.addEventListener("click", () => {
      if (!optionButton.disabled) {
        const buttons = document.querySelectorAll("#options button");
        buttons.forEach((btn) => (btn.disabled = true)); // Disable all buttons
        userAnswers.push({
          question: questionData.question,
          selected: option,
          correct: questionData.answer,
        });
        checkAnswer(option, questionData.answer);
      }
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
    setTimeout(showQuestion, 500); // Small delay for better UX
  } else {
    showResult();
  }
}

function showResult() {
  if (window.scrollY > 0) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const quizContainer = document.getElementById("quiz-container");
  quizContainer.innerHTML = `<h2>Quiz Completed!</h2><p>Your Score: ${score}/${quizData.length}</p>`;

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

  const blob = new Blob([reportContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  const date = new Date().toISOString().split("T")[0];
  a.href = url;
  a.download = `Quiz_Report_${date}.txt`;
  a.click();

  URL.revokeObjectURL(url); // Clean up
}
