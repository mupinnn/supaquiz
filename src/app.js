import "./assets/scss/main.scss";
import axios from "axios";

axios.defaults.baseURL = "https://opentdb.com/";

/**
 * TODO: show result details (answer & questions, which correct and incorrect)
 * TODO: save fresh encoded questions response to localStorage
 * TODO: save progress when accidentally refresh or disconnected
 */

const state = {
  categories: [],
  questions: [],
  currentQuestion: 1,
};

const selectCategory = document.getElementById("category");
const selectTotalQuestions = document.getElementById("total_question");
const selectDifficulty = document.getElementById("difficulty");
const btnPlay = document.getElementById("btn-play");
const btnReplay = document.getElementById("btn-replay");
const preplayBoard = document.getElementById("preplay");
const playBoard = document.getElementById("play");
const postplayBoard = document.getElementById("postplay");
const gameHelper = document.querySelector(".game-helper");
const questionNumber = document.querySelector(".question p:first-child");
const question = document.querySelector(".question p:last-child");
const choices = document.querySelector(".choices");
const prevQuestionBtn = document.getElementById("prev-q");
const nextQuestionBtn = document.getElementById("next-q");
const ddScore = document.getElementById("dd-score");
const ddGrade = document.getElementById("dd-grade");
const timer = document.getElementById("timer");
const noq = document.getElementById("noq");

selectCategory.setAttribute("disabled", true);
prevQuestionBtn.setAttribute("disabled", true);

function htmlDecode(input) {
  const doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

function zeroPad(num, places) {
  return String(num).padStart(places, "0");
}

function setTimer() {
  const config = JSON.parse(localStorage.getItem("config"));
  const totalQuestion = parseInt(config.total_question, 10);
  let baseTime = 60000;

  if (totalQuestion === 10) {
    baseTime *= 3;
  } else if (totalQuestion === 30) {
    baseTime *= 7;
  } else {
    baseTime *= 12;
  }

  const quizTime = new Date().getTime() + baseTime;
  const cpTimer = timer.cloneNode(true);

  const x = setInterval(() => {
    const countdown = quizTime - new Date().getTime();
    const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countdown % (1000 * 60)) / 1000);

    timer.innerHTML = `
      <span>00</span>:
      <span>${zeroPad(minutes, 2)}</span>:
      <span>${zeroPad(seconds, 2)}</span>
    `;

    if (countdown < 0) {
      clearInterval(x);
      timer.replaceWith(cpTimer);
    }
  }, 1000);
}

function renderCategories() {
  state.categories.forEach((category) => {
    selectCategory.insertAdjacentHTML(
      "beforeend",
      `<option value="${category.id}">${category.name}</option>`
    );
  });
}

function renderNOQ() {
  noq.textContent = "";
  state.questions.forEach((q) => {
    const answered = q.answer !== "" ? "answered" : "";
    noq.insertAdjacentHTML(
      "beforeend",
      `
      <div class="noq-item ${answered}" data-number="${q.number}">
        ${q.number}
      </div>
      `
    );
  });
}

function renderPlayBoard() {
  choices.textContent = "";

  preplayBoard.style.display = "none";
  playBoard.style.display = "block";
  gameHelper.style.display = "block";

  renderNOQ();

  const alpha = ["A", "B", "C", "D"];
  const currentQuestion = state.questions[state.currentQuestion - 1];
  questionNumber.innerText = `No. ${state.currentQuestion}`;
  question.innerText = htmlDecode(currentQuestion.question);

  currentQuestion.choices.forEach((choice, i) => {
    const chosen =
      currentQuestion.answer === htmlDecode(choice) ? "chosen" : "";
    choices.insertAdjacentHTML(
      "beforeend",
      `
      <button class="btn btn-choices ${chosen}" data-answer="${choice}">
        ${alpha[i]}. ${choice}
      </button>
      `
    );
  });
}

function renderGrade(score) {
  let grade;

  if (score >= 90) {
    grade = "A";
  } else if (score < 90 && score >= 80) {
    grade = "B";
  } else if (score < 80 && score >= 70) {
    grade = "C";
  } else if (score < 70 && score >= 60) {
    grade = "D";
  } else {
    grade = "E";
  }

  return grade;
}

function calculateResult() {
  const checker = JSON.parse(localStorage.getItem("checker"));
  const answers = JSON.parse(localStorage.getItem("questions"));
  const results = answers.map((a) => {
    const correctAnswer = checker.find(
      (c) => c.number === a.number
    ).correct_answer;

    return {
      player_answer: a.answer,
      number: a.number,
      question: a.question,
      correct_answer: correctAnswer,
      is_correct: correctAnswer === a.answer,
    };
  });

  const totalQuestion = results.length;
  const totalCorrect = results.filter((r) => r.is_correct).length;
  const score = ((totalCorrect / totalQuestion) * 100).toFixed(2);

  ddScore.innerText = score;
  ddGrade.innerText = renderGrade(score);
}

function renderResultBoard() {
  console.log("result");
  preplayBoard.style.display = "none";
  playBoard.style.display = "none";
  postplayBoard.style.display = "block";
  gameHelper.style.display = "none";

  calculateResult();
}

async function fetchCategories() {
  try {
    const response = await axios.get("api_category.php");
    const categories = response.data.trivia_categories;

    selectCategory.removeAttribute("disabled");
    localStorage.setItem("categories", JSON.stringify(categories));
    state.categories = categories;

    renderCategories();
  } catch (error) {
    console.error(error);
  }
}

async function fetchQuestions(totalQuestion, category, difficulty) {
  try {
    const response = await axios.get("api.php", {
      params: {
        amount: totalQuestion,
        type: "multiple",
        difficulty,
        category: category === "any" ? null : category,
      },
    });
    const questions = response.data.results;
    const newQuestions = questions.map((q, i) => ({
      number: i + 1,
      question: q.question,
      choices: [q.correct_answer, ...q.incorrect_answers],
      answer: "",
    }));
    const checker = questions.map((q, i) => ({
      number: i + 1,
      question: q.question,
      correct_answer: q.correct_answer,
    }));

    localStorage.setItem("checker", JSON.stringify(checker));
    localStorage.setItem("questions", JSON.stringify(newQuestions));
    state.questions = newQuestions;
    btnPlay.innerText = "Play!";
    renderPlayBoard();
    setTimer();
  } catch (error) {
    console.error(error);
  }
}

const savedCategories = JSON.parse(localStorage.getItem("categories"));

if (savedCategories) {
  state.categories = savedCategories;
  selectCategory.removeAttribute("disabled");
  renderCategories();
} else {
  fetchCategories();
}

btnPlay.addEventListener("click", () => {
  const totalQuestion = selectTotalQuestions.value;
  const category = selectCategory.value;
  const difficulty = selectDifficulty.value;
  const config = {
    total_question: totalQuestion,
    category,
    difficulty,
  };

  localStorage.setItem("config", JSON.stringify(config));

  btnPlay.innerText = "Preparing . . .";
  fetchQuestions(totalQuestion, category, difficulty);
});

btnReplay.addEventListener("click", () => {
  localStorage.removeItem("questions");
  localStorage.removeItem("answers");
  localStorage.removeItem("checker");
  localStorage.removeItem("config");

  window.location.reload();
});

const questionChangedEvent = new Event("questionChanged");

document.addEventListener("questionChanged", () => {
  console.log("question changed");
  console.log("current no : ", state.currentQuestion);
  renderPlayBoard();

  if (state.currentQuestion === 10) {
    nextQuestionBtn.innerText = "Finish";
  } else {
    nextQuestionBtn.innerText = "Next";
  }

  if (state.currentQuestion === 1) {
    prevQuestionBtn.setAttribute("disabled", true);
  } else {
    prevQuestionBtn.removeAttribute("disabled");
  }
});

nextQuestionBtn.addEventListener("click", () => {
  if (nextQuestionBtn.innerText === "Finish") {
    renderResultBoard();
  } else {
    state.currentQuestion += 1;
    document.dispatchEvent(questionChangedEvent);
  }
});

prevQuestionBtn.addEventListener("click", () => {
  state.currentQuestion -= 1;

  document.dispatchEvent(questionChangedEvent);
});

choices.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-choices")) {
    const btnChoices = document.querySelectorAll(".choices .btn-choices");
    btnChoices.forEach((btn) => {
      btn.classList.remove("chosen");
    });
    e.target.classList.add("chosen");

    const questions = state.questions.filter(
      ({ number }) => number === state.currentQuestion
    );
    questions[0].answer = e.target.dataset.answer;
    const updatedQuestionsIndex = state.questions.findIndex(
      (q) => q.number === questions[0].number
    );

    state.questions = [
      ...state.questions.slice(0, updatedQuestionsIndex),
      questions[0],
      ...state.questions.slice(updatedQuestionsIndex + 1),
    ];

    localStorage.setItem("questions", JSON.stringify(state.questions));
  }
});

noq.addEventListener("click", (e) => {
  if (e.target.classList.contains("noq-item")) {
    const { number } = e.target.dataset;
    state.currentQuestion = parseInt(number, 10);

    document.dispatchEvent(questionChangedEvent);
  }
});
