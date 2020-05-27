let id = 1;
let favourites;

String.prototype.firstToUpperCase = function firstToUpperCase() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

(() => {
    verifyToken();
    fillFavBox();
})();

function verifyToken(){
    const token = localStorage.getItem("pkmnItoken");
    if (token) {
        axios.post("/verify",
            {
                token: token
            }).then((res) => {
                document.querySelector("#user_name").innerHTML = res.data.user_name;
            }).catch(err => {
                window.location.replace("./loginOrRegister.html");
            });
    } else {
        window.location.replace("./loginOrRegister.html");
    }
}

function fillFavBox(){
    axios.get('/list-favourites', {
        headers: {
            "Authorization": "Bearer "+localStorage.getItem("pkmnItoken")
        }
    })
        .then(res => res.data)
        .then(data => {
            favourites = [...data];
            data.forEach(item => addToBox(item));
        })
        .catch(err => console.log(err));
}

function listTenPokemon() {
    if (id <= 802) {
        const button = document.querySelector("#listTenPokemon");
        const promises = [];
        const scrollableDiv = document.querySelector("#scrollPokelist");
        button.disabled = "true";
        for (let i = id; i < id + 10 && i <= 802; i++) {
            promises.push(axios.get(`https:/pokeapi.co/api/v2/pokemon/${i}`));
        }
        Promise.allSettled(promises).then(responses => {
            handleResponses(responses);
            button.removeAttribute("disabled");
            scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
        });
        id += 10;
    } else {
        document.querySelector("#listTenPokemon").style.display = "none";
    }
}

function handleResponses(responses) {
    responses.forEach((item) => {
        if (item.status === "fulfilled") {
            addToList(item.value.data);
        } else {
            console.log(item.reason);
        }
    });
};

function addToList(data) {
    const list = document.querySelector("#pokemonListContainer");
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML =
        `<span onClick="showInfo(this,'guardar')" data-id="${data.id}" 
               data-name="${data.name.firstToUpperCase()}" 
               data-types="${data.types.map(item => item.type.name.firstToUpperCase()).reverse().join(", ")}"
               data-abilities="${data.abilities.map(item => item.ability.name.firstToUpperCase()).reverse().join(", ")}"
               data-weight="${data.weight}"
               data-species="${data.species.name.firstToUpperCase()}"
               data-id="${data.id}">
            <img src=${data.sprites.front_default} alt=${data.species.name.firstToUpperCase()}>
        </span>`;
    list.append(div);
};

function addToFavourites(button) {
    if (favourites.filter(item => String(item.id) === button.dataset.id).length < 2) {
        axios.get(`https:/pokeapi.co/api/v2/pokemon/${button.dataset.id}`)
            .then(res => res.data)
            .then(data => {
                axios.post('/save-favourite',
                    {
                        id: data.id,
                        name: data.name.firstToUpperCase(),
                        types: data.types.map(item => item.type.name.firstToUpperCase()).reverse().join(", "),
                        abilities: data.abilities.map(item => item.ability.name.firstToUpperCase()).reverse().join(", "),
                        weight: data.weight,
                        species: data.species.name.firstToUpperCase(),
                        sprite: data.sprites.front_default
                    }, {
                    headers: {
                        "Authorization": "Bearer "+localStorage.getItem("pkmnItoken")
                    }
                }).then(res => {
                    data = handleData(data);
                    data.id_fav = res.data.insertId;
                    addToBox(data);
                    favourites.push({
                        id: data.id,
                        name: data.name,
                        types: data.types,
                        abilities: data.abilities,
                        weight: data.weight,
                        species: data.name,
                        sprite: data.img,
                        id_fav: data.id_fav
                    });
                });
            });
    } else {
        alert("No se puede tener mas de dos pokemon de la misma especie en la caja");
    }
}

function addToBox(data) {
    const box = document.querySelector("#pokebox");
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML =
        `<span onClick="showInfo(this,'eliminar')" data-id="${data.id}"
               data-name="${data.name}" 
               data-types="${data.types}"
               data-abilities="${data.abilities}"
               data-weight="${data.weight}"
               data-species="${data.species}"
               data-id="${data.id}"
               data-id_fav="${data.id_fav}">
            <img src=${"./images/box-sprites/" + ("00" + data.id).slice(-3) + "MS.png"} alt=${data.species}>
        </span>`;
    box.append(div);
};

function removeFromFavourites(button) {
    axios({
        method: "DELETE",
        url: '/delete-favourite',
        data: {
            id: button.dataset.id_fav
        },
        headers: {
            "Authorization": "Bearer "+localStorage.getItem("pkmnItoken")
        }
    }).then(res => {
        const pokeCard = document.querySelector(`span[data-id_fav="${button.dataset.id_fav}"]`).parentElement;
        favourites.splice(favourites.findIndex(item => { return item.id_fav == button.dataset.id_fav }), 1);
        pokeCard.parentElement.removeChild(pokeCard);
        showNonePokemon();
    }).catch(err=>{
        if(err.response.data.sqlState=='23000'){
            alert("No se puede eliminar a un pokemon que esta en el equipo");
        }else{
            console.log(err);
        }
    });
}

function searchPokemon(e) {
    e.preventDefault();
    const name = document.querySelector("#pokemonName").value;
    setAsLoading();
    axios.get(`https:/pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`).then(res => res.data).then(data => {
        showInfo(handleData(data),"guardar");
    }).catch(err => {
        console.log(err);
        handleError(err.response.status);
    });
}

function setAsLoading() {
    document.querySelector("#pokemonInfo").innerHTML = `
    <figure id="CImgPkmnInfo">
    <img id="imgPkmnInfo" src="./images/loading.gif" alt="Loading">
    <figcaption><b>Buscando<b/></figcaption>
    </figure>
    `;
}

function handleError(status) {
    switch (status) {
        case 404:
            printErr("Ese pokemon no existe en la base de datos");
            break;
        case 500:
            printErr("Hubo un problema en el servidor");
            break;
        default:
            printErr("Algo salio mal");
            break;
    }
}

function printErr(err) {
    showNonePokemon();
    alert(err);
}

function showNonePokemon() {
    document.querySelector("#pokemonInfo").innerHTML = `
        <figure id="CImgPkmnInfo">
            <img id="imgPkmnInfo" src="./images/interrogacion.png" alt="Signo de interrogacion">
        </figure>
        <div id="pkmnDescription">
            <p>Species: ???</p>
            <p>Weight: ???</p>
        </div>
        <div id="types">
            <span>???</span><span>???</span>
        </div>
        <div id="abilities">
            <div>???</div>
            <div>???</div>
        </div>
        `;
}

function logOut() {
    localStorage.removeItem("pkmnItoken");
    window.location.replace('./loginOrRegister.html');
};


function showInfo(data, action) {
    if(data.dataset){
        data = data.dataset;
    }
    const div = document.querySelector("#pokemonInfo");
    div.innerHTML = `
        <figure id="CImgPkmnInfo">
            <img id="imgPkmnInfo" src="${"https://www.cpokemon.com/pokes/anime/" + data.id + ".png"}" alt="${data.species}">
        </figure>
        <div id="pkmnDescription">
            <div>Species: ${data.species}</div>
            <div>Weight: ${data.weight}</div>
        </div>
        <div id="types">
        ${data.types.split(", ").map(type=>`<span class="pkmType ${type}">${type}</span> `).join("")}
        </div>
        <div id="abilities">
            <div><b>Abilities:</b></div>
            ${data.abilities.split(", ").map(ability=>`<div>${ability}</div>`).join("")}
        </div>
        <div id="manage">
            <button onclick="${action == "guardar" ? "addToFavourites(this)": "removeFromFavourites(this)"}"
            ${action=="guardar"? "data-id='"+data.id+"'": "data-id_fav='"+data.id_fav+"'"}>
            ${action=="guardar" ? "Agregar pokemon a la caja": "Quitar pokemon de la caja"}</button>
        </div>`;
};


function handleData(data){
    const newData = {};
    newData.name= data.name.firstToUpperCase();
    newData.types= data.types.map(item => item.type.name.firstToUpperCase()).reverse().join(", ");
    newData.abilities= data.abilities.map(item => item.ability.name.firstToUpperCase()).reverse().join(", ");
    newData.weight= data.weight;
    newData.species = data.species.name.firstToUpperCase();
    newData.id = data.id;
    newData.img = data.sprites.front_default;
    return newData;
}

