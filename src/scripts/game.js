import axios from "axios";
import state from "./state";
import { getStorageData, saveDataToStorage } from "./utils/storage";

const selectCategory = document.getElementById("category");

const game = () => {
  const renderCategories = () => {
    state.categories.forEach((category) => {
      selectCategory.insertAdjacentHTML(
        "beforeend",
        `<option value="${category.id}">${category.name}</option>`
      );
    });
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("api_category.php");
      const categories = response.data.trivia_categories;
      selectCategory.removeAttribute("disabled");

      state.categories = categories;
      saveDataToStorage("categories", categories);

      renderCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const init = () => {
    const savedCategories = getStorageData("categories");
    selectCategory.setAttribute("disabled", true);

    if (savedCategories) {
      state.categories = savedCategories;
      selectCategory.removeAttribute("disabled");
      renderCategories();
    } else {
      fetchCategories();
    }
  };

  init();
};

export default game;
