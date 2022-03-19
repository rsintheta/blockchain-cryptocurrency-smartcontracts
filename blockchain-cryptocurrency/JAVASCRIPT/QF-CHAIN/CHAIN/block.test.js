const Block = require('./block');

describe('Block', ()=>{
    let data, last_block, block;

    beforeEach(() => {
        data = 'test';
        last_block = Block.genesis();
        block = Block.mine_block(last_block,data);
    });

    it('sets the `data` to match the input', () => {
        expect(block.data).toEqual(data);
    });

    it('sets the `last_hash` to match the hash of the last block', () => {
        expect(block.last_hash).toEqual(last_block.hash);
    });

    it('generates a hash that matches the difficulty', () => {
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
    });

    it('lowers the difficulty for slowly mined blocks', () => {
        expect(Block.adjust_difficulty(block, block.timestamp+360000)).toEqual(block.difficulty - 1);
    });

    it('raises the difficulty for quickly mined blocks', () => {
        expect(Block.adjust_difficulty(block, block.timestamp+1)).toEqual(block.difficulty + 1);
    });
});