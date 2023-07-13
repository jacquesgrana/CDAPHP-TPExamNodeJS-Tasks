//const { enabled } = require("../../app");

let users = [];
let tasks = [];
let isFirstCall = true;
let userId = "empty";
let taskEdited = {};
const endPoint = "https://localhost:4443";

if (document.location.href.toString().includes("home")) {
  getUsers();
  document.getElementById("create-task-btn").setAttribute("disabled", true);
}

function getUsers() {
  fetch(endPoint + "/users", { method: "GET" })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      users = data;
      fillSelectUsers(users);
      addListenerSelectUsers();
    });
}

function fillSelectUsers(users) {
  const selectUsers = document.getElementById("select-users");
  let htmlContent =
    "<option value='empty' selected>Choisir un utilisateur</option>";
  users.forEach((u) => {
    htmlContent += "<option value='" + u.id + "'>" + u.name + "</option>";
  });
  selectUsers.innerHTML = htmlContent;
}

function addListenerSelectUsers() {
  const selectUsers = document.getElementById("select-users");
  selectUsers.addEventListener("change", (event) => {
    //event.preventDefault();
    if (selectUsers.value != "empty") {
      getTasksByUserId(selectUsers.value);
      userId = selectUsers.value;
      document.getElementById("create-task-btn").disabled = false;
    } else {
      document.getElementById("div-tasks-not-done").innerHTML = "";
      document.getElementById("div-tasks-done").innerHTML = "";
      userId = "empty";
      document.getElementById("create-task-btn").setAttribute("disabled", true);
    }
    // faire requete pour recuperer les tasks de cet user
  });
}

function getTasksByUserId(userId) {
  fetch(endPoint + "/tasks/user/" + userId, { method: "GET" })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      tasks = data;
      console.log("task by util id :", tasks);
      renderTasks(tasks);
    });
}

function renderTasks(tasks) {
  const divTasksNotDone = document.getElementById("div-tasks-not-done");
  let htmlContentNotDone = "";
  tasks
    .filter((t) => t.done === false)
    .forEach((t) => {
      htmlContentNotDone +=
        "<div>" +
        "<p>" +
        t.text +
        " / " +
        t.prio +
        "</p>" +
        "<p class='hidden'>" + t.id + "</p>" + 
        "<button class='btns-edit' onclick='editTask(event, false)'>Editer</button>" +
        "<button class='btns-delete' onclick='deleteTask(event)'>Supprimer</button>" +
        "</div>";
    });
  divTasksNotDone.innerHTML = htmlContentNotDone;

  const divTasksDone = document.getElementById("div-tasks-done");
  let htmlContentDone = "";
  tasks
    .filter((t) => t.done === true)
    .forEach((t) => {
      htmlContentDone +=
        "<div>" +
        "<p>" +
        t.text +
        " / " +
        t.prio +
        "</p>" +
        "<p class='hidden'>" + t.id + "</p>" + 
        "<button class='btns-edit' onclick='editTask(event, true)'>Editer</button>" +
        "<button class='btns-delete' onclick='deleteTask(event)'>Supprimer</button>" +
        "</div>";
    });
  divTasksDone.innerHTML = htmlContentDone;
}

function createTask(event) {
    event.preventDefault();
    const textTask = document.getElementById("input-text-add").value;
    const prioTask = document.getElementById("select-prio-add").value;
    const dataJson = {
      text: textTask,
      prio: prioTask,
      done: false,
      idUtil: userId
    };
  
    const bodyReq = JSON.stringify(dataJson);
    console.log('body :', bodyReq);
    const newTask = fetch(endPoint + "/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyReq,
    })
      .then((response) => response.json())
      .then((task) => {
        console.log("task créé :", task);
        // sinon erreur : uncaught (in promise) typeerror: networkerror when attempting to fetch resource.
        setTimeout(() => {  getTasksByUserId(userId);; }, 200);
    });
  }

  function deleteTask(event) {
    event.preventDefault();
    const parent = event.target.parentNode;
    const id = parent.childNodes[1].textContent;
    const idDel = fetch(`${endPoint}/tasks/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      if (response.ok) {
      return response.json();
      }
    })
    .then((data) => {
      setTimeout(() => {  getTasksByUserId(userId);; }, 200);
    });
  }

  function editTask(event) {
    event.preventDefault();
    const parent = event.target.parentNode;
    const id = parent.childNodes[1].textContent;
    const taskToEdit = tasks.find(t => t.id === id);
    console.log("taskToEdit :", taskToEdit);
    renderDivEdit(taskToEdit);
    taskEdited = taskToEdit;
  }

  function renderDivEdit(task) {
    const divEdit = document.getElementById("div-edit-task");
    const html = `
    <h2>Editer une tâche</h2>
    <form id="form-edit-task">
      <label for="input-text-edit">Texte :</label>
      <input type="text" id="input-text-edit" name="input-text-edit"/>
      <label for="select-prio-edit">Priorité :</label>
      <select name="select-prio-edit" id="select-prio-edit">
        <option value="NONURGENTE" ` + (task.prio === "NONURGENTE" ? "selected" : "") + `>Non urgente</option>
        <option value="NORMALE" ` + (task.prio === "NORMALE" ? "selected" : "") + `>Normale</option>
        <option value="URGENTE" ` + (task.prio === "URGENTE" ? "selected" : "") + `>Urgente</option>
        <option value="PRIORITAIRE" ` + (task.prio === "PRIORITAIRE" ? "selected" : "") + `>Prioritaire</option>
      </select>
      <button type="button" onclick="updateTask(event)" id="edit-task-btn">Modifier Tâche</button>
    </form>
    `;
    divEdit.innerHTML = html;
    document.getElementById("input-text-edit").value = task.text;
  }

  function updateTask(event, done) {
    console.log("update task");
    const text = document.getElementById("input-text-edit").value;
    const prio = document.getElementById("select-prio-edit").value;
    const dataJson = {
      "id": taskEdited.id,
      "text": text,
      "prio": prio,
      "done": taskEdited.done,
      "idUtil": taskEdited.idUtil
    }
    const bodyReq = JSON.stringify(dataJson);
    const updatedTask = fetch(`${endPoint}/tasks/${taskEdited.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: bodyReq,
    })
      .then((response) => response.json())
      .then((task) => {
        console.log("task modifiée :", task);
        document.getElementById("div-edit-task").innerHTML = "";
        // sinon erreur : uncaught (in promise) typeerror: networkerror when attempting to fetch resource.
        setTimeout(() => {  getTasksByUserId(userId);; }, 200);
    });
  }