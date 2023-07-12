let users = [];
let tasks = [];
const endPoint = "https://localhost:4443";

if( document.location.href.toString().includes("home")) {
    console.log("dans home");
    getUsers();
}

function getUsers() {
    console.log('get users');
    fetch(endPoint+"/users", 
    {method: "GET"})
.then((res) => {
    console.log('1e then')
    return res.json();
})
.then(data => {
    console.log('2e then')
    users = data;
    fillSelectUsers(users);
    addListenerSelectUsers();
});
}

function fillSelectUsers(users) {
    console.log("users :", users);
    const selectUsers = document.getElementById("select-users");
    let htmlContent = "<option value='empty' selected>Choisir un utilisateur</option>";
    users.forEach(u => {
        htmlContent += "<option value='"+ u.id +"'>"+ u.name +"</option>";
    });
    selectUsers.innerHTML = htmlContent;
}

function addListenerSelectUsers() {
    const selectUsers = document.getElementById("select-users");
    selectUsers.addEventListener("change", () => {
        console.log("change value :", selectUsers.value);
        if(selectUsers.value !== "empty") {
            console.log("requete tasks by user id");
            getTasksByUserId(selectUsers.value);
        }
        // faire requete pour recuperer les tasks de cet user
        
    });
}

function getTasksByUserId(userId) {
    console.log("recup tasks by user id :", userId);
    fetch(endPoint+"/users/" + userId, 
    {method: "GET"})
.then((res) => {
    return res.json();
})
.then(data => {
    tasks = data;
    console.log("task by util id :", tasks);
    // appel fonction qui affiche les tasks
    renderTasks(tasks);
});
}

function renderTasks(tasks) {
    const divTasksNotDone = document.getElementById("div-tasks-not-done");
    let htmlContent = "";
    tasks.filter(t => t.done === false).forEach(t => {
        htmlContent += "<div>"+ "<p>"+ t.text + " / " + t.prio + "</p>" + "<button>Editer</button>" + "<button>Supprimer</button>" + "</div>"
    });
    divTasksNotDone.innerHTML = htmlContent;

    const divTasksDone = document.getElementById("div-tasks-done");
    let htmlContentDone = "";
    tasks.filter(t => t.done === true).forEach(t => {
        htmlContentDone += "<div>"+ "<p>"+ t.text + " / " + t.prio + "</p>" + "<button>Editer</button>" + "<button>Supprimer</button>"+ "</div>"
    });
    divTasksDone.innerHTML = htmlContentDone;
}
