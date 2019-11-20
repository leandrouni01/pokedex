let id = 1;
let favourites = [];
String.prototype.firstToUpperCase = function firstToUpperCase() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

window.addEventListener('load', event => {
    axios.get('http://localhost:3000/list-favourites')
        .then(res => res.data)
        .then(data => {
            favourites = [...data];
            data.forEach(item => addToBoxInLoad(item));
        }).catch(err => console.log(err));
});


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

function showPokemonFromBox(span) {
    const div = document.querySelector("#pokemonInfo");
    const dataset = span.dataset;
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
    <button onclick="removeFromFavourites(this)"
            data-id_fav="${dataset.id_fav}">
            Quitar de la caja de Favoritos
    </button>
    `;
}



function addToFavourites(button) {
    if (favourites.filter(item => String(item.pokemon_id) === button.dataset.id).length < 2) {
        axios.get(`https:/pokeapi.co/api/v2/pokemon/${button.dataset.id}`)
            .then(res => res.data)
            .then(data => {
                axios.post('http://localhost:3000/save-favourite',
                    {
                        id: data.id,
                        name: data.name.firstToUpperCase(),
                        types: data.types.map(item => item.type.name.firstToUpperCase()).reverse().join(", "),
                        abilities: data.abilities.map(item => item.ability.name.firstToUpperCase()).reverse().join(", "),
                        weight: data.weight,
                        species: data.species.name.firstToUpperCase(),
                        sprite: data.sprites.front_default
                    }).then(res=>{
                        data.id_fav= res.data.insertId;
                        addToBox(data);
                        favourites.push({
                            pokemon_id: data.id,
                            name: data.name.firstToUpperCase(),
                            types: data.types.map(item => item.type.name.firstToUpperCase()).reverse().join(", "),
                            abilities: data.abilities.map(item => item.ability.name.firstToUpperCase()).reverse().join(", "),
                            weight: data.weight,
                            species: data.species.name.firstToUpperCase(),
                            sprite: data.sprites.front_default,
                            id_fav: res.data.insertId
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
        `<span onClick="showPokemonFromBox(this)" data-id="${data.id}" 
               data-name="${data.name.firstToUpperCase()}" 
               data-types="${data.types.map(item => item.type.name.firstToUpperCase()).reverse().join(", ")}"
               data-abilities="${data.abilities.map(item => item.ability.name.firstToUpperCase()).reverse().join(", ")}"
               data-weight="${data.weight}"
               data-species="${data.species.name.firstToUpperCase()}"
               data-id="${data.id}"
               data-id_fav="${data.id_fav}">
            <img src=${"./images/box-sprites/" + ("00" + data.id).slice(-3) + "MS.png"} alt=${data.species.name.firstToUpperCase()}>
        </span>`;
    box.append(div);
};

function removeFromFavourites(button){
    axios({
        method: "DELETE",
        url: 'http://localhost:3000/delete-favourite',
        data: {
            id: button.dataset.id_fav
        }
    }).then(res=>{
        const pokeCard = document.querySelector(`span[data-id_fav="${button.dataset.id_fav}"]`).parentElement;
        pokeCard.parentElement.removeChild(pokeCard);
        showNonePokemon();
    });
}

function addToBoxInLoad(data){
    const box = document.querySelector("#pokebox");
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML =
        `<span onClick="showPokemonFromBox(this)" data-id="${data.pokemon_id}" 
               data-name="${data.pokemon_name}" 
               data-types="${data.pokemon_types}"
               data-abilities="${data.pokemon_abilities}"
               data-weight="${data.pokemon_weight}"
               data-species="${data.pokemon_species}"
               data-id="${data.pokemon_id}"
               data-id_fav="${data.id_fav}">
            <img src=${"./images/box-sprites/" + ("00" + data.pokemon_id).slice(-3) + "MS.png"} alt=${data.pokemon_species}>
        </span>`;
    box.append(div);
}

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
    showNonePokemon();
    alert(err);
}

function showNonePokemon(){
    document.querySelector("#pokemonInfo").innerHTML = `
    <img id="imgPkmnInfo" src="./images/interrogacion.png" alt="Signo de interrogacion">
    <ul>
        <li><b>Name:</b> ???</li>
        <li><b>Types:</b> ???</li>
        <li><b>Abilities:</b> ???</li>
        <li><b>Weight:</b> ???</li>
        <li><b>Species:</b> ???</li>
    </ul>`;
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

