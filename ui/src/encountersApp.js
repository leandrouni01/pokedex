(()=>{
    verifyToken();
    fillTeamBox();
    fillUsers();
    document.querySelector("#myModal").addEventListener("click",event=>{
        event.preventDefault();
        event.stopPropagation();
        if(event.target.id== "myModal" && itCan){
                event.target.style.display = "none";
                emptyInfo();
        }
    });
})();

let poketeam1;
let poketeam2;
let user2;
let itCan= false;

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
};

function fillTeamBox(){
    axios.get('/list-team',{
        headers: {
            "Authorization": "Bearer "+localStorage.getItem("pkmnItoken")
        }
    })
    .then(res => res.data)
    .then((data)=>{
        poketeam1 = [...data];
        poketeam1.forEach(item=>{addToTeamBox(item,"1")});
    }).catch(err=>console.log(err));
};

function addToTeamBox(data,number){
    const teamBox = document.querySelector("#poketeam"+number);
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML= `
    <span onClick="showInfo(this,${number})"
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

function showInfo(data,number){
    if(data.dataset){
        data=data.dataset;
    }
    const infoDiv = document.querySelector("#pokeinfo"+number);
    infoDiv.innerHTML= `
        <figure class="pokeimg">
            <img src="${"https://www.cpokemon.com/pokes/anime/"+data.id+".png"}" alt="${data.species}">
        </figure>
        <div class="poketypes">
            ${data.types.split(", ").map(type=>`<span class="pkmType ${type}">${type}</span>`).join(" ")}
        </div>
        <div class="description">
            <div>Species: ${data.species}</div>
            <div>Weight: ${data.weight}</div>
        </div>
        <div class="abilities">
            <div><b>Abilities</b></div>
            ${data.abilities.split(", ").map(ability=>`<div>${ability}</div>`).join(" ")}
        </div>
    `;
};

function fillUsers(){
    axios.get('/encounter/list-users',{
        headers: {
            "Authorization": "Bearer "+localStorage.getItem("pkmnItoken")
        }
    })
    .then(res=> res.data)
    .then(data=>{
        fillThem(data);
    })
    .catch(err=>{
        console.log(err);
    })
}

function fillThem(data){
    let divs= "";
    data.forEach(user=>{
        divs += `<div onclick="showTeam2(this)" 
        data-id_user="${user.id_user}"
        data-user_name="${user.user_name}"
        ><h3>${user.user_name}</h3></div>`;
    });
    document.querySelector("#them").innerHTML = divs;
}

function showTeam2(div){
    const data = div.dataset;
    axios.post("/encounter/poke-team",{
        "fk_user": data.id_user
    },{
        headers: {
            "Authorization": "Bearer "+localStorage.getItem("pkmnItoken")
        }
    })
    .then(res=> res.data)
    .then(team=>{
        document.querySelector("#poketeam2").innerHTML="";
        poketeam2= [];
        team.forEach(poke=>{
            addToTeamBox(poke,"2");
        });
        poketeam2 = [...team];
        user2 = {user_id: data.id_user,user_name:data.user_name};
        document.querySelector("#fight").removeAttribute("disabled");
    })
    .catch(err=>{console.log(err)});
};

function fight(){
    axios.post("/encounter",{
        "team1":{
            "team": poketeam1
        },
        "team2": {
            "team": poketeam2,
            "user_name": user2.user_name
        }
    },{
        headers: {
            "Authorization": "Bearer "+localStorage.getItem("pkmnItoken")
        }
    })
    .then(res=>res.data)
    .then(data=>{
        showResults(data);
    })
    .catch(err=>{console.log(err)});
}

function showResults(data){
    document.querySelector("#myModal").style.display = "block";
    itCan = false;
    const info = document.querySelector("#info");
    for(let i=0;i<data.length;i++){
        setTimeout(()=>{
            const div = document.createElement("div");
            if(i<data.length-1){
                div.innerHTML= `
            <b>${data[i].poke1}</b>${data[i].res ? " vencio a ": " perdio contra"} <b>${data[i].poke2}</b>
            `;
            }else{
                div.innerHTML= `
                <b>${data[i].res? "GANASTE": "PERDISTE"}:</b> El jugador ${data[i].user1} ${data[i].res? "ganó": "perdió"} contra ${data[i].user2}
            `;
            itCan = true;
            }
            info.append(div);
        },1500*i);
    }
};

function emptyInfo(){
    document.querySelector("#info").innerHTML = "";
}

function logOut() {
    localStorage.removeItem("pkmnItoken");
    window.location.replace('./loginOrRegister.html');
};

