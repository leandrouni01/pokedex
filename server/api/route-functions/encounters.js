const typeRels ={
Grass :{
    "x2":["Ground","Rock","Water"],
    "x1/2":["Flying","Poison","Bug","Steel","Fire","Grass","Dragon"]},
Normal :{
    "x2":["None"],
    "x1/2":["Rock","Steel","Ghost"]},
Fighting :{
    "x2":["Normal","Rock","Steel","Ice","Dark","Ghost"],
    "x1/2":["Flying","Poison","Bug","Psychic","Fairy"]},
Flying :{
    "x2":["Fighting","Bug","Grass"],
    "x1/2":["Rock","Steel","Electric"]},
Poison :{
    "x2":["Grass","Fairy"],
    "x1/2":["Poison","Ground","Rock","Ghost","Steel"]},
Ground :{
    "x2":["Poison","Rock","Steel","Fire","Electric"],
    "x1/2":["Bug","Grass"]},
Rock :{
    "x2":["Flying","Bug","Fire","Ice"],
    "x1/2":["Fighting","Ground","Steel"]},
Bug :{
    "x2":["Grass","Psychic","Dark"],
    "x1/2":["Fighting","Flying","Poison","Ghost","Steel","Fire","Fairy"]},
Ghost :{
    "x2":["Ghost","Psychic"],
    "x1/2":["Normal","Dark"]},
Steel :{
    "x2":["Rock","Ice","Fairy"],
    "x1/2":["Steel","Fire","Water","Electric"]},
Fire :{
    "x2":["Bug","Steel","Grass","Ice"],
    "x1/2":["Rock","Fire","Water","Dragon"]},
Water :{
    "x2":["Ground","Rock","Fire"],
    "x1/2":["Water","Grass","Dragon"]},
Electric :{
    "x2":["Flying","Water"],
    "x1/2":["Grass","Electric","Dragon"]},
Psychic :{
    "x2":["Fighting","Poison"],
    "x1/2":["Steel","Psychic"]},
Ice :{
    "x2":["Flying","Ground","Grass","Dragon"],
    "x1/2":["Steel","Fire","Water","Ice"]},
Dragon :{
    "x2":["Dragon"],
    "x1/2":["Steel"]},
Dark :{
    "x2":["Ghost","Psychic"],
    "x1/2":["Fighting","Dark","Fairy"]},
Fairy :{
    "x2":["Fighting","Dragon","Dark"],
    "x1/2":["Poison","Steel","Fire"]},
};

function battle(poke1,poke2){
    //posibilidad de ganar 50/50
    let chance= 5;
    //aumenta posibilidades si los tipos del poke1 son efectivos contra los del poke2
    //y las disminuye si son poco eficaces
    //increases the chances of win if the types of poke1 are effective against the types of poke2 
    //and decreases them if they are unefective
    chance =setChance(poke1,poke2,chance,"atack");
    //aumenta posibilidades si los ataques del poke2 son efectivos contra los del poke1
    //y las disminuye si son poco eficaces
    //increases the chances of win if the types of poke2 are effective against the types of poke1 
    //and decreases them if they are unefective
    chance =setChance(poke2,poke1,chance,"defense");
    if(chance<1){
        return {"poke1": poke1.name,"poke1_id":poke1.id,res: false,"poke2": poke2.name,"poke2_id":poke2.id};
    }else if(chance>=10){
        return {"poke1": poke1.name,"poke1_id":poke1.id,res: true,"poke2": poke2.name,"poke2_id":poke2.id};
    }else{
        //genero un numero del 1 al 10 y lo comparo con si esta en el rango del numero del jugador
        const result = Math.floor(Math.random() * (10 - 1)) + 1;
        if(result<=chance){
            return {"poke1": poke1.name,"poke1_id":poke1.id,res: true,"poke2": poke2.name,"poke2_id":poke2.id};
        }else{
            return {"poke1": poke1.name,"poke1_id":poke1.id,res: false,"poke2": poke2.name,"poke2_id":poke2.id};
        }
    }
};

function setChance(poke1,poke2,chance,action){
    const types1 = poke1.types.split(", ");
    const types2 = poke2.types.split(", ");
    //comparo los tipos
    types1.forEach(type1 => {
        types2.forEach(type2=>{
            if(typeRels[type1]["x2"].indexOf(type2)!=-1){
                if(action=="atack"){
                    chance++;
                }else{
                    chance--;
                }
            }
            if(typeRels[type1]["x1/2"].indexOf(type2)!=-1){
                if(action=="atack"){
                    chance--;
                }else{
                    chance++;
                }
            }
        });
    });
    return chance;
};


function encounter(teams){
    const team1 = teams.team1.team;
    const team2 = teams.team2.team;
    const results = [];
    let t1=0;
    let t2=0;
    for(;t1<team1.length&&t2<team2.length;){
        let result=battle(team1[t1],team2[t2]);
        if(result.res){
            t2++;
        }else{
            t1++;
        }
        results.push(result);
    }
    if(t1==team1.length){
        results.push({user1:teams.team1.user_name,res:false,user2:teams.team2.user_name});
    }else{
        results.push({user1:teams.team1.user_name,res:true,user2:teams.team2.user_name});
    }
    return results;
};
/*
const hola =[{"abilities": "Overgrow, Chlorophyll",
"id": 3,
"id_fav": 111,
"id_team": 36,
"name": "Venusaur",
"species": "Venusaur",
"types": "Grass, Poison",
"weight": "1000"},
{abilities: "Keen-eye, Tangled-feet, Big-pecks",
id: 18,
id_fav: 120,
id_team: 37,
name: "Pidgeot",
species: "Pidgeot",
types: "Normal, Flying",
weight: "395"},
{abilities: "Water-absorb, Shell-armor, Hydration",
id: 131,
id_fav: 129,
id_team: 42,
name: "Lapras",
species: "Lapras",
types: "Water, Ice",
weight: "2200"},
{abilities: "Run-away, Guts, Hustle",
id: 20,
id_fav: 135,
id_team: 43,
name: "Raticate",
species: "Raticate",
types: "Normal",
weight: "185"},
{abilities: "Levitate",
id: 93,
id_fav: 125,
id_team: 45,
name: "Haunter",
species: "Haunter",
types: "Ghost, Poison",
weight: "1"},
{abilities: "Synchronize",
id: 151,
id_fav: 128,
id_team: 55,
name: "Mew",
species: "Mew",
types: "Psychic",
weight: "40"}
];

const hola2 = [{abilities: "Synchronize",
id: 151,
id_fav: 128,
id_team: 55,
name: "Mew",
species: "Mew",
types: "Psychic",
weight: "40"},
{abilities: "Levitate",
id: 93,
id_fav: 125,
id_team: 45,
name: "Haunter",
species: "Haunter",
types: "Ghost, Poison",
weight: "1"},
{abilities: "Run-away, Guts, Hustle",
id: 20,
id_fav: 135,
id_team: 43,
name: "Raticate",
species: "Raticate",
types: "Normal",
weight: "185"},
{abilities: "Water-absorb, Shell-armor, Hydration",
id: 131,
id_fav: 129,
id_team: 42,
name: "Lapras",
species: "Lapras",
types: "Water, Ice",
weight: "2200"},
{abilities: "Keen-eye, Tangled-feet, Big-pecks",
id: 18,
id_fav: 120,
id_team: 37,
name: "Pidgeot",
species: "Pidgeot",
types: "Normal, Flying",
weight: "395"},
{"abilities": "Overgrow, Chlorophyll",
"id": 3,
"id_fav": 111,
"id_team": 36,
"name": "Venusaur",
"species": "Venusaur",
"types": "Grass, Poison",
"weight": "1000"}
];

const poke={team1:{
    "team": hola,
    "user_name": "leandro",
    "user_id": 1
},team2:{
    "team": hola2,
    "user_name": "ordnael",
    "user_id": 2
}};

const hola3= encounter(poke);

console.log(hola3);*/

exports.encounter = encounter;