const functions = require('../route-functions/route-functions');
const routeProtector = require('../route-functions/route-protector').routeProtector;
const path = require('path');


module.exports = (app)=>{
    app.get('/list-favourites',routeProtector , functions.listFavPokemon);
    app.get('/',(req,res)=>{res.sendFile(path.join(__dirname,'../../../ui/addpokemon.html'))});
    app.get('/list-team',routeProtector,functions.listTeam);
    app.post('/add-to-team',routeProtector, functions.addToTeam);
    app.delete('/remove-from-team',routeProtector,functions.removeFromTeam);
    app.post('/save-favourite',routeProtector ,functions.saveFavPokemon);
    app.delete('/delete-favourite',routeProtector ,functions.deleteFavPokemon);
    app.post('/login', functions.login);
    app.post('/register',functions.register);
    app.post('/verify', functions.verifyToken);
    app.get('/list-users',functions.listUsers);
    app.post('/encounter',routeProtector,functions.encounters);
    app.get('/encounter/list-users',routeProtector,functions.encounterListUsers);
    app.post('/encounter/poke-team',routeProtector,functions.encounterPokeTeam);
}