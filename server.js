const express = require('express');
const app = express();
const superagent = require('superagent');
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

function createSEarch(req, res){
    let url = `https`
}

app.get('/', (req, res) =>{
    res.render(
});

app.listen(PORT, () =>{
    console.log( `ಠ_ಠ it's noisy on port ${PORT}` );
});