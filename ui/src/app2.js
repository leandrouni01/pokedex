let id = 1;
const favourites = [];
let savedFavs = true;
String.prototype.firstToUpperCase = function firstToUpperCase() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
/*
window.addEventListener('beforeunload', (event) => {
    if(!savedFavs) {
        // Cancel the event as stated by the standard.
        //event.preventDefault();
        // Chrome requires returnValue to be set.
        event.returnValue = "No ha guardao sus cambios en la caja ¿esta seguro que desea salir?";
    }else{
        event.returnValue =null;
    }
});*/

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
            //scrollableDiv.scrollIntoView(false);
        });
        /*
        axios.get(`https:/pokeapi.co/api/v2/pokemon/${id}`).then(res => {
            const list = document.querySelector("#pokemonListContainer");
            const div = document.createElement("div");
            div.classList.add("card");
            div.innerHTML =
                `<span onClick="showPokemonFromList(this)" data-id="${res.data.id}" 
                   data-name="${res.data.name}" 
                   data-types="${res.data.types.map(item => item.type.name).reverse().join(", ")}"
                   data-abilities="${res.data.abilities.map(item => item.ability.name).reverse().join(", ")}"
                   data-weight="${res.data.weight}"
                   data-species="${res.data.species.name}" >
                <img src=${res.data.sprites.front_default} alt=${res.data.species}>
            </span>`;
            list.append(div);
        }).catch(err => console.log(err));*/
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
}

function addToList(data) {
    const list = document.querySelector("#pokemonListContainer");
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML =
        `<span onClick="showPokemonFromList(this)" data-id="${data.id}" 
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

function showPokemonFromList(span) {
    const div = document.querySelector("#pokemonInfo");
    const dataset = span.dataset;
    /*
    div.innerHTML = `
    <img id="imgPkmnInfo" src="${span.lastElementChild.src}" alt="${dataset.species}">
    <dl>
        <dt>Name</dt>
        <dd>${dataset.name}</dd>
        <dt>Types</dt>
        <dd>${dataset.types}</dd>
        <dt>Abilities</dt>
        <dd>${dataset.abilities}</dd>
        <dt>Weight</dt>
        <dd>${dataset.weight}</dd>
        <dt>Species</dt>
        <dd>${dataset.species}</dd>
    </dl>
    `;*/
    div.innerHTML = `
    <img id="imgPkmnInfo" 
    src="${"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + dataset.id + ".png"}"
    alt="${dataset.species}">
    <ul>
        <li><b>Name:</b> ${dataset.name}</li>
        <li><b>Types:</b> ${dataset.types}</li>
        <li><b>Abilities:</b> ${dataset.abilities}</li>
        <li><b>Weight:</b> ${dataset.weight}</li>
        <li><b>Species:</b> ${dataset.species}</li>
    </ul>
    <button onclick="addToFavourites(this)"
            data-id="${dataset.id}">
            Agregar a caja de Favoritos
    </button>
    `;
}

function addToFavourites(button) {
    if (favourites.filter(item => String(item.id) === button.dataset.id).length < 2) {
        axios.get(`https:/pokeapi.co/api/v2/pokemon/${button.dataset.id}`)
            .then(res => res.data)
            .then(data => {
                favourites.push({ id: data.id, name: data.species.name });
                addToBox(data);
                savedFavs = false;
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
        `<span onClick="showPokemonFromList(this)" data-id="${data.id}" 
               data-name="${data.name.firstToUpperCase()}" 
               data-types="${data.types.map(item => item.type.name.firstToUpperCase()).reverse().join(", ")}"
               data-abilities="${data.abilities.map(item => item.ability.name.firstToUpperCase()).reverse().join(", ")}"
               data-weight="${data.weight}"
               data-species="${data.species.name.firstToUpperCase()}"
               data-id="${data.id}">
            <img src=${"./images/box-sprites/" + ("00" + data.id).slice(-3) + "MS.png"} alt=${data.species.name.firstToUpperCase()}>
        </span>`;
    box.append(div);
};

function searchPokemon(e) {
    e.preventDefault();
    const name = document.querySelector("#pokemonName").value;
    setAsLoading();
    axios.get(`https:/pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`).then(res => res.data).then(data => {
        console.log(data);
        showPokemonFromSearch(data);
    }).catch(err => {
        console.log(err);
        handleError(err.response.status);
    });
}

function setAsLoading() {
    document.querySelector("#pokemonInfo").innerHTML = `
    <img id="imgPkmnInfo" src="./images/loading.gif" alt="Loading">
    <h4>Buscando</h4>
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
    document.querySelector("#pokemonInfo").innerHTML = `
    <img id="imgPkmnInfo" src="./images/interrogacion.png" alt="Signo de interrogacion">
    <ul>
        <li><b>Name:</b> ???</li>
        <li><b>Types:</b> ???</li>
        <li><b>Abilities:</b> ???</li>
        <li><b>Weight:</b> ???</li>
        <li><b>Species:</b> ???</li>
    </ul>`;
    alert(err);
}

function saveFavs() {
    savedFavs = true;
}

function showPokemonFromSearch(data) {
    const div = document.querySelector("#pokemonInfo");
    div.innerHTML = `
    <img id="imgPkmnInfo" src="${data.sprites.front_default}" alt="${data.species.name.firstToUpperCase()}">
    <ul>
        <li><b>Name:</b> ${data.name.firstToUpperCase()}</li>
        <li><b>Types:</b> ${data.types.map(item => item.type.name.firstToUpperCase()).reverse().join(", ")}</li>
        <li><b>Abilities:</b> ${data.abilities.map(item => item.ability.name.firstToUpperCase()).reverse().join(", ")}</li>
        <li><b>Weight:</b> ${data.weight}</li>
        <li><b>Species:</b> ${data.species.name.firstToUpperCase()}</li>
    </ul>
    <button onclick="addToFavourites(this)"
            data-id="${data.id}">
            Agregar a caja de Favoritos
    </button>
    `;
}

function listFavs(){
    axios.get('http://localhost:3000/list-favourites')
    .then(res=>res.data)
    .then(item=>console.log(item))
    .catch(err=>{console.log(err)});
}