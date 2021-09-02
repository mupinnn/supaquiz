import { htmlDecode } from "../utils/helpers";
import { getStorageData } from "../utils/storage";

const preplayBoard = document.getElementById("preplay");
const playBoard = document.getElementById("play");
const postplayBoard = document.getElementById("postplay");
const gameHelper = document.querySelector(".game-helper");
const ddScore = document.getElementById("dd-score");
const ddGrade = document.getElementById("dd-grade");
const btnReplay = document.getElementById("btn-replay");

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
  const checker = getStorageData("checker");
  const answers = getStorageData("questions");
  const results = answers.map((a) => {
    const playerAnswer = htmlDecode(a.answer);
    const correctAnswer = htmlDecode(
      checker.find((c) => c.number === a.number).correct_answer
    );

    return {
      player_answer: playerAnswer,
      number: a.number,
      question: a.question,
      correct_answer: correctAnswer,
      is_correct: correctAnswer === playerAnswer,
    };
  });

  const totalQuestion = results.length;
  const totalCorrect = results.filter((r) => r.is_correct).length;
  const score = ((totalCorrect / totalQuestion) * 100).toFixed(2);

  ddScore.innerText = score;
  ddGrade.innerText = renderGrade(score);
}

const renderResultBoard = () => {
  preplayBoard.style.display = "none";
  playBoard.style.display = "none";
  postplayBoard.style.display = "block";
  gameHelper.style.display = "none";

  calculateResult();
};

btnReplay.addEventListener("click", () => {
  localStorage.removeItem("questions");
  localStorage.removeItem("answers");
  localStorage.removeItem("checker");
  localStorage.removeItem("config");

  window.location.reload();
});

export default renderResultBoard;
