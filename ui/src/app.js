
/*
function chooseBulbasaur() {
    document.getElementById('bulbasaur').innerHTML = `<h3>Loading</h3>`;
    axios.get('http://pokeapi.salestock.net/api/v2/pokemon/1')
        .then((response) => {
            document.getElementById('bulbasaur').innerHTML = `
        <img src=${response.data.sprites.front_shiny} alt='bulbasaur'>
        `;
        });
}*/

const favourites =
[
    { "id": 1, "name": "bulbasaur" },
    {"id": 12,"name": "butterfree"},
    {"id": 54,"name": "psyduck"},
    {"id": 258, "name": "mudkip"},
    {"id": 16, "name": "pidgey"},
    {"id": 93, "name": "haunter"},
    {"id": 65, "name": "alakazam"},
    {"id": 98, "name": "krabby"},
    {"id": 131, "name": "lapras"},
    {"id": 389, "name": "torterra"},
    {"id": 405, "name": "luxray"}
];

const formData = event => {
    event.preventDefault();
    clearList();
    setAsLoading();
    const name = document.getElementById('pokemonName').value;
    const isFavourite = favourites.some(item => item.name === name);
    if (isFavourite) {
        getPokemonData(name).then(data => {
            printPokemon(data);
        }).catch(err => {
            handleError(err.response.status);
        });
    } else {
        getPokemonData(name).then(data => {
            savePokemon(data.name, data.id);
            printPokemon(data);
        }).catch((err) => {
            handleError(err.response.status);
        });
    }
}

function clearList() {
    document.getElementById('pokemonResult').innerHTML = "";
}

function getPokemonData(name) {
    return new Promise((resolve, reject) => {
        axios.get(`https:/pokeapi.co/api/v2/pokemon/${name}/`)
            .then(res => {
                resolve(res.data)
            }).catch((err) => {
                reject(err);
            });
    });
}

function printPokemon(data) {
    document.getElementById('pokemonResult').innerHTML =
        `<img src=${data.sprites.front_default} alt=${data.name.fisrtToUpperCase()} >
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
            printErr("Algo fue mal");
            break;
    }
}

function setAsLoading() {
    document.getElementById('pokemonResult').innerHTML =
        `<h2>Cargando</h2>`;
}

function printErr(err) {
    document.getElementById('pokemonResult').innerHTML =
        `${err}`;
}

function savePokemon(name, id) {
    favourites.push({ "id": id, "name": name });
}

function listFavourites() {
    document.getElementById('listFavourites').style.display= "none";
    const tbody=document.getElementById('tbodyFavourites');
    listTenPokemon(tbody.rows.length+1);
    //favourites.slice(tbody.rows.length, tbody.rows.length+10).map(item=>getPokemonData(item.name));
}

function listTenPokemon(from){
    for(let i=0;i<10;i++,from++){
        getPokemonData(from).then(data=>{
            addFavouriteToTable(data);
            document.getElementById('listFavourites').style.display= "inline-block";
        }).catch(err=>{
            console.log(err);
            document.getElementById('listFavourites').style.display= "inline-block";
        });
    }
}

function addFavouriteToTable(element) {
    const tbody = document.getElementById('tbodyFavourites');
        let tr = document.createElement("tr");
         tr.innerHTML=
         `<td><img src="${element.sprites.front_default}" alt=${element.name}></td>
          <td>${element.name.fisrtToUpperCase()}</td>
          <td>${element.types.map(item => item.type.name).join(", ")}</td>
          <td>${element.weight}</td>
          <td>${element.abilities.map(item => item.ability.name).join(", ")}</td>
          <td>${element.species.name}</td>
          <td>
          <input id="check${element.name}" type="checkbox" ${favourites.some(item=> item.name==element.name) ? "checked" : ""} name="check" class="checkPokemon" data-pokemonId=${element.id}>
          <label for="check${element.name}" class="pokeball"></label>
          </td>`;
          tbody.appendChild(tr);
}

let selectedPokemons = [];

function saveFavourites(){
    selectedPokemons = [...document.querySelectorAll('input[type="checkbox"][name="check"]:checked')].map(item=>item.dataset.pokemonid);
    // console.log([...document.querySelectorAll('input[type="checkbox"][name="check"]:checked')].map(item=>item.dataset.pokemonid));
    console.log(selectedPokemons);
}

String.prototype.fisrtToUpperCase = function fisrtToUpperCase()  {
    return this.charAt(0).toUpperCase() + this.slice(1);
};


