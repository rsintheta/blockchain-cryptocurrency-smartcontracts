const SHA256 = require('crypto-js/sha256');
const { CHALLENGE_RATING, MINE_RATE } = require('../config');

// The block, the building block of the blockchain. block.
class Block {
    constructor(timestamp, last_hash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.last_hash = last_hash;
        this.hash =  hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || CHALLENGE_RATING;
    }

    // helper function to return block information
    toString() {
        return `Block -
            Timestamp: ${this.timestamp}
            Last Hash: ${this.last_hash.substring(0,10)}
            Hash: ${this.hash.substring(0,10)}
            Nonce: ${this.nonce}
            Difficulty: ${this.difficulty}
            Data: ${this.data}`;
    }

    // generate the genesis blocvk
    static genesis() {
        return new this('Genesis Time', '0', 'G3N3S1S', ['Lorem Ipsum'], 0, CHALLENGE_RATING);
    }

    // mine a block using the proof of work algorithm on a dynamic difficulty scale
    static mine_block(last_block, data) {
        let hash, timestamp;
        const last_hash = last_block.hash;
        let { difficulty } = last_block;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjust_difficulty(last_block, timestamp);
            hash = Block.hash(timestamp, last_hash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this(timestamp, last_hash, hash, data, nonce, difficulty);
    }

    // helper function to hash the block data
    static hash(timestamp, last_hash, data, nonce, difficulty) {
        return SHA256(`${timestamp}${last_hash}${data}${nonce}${difficulty}`).toString();
    }

    // helper function to hash the block without having to put all the data in every time
    static block_hash(block) {
        const { timestamp, last_hash, data, nonce, difficulty } = block;
        return Block.hash(timestamp, last_hash, data, nonce, difficulty);
    }

    // function to adjust the difficulty of the nonce by comparing progress with the last block's timestamp
    static adjust_difficulty(last_block, current_time) {
        let {difficulty } = last_block;
        difficulty = last_block.timestamp + MINE_RATE > current_time ? difficulty + 1 : difficulty - 1
        return difficulty;
    }
}

module.exports = Block;