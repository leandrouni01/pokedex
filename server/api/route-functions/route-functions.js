const con = require('../database-connection/database-connection').con;

exports.listFavPokemon = (req,res)=>{
    con.query(`SELECT * FROM favourite_pokemon`,(err,result,fields)=>{
        if(err) {return console.log(err); res.status(500).send(err)};
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(result);
    });
};

exports.saveFavPokemon= (req,res)=>{
        con.query(`INSERT INTO favourite_pokemon(pokemon_id,pokemon_name,pokemon_types,pokemon_abilities,pokemon_species,pokemon_weight,pokemon_sprite) VALUES (?,?,?,?,?,?,?);`,
        [req.body.id,req.body.name,req.body.types,req.body.abilities,req.body.species,req.body.weight,req.body.sprite],(err,result,fields)=>{
            if(err) {console.log(err); res.status(500).send(err)};
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(result);
        });
};

exports.deleteFavPokemon= (req,res)=>{
    con.query(`DELETE FROM favourite_pokemon WHERE id_fav=?`,
    [req.body.id],(err,result,fields)=>{
        if(err) {res.send(500).send(err)};
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(result);
    });
};