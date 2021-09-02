import { saveDataToStorage } from "../utils/storage";
import { fetchQuestions } from "./play";

const selectCategory = document.getElementById("category");
const selectTotalQuestion = document.getElementById("total_question");
const selectDifficulty = document.getElementById("difficulty");
const btnPlay = document.getElementById("btn-play");

btnPlay.addEventListener("click", () => {
  const category = selectCategory.value;
  const totalQuestion = selectTotalQuestion.value;
  const difficulty = selectDifficulty.value;
  const config = {
    total_question: totalQuestion,
    category,
    difficulty,
  };

  saveDataToStorage("config", config);

  btnPlay.innerText = "Preparing . . .";
  fetchQuestions(totalQuestion, category, difficulty);
});
