/**
 * Seminar 2.1 Blockchain primitive
 */

const SHA256 = require('ethereum-cryptography/sha256').sha256;
const utf8ToBytes = require('ethereum-cryptography/utils').utf8ToBytes;


class Block {
    constructor(data){
        this.data = data;      // Here we simplify data, let it be just a simple string
        this.previousHash = null;
    }

    toHash(){
        const hashBytes = utf8ToBytes(this.data + this.previousHash);
        return SHA256(hashBytes);        // a hash as byte array
    }
}


class Blockchain {
    constructor() {
        this.chain = [
            new Block("Genesis")  
        ];
    }

    addBlock(block){
        const previousBlock = this.chain[this.chain.length - 1];
        block.previousHash = previousBlock.toHash();
        this.chain.push(block);
    }

    isValid(){
        if (this.chain[0].previousHash !== null) {
            return false;
        }
        
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            
            const currentPrevHash = currentBlock.previousHash;
            const prevBlockHash = previousBlock.toHash();
            
            if (currentPrevHash.length !== prevBlockHash.length) {
                return false;
            }
            
            for (let j = 0; j < currentPrevHash.length; j++) {
                if (currentPrevHash[j] !== prevBlockHash[j]) {
                    return false;
                }
            }
        }
        return true;
    }
}


module.exports = { Block, Blockchain };
