import "./choice-item";

class ChoiceList extends HTMLElement {
  set answers(answers) {
    this.answerDetails = answers;
    this.render();
  }

  render() {
    this.textContent = "";
    this.style.display = "block";

    const alpha = ["A", "B", "C", "D"];

    if (this.answerDetails) {
      const { choices, playerAnswer } = this.answerDetails;
      choices.forEach((choice, i) => {
        const choiceItemEl = document.createElement("choice-item");
        const chosen = playerAnswer === choice ? "chosen" : null;

        choiceItemEl.classList.add(chosen);
        choiceItemEl.choiceItem = {
          choice,
          alpha: alpha[i],
        };
        this.appendChild(choiceItemEl);
      });
    }
  }
}

customElements.define("choice-list", ChoiceList);
