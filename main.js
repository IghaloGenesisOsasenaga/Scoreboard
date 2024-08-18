/*
  Note from Osalotioman: Sorry, my edits are not so clean,
  there's a second branch in whcih I'm working on making
  up for shortcomings in this version.
*/

var sip = "http://192.168.43.1:4000/backend/scoreboard.php";
var d = [];
const season = document.querySelector("#season_id");
const addDataForm = document.querySelector("#addDataForm");
const addInputs = document.querySelector("#addInputs");
const board = document.querySelector("#board");
const createSeasonButton = document.querySelector("#create_season")
const today = "2024-07-15";

const boardInit = `
    <th>S/N</th>
    <th>Names</th>
    <th>Rating Sum</th>
`;

const addData = document.querySelector("#add");
const seasonTemplate = () => {
    return {
        date_start: "2024-07-16",
        date_end: "2024-07-15",
        values: [
            { name: "Osazuwa Emmanuel", rating: 0 },
            { name: "Ofurhie Ochuko", rating: 0 },
            { name: "Ighalo Genesis", rating: 20 }
        ]
    };
};

const rowTemplate = (serialNo, name, rating) => {
    return `
    <tr>
        <td>${serialNo}</td>
        <td>${name}</td>
        <td>${rating}</td>
    </tr>`;
};
const optionTemplate = (val) => {
    return `<option value=${val}>Season ${val+1}</option>`;
};

var database = d;
$.post(sip, {e2: "retrieve"},function (data){
    database = JSON.parse(data);
});
function server(info, type){
  $.post(sip, {e1:database, e2: "store"},function (data){});
}

function getCurrentSeason() {
    if (today <= database[database.length-1].date_end) {
        return database.length-1; // Return the index of the current season
    }
    return -1; // No current season
}

function loadSeason(seasonID) {
    board.innerHTML = boardInit;
    let data = [...database[parseInt(seasonID)].values];
    data.sort((a, b) => b.rating - a.rating);

    for (let i = 0; i < data.length; ++i) {
        board.innerHTML += rowTemplate(i + 1, data[i].name, data[i].rating);
    }
}

function add(id, rating) {
    const seasonIndex = parseInt(season.value);
    if (seasonIndex !== getCurrentSeason()) {
        alert("You can only add data for the current season\nSelect latest season");
        return;
    }
    if (id >= 0 && id < database[seasonIndex].values.length) {
        database[seasonIndex].values[id].rating = parseInt(database[seasonIndex].values[id].rating) + rating;
        server(database, "store");
    } else {
        alert("Invalid ID");
    }
}

function createSeason() {
    if (getCurrentSeason() === -1) {
        season.innerHTML += optionTemplate(database.length)
        season.value = `${database.length}`;
        database.push(seasonTemplate());
        loadSeason(`${database.length-1}`);
        server(database, "store");
    } else {
        alert("There's an ongoing season");
    }
}

function addDataEventHandler(e) {
    e.preventDefault();
    const index = parseInt(document.getElementById("index").value);
    const rating = parseInt(document.getElementById("p_rating").value);
    const password = document.getElementById("password").value; // Assuming there's an input field with id="password"

    if (!isNaN(index) && !isNaN(rating)) {
      add(index, rating);
      document.getElementById("index").value = '';
      document.getElementById("p_rating").value = '';
      document.getElementById("password").value = '';
      addInputs.style.display = "none";
      loadSeason(season.value);
    } else {
        alert("Please enter valid data.");
    }
}


function main() {
    for (i=database.length-1; i >= 0; --i) {
        season.innerHTML += optionTemplate(i);
    }
    
    loadSeason(database.length-1);
    season.addEventListener('change', (e) => loadSeason(e.target.value))
    addData.addEventListener('click', () => {
        addInputs.style.display = "block";
        loadSeason(season.value);
    });
    addDataForm.addEventListener('submit', addDataEventHandler);
    createSeasonButton.addEventListener('click', createSeason);
}

window.onload = setTimeout(main, 1500);