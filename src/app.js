import "regenerator-runtime";
import "./assets/scss/main.scss";
import axios from "axios";

import game from "./scripts/game";
import "./scripts/partials/preplay";
import "./scripts/partials/play";

axios.defaults.baseURL = "https://opentdb.com/";

document.addEventListener("DOMContentLoaded", game);
