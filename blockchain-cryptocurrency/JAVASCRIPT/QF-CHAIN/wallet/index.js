const chain_util = require('../chain-util');
const { INITIAL_BALANCE } = require('../config');

// A simple wallet class
class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair =  chain_util.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }


    // toString helper function    
    toString() {
        return `Wallet-
            PublicKey: ${this.publicKey.toString()}
            balance: ${this.balance}`
    }
}


module.exports = Wallet;