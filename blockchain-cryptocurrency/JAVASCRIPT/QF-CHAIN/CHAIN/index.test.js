const Blockchain = require('./index');
const Block = require('./block');

describe('Blochain Testing', () => {
    let bc, bc2;
    beforeEach(() => {
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it('successfully begins with genesis block', () => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    });


    it('successfully adds a new block', () =>{
        const data = 'lorem ipsum';
        bc.add_block(data);
        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
    });


    it('successfully validates a chain as intended', ()=> {
        bc2.add_block('lorem ipsum');
        expect(bc.chain_is_valid(bc2.chain)).toBe(true);
    });


    it('successfully invalidates a chain with a corrupt genesis block', () => {
        bc2.chain[0].data = 'Test';
        expect(bc.chain_is_valid(bc2.chain)).toBe(false);
    });


    it('successfully invalidates a chain with corrupt block anywhere', () => {
        bc2.add_block('Lorem Ipsum');
        bc2.chain[1].data = 'Orlem Lipsum';
        expect(bc.chain_is_valid(bc2.chain)).toBe(false);
    });

    it('confirms that a chain is replaced when the given chain is valid input', ()=> {
        bc2.add_block('Orlem Lipsum');
        bc.chain_replace(bc2.chain);
        expect(bc.chain).toEqual(bc2.chain);
    });

    it('confirms that a chain is not replaced when the given chain is too short', ()=> {
        bc.add_block('Rolem Ripsum');
        bc.chain_replace(bc2.chain);
        expect(bc.chain).not.toEqual(bc2.chain);
    });

});