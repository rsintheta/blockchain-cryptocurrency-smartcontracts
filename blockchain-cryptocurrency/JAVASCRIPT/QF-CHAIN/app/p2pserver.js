// $ set HTTP_PORT=5042 && set P2P_PORT=5043 && set PEERS=ws://localhost:5044, ws://localhost:5044 && npm run dev

const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5041;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

// create a class for P2P communication
class P2PServer {
    constructor(blockchain){
        this.blockchain = blockchain;
        this.sockets = [];
    }

    // listen for peer to peer connections on P2P_PORT
    listen() {
        const server = new Websocket.Server({ port: P2P_PORT });
        server.on('connection', socket => this.connect_socket(socket));

        this.connect_to_peers();

        console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
    }

    // connect to valid peers
    connect_to_peers() {
        peers.forEach(peer => {
            // ws://localhost:5001
            const socket = new Websocket(peer);

            socket.on('open', () => this.connect_socket(socket));
        });
    }

    // connect socket
    connect_socket(socket){
        this.sockets.push(socket);
        console.log('Socket connected');
        this.message_handler(socket);
        this.send_chain(socket);
    }

    // simple message handler for sockets
    message_handler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message);
            this.blockchain.chain_replace(data);
        });
    }

    // sends chain
    send_chain(socket) {
        socket.send(JSON.stringify(this.blockchain.chain));
    }

    // syncs chains
    sync_chains() {
        this.sockets.forEach(socket => this.send_chain.socket);
    }
}


module.exports = P2PServer;