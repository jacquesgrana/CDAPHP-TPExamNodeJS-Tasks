export default class Model {
    #users = [];
    #tasks = [];
    #userId = "empty";
    #editedTask = {};
    #endPoint = "https://localhost:4443";

    constructor() {

    }

    init() {
        console.log("model : init");
    }

    /**
     * Getters et Setters
     */
    get users() {
       return this.#users;
    }
    set users(newUsers) {
        this.#users = newUsers;
    }
    get tasks() {
        return this.#tasks;
     }
     set tasks(newTasks) {
         this.#tasks = newTasks;
     }
     get userId() {
        return this.#userId;
     }
     set userId(newUserId) {
         this.#userId = newUserId;
     }
     get editedTask() {
        return this.#editedTask;
     }
     set editedTask(newEditedTask) {
         this.#editedTask = newEditedTask;
     }
     get endPoint() {
        return this.#endPoint;
     }
}