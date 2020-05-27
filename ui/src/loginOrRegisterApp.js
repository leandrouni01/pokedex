(() => {
    document.getElementById("login").style.display = "block";
    listUsers();
})()

function login(e) {
    e.preventDefault();
    const user = document.querySelector("#user").value;
    const password = document.querySelector("#password").value;

    fetch('/login',
        {
            method: 'POST',
            body: JSON.stringify({ user: user, password: password }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status == 200) {
                return res.json();
            } else {
                return { errStatus: res.status };
            }
        }).then(res => {
            if (res.errStatus) {
                handleError(res.errStatus);
            } else {
                localStorage.setItem("pkmnItoken", res.token);
                window.location.replace('./addpokemon.html');
            }
        }).catch(err => {
            console.log(err);
        })
}

function register(e) {
    e.preventDefault();
    const user = document.querySelector("#user2").value;
    const password = document.querySelector("#password2").value;
    const repeatPassword = document.querySelector("#repeatPassword2").value;
    if (password == repeatPassword) {
        fetch('/register', {
            method: 'POST',
            body: JSON.stringify({ user: user, password: password }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status == 200) {
                return res.json();
            } else {
                return { errStatus: res.status };
            }
        }).then(res => {
            if (res.errStatus) {
                handleError(res.errStatus);
            } else {
                localStorage.setItem("pkmnItoken", res.token);
                window.location.replace('./addpokemon.html');
            }
        }).catch(err => {
            console.log(err);
        })
    } else {
        alert("Las contraseñas no coinciden");
    }
};


function changeTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    const tablinks = document.getElementsByClassName("tablinks");

    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.toggle("active");
}

function handleError(errStatus) {
    switch (errStatus) {
        case 404:
            alert("El usuario o la contraseña son incorrectos");
            break;
        case 409:
            alert("Ese nombre de usuario ya esta en uso");
            break;
        case 500:
            alert("Hubo un error en el servidor");
            break;
        default:
            alert("Algo salio mal");
            break;
    }
}


function listUsers() {
    fetch('/list-users',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status == "200") return res.json();
        })
        .then(data => {
            fillTable(data);
        })
        .catch(err => {
            console.log(err);
        })
}

function fillTable(data) {
    const tbody = document.querySelector("#tbody");
    data.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${user.user_name}</td>
            <td>${user.poke_number}</td>
        `;
        tbody.append(tr);
    });
}

