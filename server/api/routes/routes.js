const functions = require('../route-functions/route-functions');

//console.log(functions.listFavPokemon(),functions.saveFavPokemon(),functions.deleteFavPokemon());

module.exports = (app)=>{
    app.get('/list-favourites', functions.listFavPokemon);
    app.post('/save-favourite', functions.saveFavPokemon);
    app.delete('/delete-favourite',functions.deleteFavPokemon);
}