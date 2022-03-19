const chain_util = require('../chain-util');

// Creating the transaction class
class Transaction {
    constructor() {
        this.id = chain_util.id();
        this.input = null;
        this.outputs = [];
    }


    new_transaction(sender_wallet) {

    }
}