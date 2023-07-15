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
  document.getElementById("select-prio-filter").setAttribute("disabled", true);
  document.getElementById("input-text-add").value = "";
  document.getElementById("select-prio-add").selectedIndex = 1;
  addListenerChangeInputTextAdd();
}

function addListenerChangeInputTextAdd() {
  const inputText = document.getElementById("input-text-add");
  inputText.addEventListener("input", () => {
    if ((inputText.value === "") || (userId === "empty")){
      document.getElementById("create-task-btn").setAttribute("disabled", true);
    }
    else {
      document.getElementById("create-task-btn").disabled = false;
    }
  })
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
      addListenerSelectFilters();
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

function addListenerSelectFilters() {
  const selectFilters = document.getElementById("select-prio-filter");
  let filteredTasks = tasks.slice();
  selectFilters.addEventListener("change", () => {
    const selectedFilter = selectFilters.value;
    if(selectedFilter === "TOUTES") {
      filteredTasks = tasks.slice();
    }
    else {
      filteredTasks = tasks.filter(t => t.prio == selectedFilter);
    }
    renderTasks(filteredTasks);
  });
}

function addListenerSelectUsers() {
  const selectUsers = document.getElementById("select-users");
  selectUsers.addEventListener("change", (event) => {
    //event.preventDefault();
    if (selectUsers.value != "empty") {
      getTasksByUserId(selectUsers.value);
      userId = selectUsers.value;
      if (document.getElementById("input-text-add").value !== "") document.getElementById("create-task-btn").disabled = false;
      document.getElementById("select-prio-filter").disabled = false;

    } else {
      document.getElementById("div-tasks-not-done").innerHTML = "";
      document.getElementById("div-tasks-done").innerHTML = "";
      userId = "empty";
      document.getElementById("create-task-btn").setAttribute("disabled", true);
      document.getElementById("select-prio-filter").setAttribute("disabled", true);

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
        "<div class='div-task'>" +
        "<p>" +
        t.text +
        "&nbsp" +
        "<span class='span-text-prio'>" +
        t.prio +
        "</span>" +
        "</p>" +
        "<p class='hidden'>" + t.id + "</p>" + 
        "<button class='btns-edit btn btn-primary' onclick='editTask(event, false)'>Editer</button>" +
        "<button class='btns-delete btn btn-danger ms-2' onclick='deleteTask(event)'>Supprimer</button>" +
        "</div>"
    });
  divTasksNotDone.innerHTML = htmlContentNotDone;


  const divTasksDone = document.getElementById("div-tasks-done");
  let htmlContentDone = "";
  tasks
    .filter((t) => t.done === true)
    .forEach((t) => {
      htmlContentDone +=
        "<div class='div-task'>" +
        "<p>" +
        t.text +
        "&nbsp" +
        "<span class='span-text-prio'>" +
        t.prio +
        "</span>" +
        "</p>" +
        "<p class='hidden'>" + t.id + "</p>" + 
        "<button class='btns-edit btn btn-primary' onclick='editTask(event, true)'>Editer</button>" +
        "<button class='btns-delete btn btn-danger ms-2' onclick='deleteTask(event)'>Supprimer</button>" +
        "</div>"
    });
  divTasksDone.innerHTML = htmlContentDone;
  addListenersToDivsTask();
  setSpansPrioColor();
}

function setSpansPrioColor() {
  const spans = document.getElementsByClassName("span-text-prio");
  Array.from(spans).forEach(s => {
    switch(s.textContent) {
      case "NONURGENTE" :
        s.classList.add("nonurgent-color");
        break;
        case "NORMALE" :
          s.classList.add("normal-color");
        break;
        case "URGENTE" :
          s.classList.add("urgent-color");
        break;
        case "PRIORITAIRE" :
          s.classList.add("prioritary-color");
        break;
    }
  });
}

function addListenersToDivsTask() {
  const divs = document.getElementsByClassName("div-task");
  Array.from(divs).forEach(d => {
    d.addEventListener("click", (event) => {
      if(event.target.nodeName !== 'BUTTON') {
        const id = d.childNodes[1].textContent;
        toggleDoneTask(id);
      }
    })
  });
}

function toggleDoneTask(id) {
  const newDone = fetch(`${endPoint}/tasks/toggle/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  })
  .then((response) => response.json())
  .then((done) => {
    // sinon erreur : uncaught (in promise) typeerror: networkerror when attempting to fetch resource.
    setTimeout(() => {  getTasksByUserId(userId);; }, 400);
});
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
    const newTask = fetch(endPoint + "/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyReq,
    })
      .then((response) => response.json())
      .then((task) => {
        // sinon erreur : uncaught (in promise) typeerror: networkerror when attempting to fetch resource.
        setTimeout(() => {  getTasksByUserId(userId);; }, 400);
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
      setTimeout(() => {  getTasksByUserId(userId);; }, 400);
    });
  }

  function editTask(event) {
    event.preventDefault();
    const parent = event.target.parentNode;
    document.getElementById("div-edit-task").classList.add("paddings");
    document.getElementById("div-edit-task").classList.add("mt-5");
    const id = parent.childNodes[1].textContent;
    const taskToEdit = tasks.find(t => t.id === id);
    renderDivEdit(taskToEdit);
    taskEdited = taskToEdit;
  }

  function renderDivEdit(task) {
    const divEdit = document.getElementById("div-edit-task");
    const html = `
    <h2 class="text-center mt-2 mb-4">Editer une tâche</h2>
    <form id="form-edit-task">
      <label class="form-label" for="input-text-edit">Texte :</label>
      <input class="form-control d-inline w-25" type="text" id="input-text-edit" name="input-text-edit"/>
      <label class="form-label font-bold" for="select-prio-edit">Priorité</label>
      <select class="form-select form-select-sm w-25 d-inline" name="select-prio-edit" id="select-prio-edit">
        <option value="NONURGENTE" ` + (task.prio === "NONURGENTE" ? "selected" : "") + `>Non urgente</option>
        <option value="NORMALE" ` + (task.prio === "NORMALE" ? "selected" : "") + `>Normale</option>
        <option value="URGENTE" ` + (task.prio === "URGENTE" ? "selected" : "") + `>Urgente</option>
        <option value="PRIORITAIRE" ` + (task.prio === "PRIORITAIRE" ? "selected" : "") + `>Prioritaire</option>
      </select>
      <button class="btn btn-success ms-5" type="button" onclick="updateTask(${task.done})" id="edit-task-btn">Modifier Tâche</button>
      <button class="btn btn-danger ms-2" type="button" onclick="closeEditDiv()" id="edit-task-btn">Annuler</button>
    </form>
    `;
    divEdit.innerHTML = html;
    document.getElementById("input-text-edit").value = task.text;
  }

  function closeEditDiv() {
    const divEdit = document.getElementById("div-edit-task");
    divEdit.innerHTML = "";
    divEdit.classList.remove("paddings");
    divEdit.classList.remove("mt-5");
  }

  function updateTask(done) {
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
        closeEditDiv();
        // sinon erreur : uncaught (in promise) typeerror: networkerror when attempting to fetch resource.
        setTimeout(() => {  getTasksByUserId(userId);; }, 400);
    });
  }