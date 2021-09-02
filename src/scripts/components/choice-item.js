import state from "../state";
import { saveDataToStorage } from "../utils/storage";

class ChoiceItem extends HTMLElement {
  connectedCallback() {
    this.addEventListener("click", this.chooseAnswer);
  }

  set choiceItem(choice) {
    this.choice = choice;
    this.render();
  }

  chooseAnswer() {
    const allChoice = document.querySelectorAll(".btn-choices");
    allChoice.forEach((btn) => {
      btn.classList.remove("chosen");
    });
    this.classList.add("chosen");

    const questions = state.questions.filter(
      ({ number }) => number === state.currentQuestionNumber
    );
    questions[0].answer = this.dataset.answer;
    const updatedQuestionsIndex = state.questions.findIndex(
      (q) => q.number === questions[0].number
    );

    state.questions = [
      ...state.questions.slice(0, updatedQuestionsIndex),
      questions[0],
      ...state.questions.slice(updatedQuestionsIndex + 1),
    ];

    saveDataToStorage("questions", state.questions);
  }

  render() {
    const { choice, alpha } = this.choice;

    this.classList.add("btn", "btn-choices");
    this.setAttribute("data-answer", choice);
    this.innerHTML = `${alpha}. ${choice}`;
  }
}

customElements.define("choice-item", ChoiceItem);
