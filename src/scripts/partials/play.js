import axios from "axios";
import Swal from "sweetalert2";
import state from "../state";

import renderResultBoard from "./postplay";
import { saveDataToStorage, getStorageData } from "../utils/storage";
import { htmlDecode, zeroPad } from "../utils/helpers";

import "../components/choice-list";

const btnPlay = document.getElementById("btn-play");
const timer = document.getElementById("timer");
const choices = document.querySelector(".choices");
const preplayBoard = document.getElementById("preplay");
const playBoard = document.getElementById("play");
const gameHelper = document.querySelector(".game-helper");
const questionNumber = document.querySelector(".question p:first-child");
const question = document.querySelector(".question p:last-child");
const prevQuestionBtn = document.getElementById("prev-q");
const nextQuestionBtn = document.getElementById("next-q");
const noq = document.getElementById("noq");

const questionChangedEvent = new Event("questionChanged");

prevQuestionBtn.setAttribute("disabled", true);

const setTimer = () => {
  const config = getStorageData("config");
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

      Swal.fire({
        title: "Time's Up!",
        text: "Awwwwww, don't cry :( Let's try again!",
        icon: "error",
        confirmButtonText: "Yes, sir!",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          renderResultBoard();
        }
      });
    }
  }, 1000);
};

const renderNOQ = () => {
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
};

const renderPlayBoard = () => {
  choices.render();

  renderNOQ();

  preplayBoard.style.display = "none";
  playBoard.style.display = "block";
  gameHelper.style.display = "block";

  const currentQuestion = state.questions[state.currentQuestionNumber - 1];
  questionNumber.innerText = `No. ${state.currentQuestionNumber}`;
  question.innerText = htmlDecode(currentQuestion.question);

  choices.choiceList = currentQuestion.choices;
};

// eslint-disable-next-line import/prefer-default-export
export const fetchQuestions = async (totalQuestion, category, difficulty) => {
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
      correct_answer: q.correct_answer,
    }));

    saveDataToStorage("questions", newQuestions);
    saveDataToStorage("checker", checker);
    state.questions = newQuestions;

    btnPlay.innerText = "Play!";

    renderPlayBoard();
    setTimer();
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener("questionChanged", () => {
  renderPlayBoard();

  if (state.currentQuestionNumber === 10) {
    nextQuestionBtn.innerText = "Finish";
  } else {
    nextQuestionBtn.innerText = "Next";
  }

  if (state.currentQuestionNumber === 1) {
    prevQuestionBtn.setAttribute("disabled", true);
  } else {
    prevQuestionBtn.removeAttribute("disabled");
  }
});

prevQuestionBtn.addEventListener("click", () => {
  state.currentQuestionNumber -= 1;
  document.dispatchEvent(questionChangedEvent);
});

nextQuestionBtn.addEventListener("click", () => {
  if (nextQuestionBtn.innerText === "Finish") {
    Swal.fire({
      title: "You're doing great!",
      text: "You've completed this quiz. Congrats!",
      icon: "success",
      confirmButtonText: "Show result",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        renderResultBoard();
      }
    });
  } else {
    state.currentQuestionNumber += 1;
    document.dispatchEvent(questionChangedEvent);
  }
});

noq.addEventListener("click", (e) => {
  if (e.target.classList.contains("noq-item")) {
    const { number } = e.target.dataset;
    state.currentQuestionNumber = parseInt(number, 10);

    document.dispatchEvent(questionChangedEvent);
  }
});

window.addEventListener("beforeunload", (e) => {
  e.preventDefault();
  e.returnValue = "";
});
