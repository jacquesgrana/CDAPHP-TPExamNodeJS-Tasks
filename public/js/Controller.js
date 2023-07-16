import Model from "./Model.js";
import View from "./View.js";

export default class Controller {
  #model;
  #view;
  constructor() {
    this.#model = new Model();
    this.#view = new View();
  }

  init() {
    console.log("controller : init");
    this.#model.init();
    this.#view.init();
  }

  run() {
    console.log("controller : run");
  }
}
