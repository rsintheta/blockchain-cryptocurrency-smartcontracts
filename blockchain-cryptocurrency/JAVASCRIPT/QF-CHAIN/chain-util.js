const EC = require('elliptic').ec;
const uuidV1 = require('uuid/v1');
const ec = new EC('secp256k1');

// Setting up chain util for key generation.
class chain_util {
    static gen_key_pair() {
        return ec.gen_key_pair();
    }


    static id() {
        return uuidV1();
    }
}

module.exports = chain_util;