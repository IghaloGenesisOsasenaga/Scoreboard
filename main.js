const season = document.querySelector("#season_id");
const addDataForm = document.querySelector("#addDataForm");
const addInputs = document.querySelector("#addInputs");
const board = document.querySelector("#board");
const createSeasonButton = document.querySelector("#create_season")
const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
const boardInit = `
    <th>S/N</th>
    <th>Names</th>
    <th>Rating Sum</th>
`;
const passwordHashes = [
    "bf9b5951c550f519c08a4515282f5dc69e0a9e55152d5d316570436b9fa101dc",
    "f3afeceb39f6ca1c863d69ef2bfbb9296ff382694ee97687946667049eb29f34",
    "aeebad4a796fcc2e15dc4c6061b45ed9b373f26adfc798ca7d2d8cc58182718e"
];
const addData = document.querySelector("#add");
const seasonTemplate = () => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    const date_end = endDate.toISOString().split('T')[0];

    return {
        date_start: today,
        date_end: date_end,
        values: [
            { name: "Osazuwa Emmanuel", rating: 0 },
            { name: "Ofurhie Ochuko", rating: 0 },
            { name: "Ighalo Genesis", rating: 0 }
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
const database = [
    seasonTemplate(),
];

function hashPassword(password) {
    const enc = new TextEncoder();
    const data = enc.encode(password);

    return crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }).catch(error => {
        console.error('Error hashing password:', error);
        throw error; // Re-throw the error to be handled by the caller if needed
    });
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
        database[seasonIndex].values[id].rating += rating;
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
        hashPassword(password).then(hash => {
            if (hash !== passwordHashes[index]) {
                alert("Incorrect password");
            } else {
                add(index, rating);
                document.getElementById("index").value = '';
                document.getElementById("p_rating").value = '';
                document.getElementById("password").value = '';
                addInputs.style.display = "none";
                loadSeason(season.value);
            }
        }).catch(error => {
            alert("Some error occurred while hashing your password\n and it was totally your fault 😒");
        });
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

window.onload = main