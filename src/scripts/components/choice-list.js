import "./choice-item";

class ChoiceList extends HTMLElement {
  set choiceList(choices) {
    this.choices = choices;
    this.render();
  }

  render() {
    this.textContent = "";
    this.style.display = "block";

    const alpha = ["A", "B", "C", "D"];

    if (this.choices) {
      this.choices.forEach((choice, i) => {
        const choiceItemEl = document.createElement("choice-item");
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
