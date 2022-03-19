const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../CHAIN');
const P2PServer = require('./p2pserver');

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = express();
const bc = new Blockchain();
const p2pServer = new P2PServer(bc);

// Recieve json through post request
app.use(bodyParser.json());

//get blockchain endpoint
app.get('/blocks', (req, res) => {
    res.json(bc.chain);
});

app.post('/mine', (req, res) => {
    const block = bc.add_block(req.body.data);
    console.log(`New block added: ${block.toString()}`);
    p2pServer.sync_chains();
    res.redirect('/blocks');
});

//setup port 
app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();