const Block = require('./block');

// Blockchain implementation
class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    // adding a block to the blockchain
    add_block(data){
        const block = Block.mine_block(this.chain[this.chain.length-1],data);
        this.chain.push(block);
        return block;
    }

    //ensuting the blockchain is in a valid state
    chain_is_valid(chain) {
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) 
            return false;

        for (let i=1; i<chain.length; i++) {
            const block = chain[i];
            const last_block = chain[i-1];

            if (block.last_hash !== last_block.hash ||
                block.hash !== Block.block_hash(block)) {
                return false;
            }
        }
        return true;
    }

    //reach a consensus on which chain to accept decided by length
    chain_replace(newChain) {
        if(newChain.length <= this.chain.length) {
            console.log('The recieved chain is shorter than the current chain.');
            return;
        } 
        else if (!this.chain_is_valid(newChain)) {
            console.log('The recieved chain is not valid.');
            return;
        }
        console.log('The recieved chain will be replacing the existing chain.');
        this.chain = newChain;
    }
}


module.exports = Blockchain;