(() => {
    verifyToken();
    fillTeamBox();
    document.querySelector("#close").addEventListener("click",(event)=>{
        document.querySelector("#myModal").style.display = "none";
    });
    document.querySelector("#myModal").addEventListener("click",event=>{
        event.preventDefault();
        event.stopPropagation();
        if(event.target.id== "myModal"){
            event.target.style.display = "none";
        }
    });
})();

let poketeam = [];

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
            data.forEach(item => {
                if(!poketeam.some(teamItem=>teamItem.id_fav==item.id_fav)){
                    addToBox(item,"guardar")
                };
            });
        })
        .catch(err => console.log(err));
};

function fillTeamBox(){
    axios.get('/list-team',{
        headers: {
            "Authorization": "Bearer "+localStorage.getItem("pkmnItoken")
        }
    })
    .then(res => res.data)
    .then((data)=>{
        poketeam = [...data];
        fillFavBox();
        poketeam.forEach(item=>{addToTeamBox(item)});
    }).catch(err=>console.log(err));
}

function addToBox(data,action) {
    const box = document.querySelector("#pokeboxgrid");
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML =
        `<span onClick="showInfo(this,'${action}')" 
               data-id="${data.id}"
               data-name="${data.name}" 
               data-types="${data.types}"
               data-abilities="${data.abilities}"
               data-weight="${data.weight}"
               data-species="${data.species}"
               data-id_fav="${data.id_fav}">
            <img src=${"./images/box-sprites/" + ("00" + data.id).slice(-3) + "MS.png"} alt=${data.species}>
        </span>`;
    box.append(div);
};

function showInfo(data,action){
    if(data.dataset){
        data=data.dataset;
    }
    const infoDiv = document.querySelector("#pokeinfo");
    infoDiv.innerHTML= `
    <figure id="pokeimg">
    <img src="${"https://www.cpokemon.com/pokes/anime/"+data.id+".png"}" alt="${data.species}">
    </figure>
    <div id="buttoninfo">
        <button 
        data-id="${data.id}"
        data-species="${data.species}"
        data-name="${data.name}"
        data-types="${data.types}"
        data-weight="${data.weight}"
        data-abilities="${data.abilities}"
        data-img="${"https://www.cpokemon.com/pokes/anime/"+data.id+".png"}"
        type="button"
        onclick="modalInfo(this)">Ver Informacion</button>
    </div>
    <div id="buttonadd">
        <button type="button"
        data-id="${data.id}"
        data-species="${data.species}"
        data-name="${data.name}"
        data-types="${data.types}"
        data-weight="${data.weight}"
        data-abilities="${data.abilities}"
        data-img="${"https://www.cpokemon.com/pokes/anime/"+data.id+".png"}"
        data-id_fav="${data.id_fav}"
        ${action!="guardar" ? "data-id_team='"+data.id_team+"'": ""}
        onclick="${action=="guardar"? "addToTeam(this)": "removeFromTeam(this)"}"
        >${action=="guardar"? "Agregar al equipo": "Quitar del equipo"}</button>
    </div>
    `;
}

function modalInfo(data){
    if(data.dataset){
        data= data.dataset;
    }
    document.querySelector("#info").innerHTML = `
        <figure id="CImgPkmnInfo">
            <img id="imgPkmnInfo" src="${data.img}" alt="Signo de interrogacion">
        </figure>
        <div id="pkmnDescription">
            <p>Species: ${data.species}</p>
            <p>Weight: ${data.weight}</p>
        </div>
        <div id="types">
            ${data.types.split(", ").map(type=>`<span class="pkmType ${type}">${type}</span>`).join(" ")}
        </div>
        <div id="abilities">
            <div><b>Abilities</b>
            ${data.abilities.split(", ").map(ability=>`<div>${ability}</div>`).join("")}
        </div>
    `;
    document.querySelector("#myModal").style.display = "block";
};

function addToTeam(data){
    if(poketeam.length<6){
        if(data.dataset){data = data.dataset};
    axios.post("/add-to-team",
    {
        fk_fav: data.id_fav,
        name: data.name,
        types: data.types,
        abilities: data.abilities,
        weight: data.weight,
        species: data.species,
        img: data.img,
        id_pokemon: data.id
    },{
        headers: {
            "Authorization": "Bearer "+localStorage.getItem("pkmnItoken")
        }
    }).then(res=>{
        const favCard = document.querySelector(`span[data-id_fav="${data.id_fav}"]`).parentElement;
        data.id_team = res.data.insertId;
        poketeam.push(data);
        addToTeamBox(data);
        showInfo(data,"eliminar");
        favCard.parentElement.removeChild(favCard);
    }).catch(err=>{
        console.log(err);
    });
    }else{
        alert("Solo puede haber hasta 6 pokemon en el equipo");
    }
};

function addToTeamBox(data){
    const teamBox = document.querySelector("#poketeamgrid");
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML= `
    <span onClick="showInfo(this,'eliminar')"
           data-id="${data.id}"
           data-name="${data.name}" 
           data-types="${data.types}"
           data-abilities="${data.abilities}"
           data-weight="${data.weight}"
           data-species="${data.species}"
           data-id_fav="${data.id_fav}"
           data-id_team="${data.id_team}">
        <img src=${"./images/box-sprites/" + ("00" + data.id).slice(-3) + "MS.png"} alt=${data.species}>
    </span>`;
    teamBox.append(div);
};

function removeFromTeam(data){
    data = data.dataset;
    axios({
        method: "DELETE",
        url: '/remove-from-team',
        data: {
            id_poke_team: data.id_team
        },
        headers: {
            "Authorization": "Bearer "+localStorage.getItem("pkmnItoken")
        }}).then(res=>{
            const teamCard = document.querySelector("span[data-id_team='"+data.id_team+"']").parentElement;
            addToBox(data,"guardar");
            showInfo(data,"guardar");
            poketeam.splice(poketeam.findIndex(item => { return item.id_team == data.id_team }), 1);
            teamCard.parentElement.removeChild(teamCard);
        }).catch(err=>{console.log(err)});
};

function logOut() {
    localStorage.removeItem("pkmnItoken");
    window.location.replace('./loginOrRegister.html');
};

