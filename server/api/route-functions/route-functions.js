const con = require('../database-connection/database-connection').con;
require('dotenv').config();
const encounter = require("./encounters").encounter;

const jwt = require('jsonwebtoken');

exports.listFavPokemon = (req, res) => {
    con.query(`SELECT id_fav,pokemon_id AS id, pokemon_name AS name, pokemon_types AS types, pokemon_abilities AS abilities, pokemon_weight AS weight, pokemon_species AS species,pokemon_sprite as img FROM favourite_pokemon WHERE fk_user=?`
    ,[req.decoded.id_user],
    (err, result, fields) => {
        if (err) {return res.status(500).send(err) };
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(result);
    });
};

exports.saveFavPokemon = (req, res) => {
    con.query(`INSERT INTO favourite_pokemon(fk_user,pokemon_id,pokemon_name,pokemon_types,pokemon_abilities,pokemon_species,pokemon_weight,pokemon_sprite) VALUES (?,?,?,?,?,?,?,?);`,
        [req.decoded.id_user,req.body.id, req.body.name, req.body.types, req.body.abilities, req.body.species, req.body.weight, req.body.sprite],
        (err, result, fields) => {
            if (err) {return res.status(500).send(err) };
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(result);
        });
};

exports.deleteFavPokemon = (req, res) => {
    con.query(`DELETE FROM favourite_pokemon WHERE id_fav=?`,
        [req.body.id], (err, result, fields) => {
            if (err) {res.status(500).send(err); return console.log(err);};
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(result);
        });
};

exports.login = (req, res) => {
    con.query(`SELECT * FROM users WHERE users.user_name LIKE BINARY ? AND users.user_password LIKE BINARY ?`,
        ["%"+req.body.user+"%","%"+req.body.password+"%"], (err, result, fields) => {
            if (err) {return res.status(500).send(err) };
            if (result.length > 0) {
                const payload = {id_user: result[0].id_user,user_name: req.body.user};
                const token = jwt.sign(payload, process.env.SECRETKEY);
                res.status(200).json({token: token});
            } else {
                res.status(404).send(new Error("El usuario o contraseña suministrados son incorrectos"));
            }
        });
};

exports.register = (req,res)=>{
    con.query(`SELECT * FROM users WHERE users.user_name LIKE BINARY ?`,
    ["%"+req.body.user+"%"],
    (err,result,fields)=>{
        if(err)return res.status(500).send(err);
        if(result.length>0){
            res.status(409).send({errMessage: "Ese nombre de usuario ya esta en uso"});
        }else{
            con.query('INSERT INTO users(user_name,user_password) VALUES (?,?)',
            [req.body.user,req.body.password],
            (err,result,fields)=>{
                if(err)return res.status(500).send(err);
                const payload = {id_user: result.insertId,user_name: req.body.user};
                const token = jwt.sign(payload,process.env.SECRETKEY);
                res.status(200).send({token: token});
            })
        }
    })
};

exports.verifyToken= (req,res)=>{
    if(!req.body.token){
        res.status(409).send({message: "Token not provided"});
    }else{
        jwt.verify(req.body.token,process.env.SECRETKEY,(err,decoded)=>{
            if(err) return res.status(401).send({message: "Invalid token"});
            res.status(200).send({user_name: decoded.user_name});
        });
    }
};

exports.addToTeam = (req,res)=>{
    con.query("INSERT INTO `poke_team`(`fk_fav`, `poke_name`, `poke_types`, `poke_abilities`, `fk_user`, `poke_weight`, `poke_species`, `poke_sprite`,poke_id) VALUES (?,?,?,?,?,?,?,?,?)",
    [req.body.fk_fav,req.body.name,req.body.types,req.body.abilities,req.decoded.id_user,req.body.weight,req.body.species,req.body.img,req.body.id_pokemon],
    (err,result,fields)=>{
        if(err) return res.status(500).send(err);
        res.status(200).send({insertId: result.insertId});
    });
}

exports.removeFromTeam= (req,res)=>{
    con.query("DELETE FROM `poke_team` WHERE `id_poke_team`=?",
    [req.body.id_poke_team],
    (err,result,fields)=>{
        if(err) return res.status(500).send(err);
        res.status(200).send({message: "success"});
    });
};

exports.listTeam = (req,res)=>{
    con.query("SELECT poke_id AS id,poke_name AS name,poke_types AS types,poke_abilities AS abilities,poke_weight AS weight,poke_species AS species, fk_fav AS id_fav,id_poke_team AS id_team FROM poke_team WHERE fk_user=?",
    [req.decoded.id_user],
    (err,result,fields)=>{
        if (err) {return res.status(500).send(err) };
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(result);
    });
};

exports.listUsers = (req,res)=>{
    con.query("SELECT user_name,(SELECT COUNT(id_fav) FROM favourite_pokemon WHERE id_user=fk_user) AS 'poke_number' FROM users",
    (err,result,fields)=>{
        if(err){return res.status(500).send(err)}
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(result);
    });
};

exports.encounterListUsers = (req,res)=>{
    con.query("SELECT user_name,id_user FROM users WHERE id_user!=?",
    [req.decoded.id_user],
    (err,result,fields)=>{
        if(err){return res.status(500).send(err)}
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(result);
    });
}

exports.encounterPokeTeam = (req,res)=>{
    con.query("SELECT poke_id AS id,poke_name AS name,poke_types AS types,poke_abilities AS abilities,poke_weight AS weight,poke_species AS species, fk_fav AS id_fav,id_poke_team AS id_team FROM poke_team WHERE fk_user=?",
    [req.body.fk_user],
    (err,result,fields)=>{
        if(err){return res.status(500).send(err)}
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(result);
    });
}

exports.encounters= (req,res)=>{
    const poke={team1:{
        "team": req.body.team1.team,
        "user_name": req.decoded.user_name,
        "id_user": req.decoded.id_user
    },team2:{
        "team": req.body.team2.team,
        "user_name": req.body.team2.user_name,
    }};
    const results = encounter(poke);
    con.query("INSERT INTO encounters(team1_poke1,team1_poke2,team1_poke3,team1_poke4,team1_poke5,team1_poke6,team2_poke1,team2_poke2,team2_poke3,team2_poke4,team2_poke5,team2_poke6,user_1_name,user_2_name,win,user_1_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
    [req.body.team1.team[0].id,req.body.team1.team[1].id,req.body.team1.team[2].id,req.body.team1.team[3].id,
    req.body.team1.team[4].id,req.body.team1.team[5].id,req.body.team2.team[0].id,req.body.team2.team[1].id,
    req.body.team2.team[2].id,req.body.team2.team[3].id,req.body.team2.team[4].id,req.body.team2.team[5].id,
    req.decoded.user_name,req.body.team2.user_name,results[results.length-1].res? 1:0,req.decoded.id_user],
    (err,result,fields)=>{
        if(err){console.log(err); return res.status(500).send(err)};
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(results);
    });
};