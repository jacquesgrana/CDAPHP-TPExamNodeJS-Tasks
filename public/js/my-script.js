//const { enabled } = require("../../app");

let users = [];
let tasks = [];
let userId = "empty";
const endPoint = "https://localhost:4443";

if (document.location.href.toString().includes("home")) {
  console.log("dans home");
  getUsers();
  document.getElementById("create-task-btn").setAttribute("disabled", true);
}

function getUsers() {
  console.log("get users");
  fetch(endPoint + "/users", { method: "GET" })
    .then((res) => {
      console.log("1e then");
      return res.json();
    })
    .then((data) => {
      console.log("2e then");
      users = data;
      fillSelectUsers(users);
      addListenerSelectUsers();
    });
}

function fillSelectUsers(users) {
  console.log("users :", users);
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
    event.preventDefault();
    console.log("change value :", selectUsers.value);
    if (selectUsers.value != "empty") {
      console.log("requete tasks by user id");
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
  console.log("recup tasks by user id :", userId);
  fetch(endPoint + "/tasks/user/" + userId, { method: "GET" })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      tasks = data;
      console.log("task by util id :", tasks);
      // appel fonction qui affiche les tasks
      renderTasks(tasks);
    });
}

function renderTasks(tasks) {
  const divTasksNotDone = document.getElementById("div-tasks-not-done");
  let htmlContent = "";
  tasks
    .filter((t) => t.done === false)
    .forEach((t) => {
      htmlContent +=
        "<div>" +
        "<p>" +
        t.text +
        " / " +
        t.prio +
        "</p>" +
        "<button>Editer</button>" +
        "<button>Supprimer</button>" +
        "</div>";
    });
  divTasksNotDone.innerHTML = htmlContent;

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
        "<button>Editer</button>" +
        "<button>Supprimer</button>" +
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
    const newTask = fetch(endPoint + "/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyReq,
    })
      .then((response) => response.json())
      .then((task) => {
        console.log("task créé :", task);
        getTasksByUserId(userId);
    });
  }
