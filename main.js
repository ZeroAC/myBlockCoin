const SHA256 = require('crypto-js/sha256');
class Block{//区块节点
    constructor(index, timestamp, data, precedingHash=""){
        this.index = index;//区块区号
        this.timestamp = timestamp;//时间戳 
        this.data = data;//交易数据
        this.precedingHash = precedingHash;//前一个区块的哈希值
        this.hash = this.computeHash();//当前区块的哈希值
        this.nonce = 0;//随机数 用于挖矿     
    }
    computeHash(){
        return SHA256(this.index + this.precedingHash + this.timestamp + JSON.stringify(this.data)+this.nonce).toString();
    }

    proofOfWork(difficulty){//工作量证明机制 用于达成区块链共识 以算力为评价准则 来添加新的区块
        //难度越高 则区块算出的hash值需要越多的前导0 难度也就更大
        while(this.hash.substring(0, difficulty) !==Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.computeHash();
        }        
    }
}

class BlockChain {//区块链
    constructor() {
        this.blockchain = [this.getGenesisBlock()];
        this.difficulty = 5;//设置工作量难度
    }
    getGenesisBlock() {//创世块 硬编码
        return new Block(0, "01/01/2021", "Initial Genesis-Block in the Chain", "0");
    }
    getLatestBlock() {//获取区块链上的最新区块 即当前链的最后一个
        return this.blockchain[this.blockchain.length - 1];
    }
    addNewBlock(newBlock) {//添加区块到区块链中
        newBlock.precedingHash = this.getLatestBlock().hash;
        newBlock.proofOfWork(this.difficulty);//挖矿
        this.blockchain.push(newBlock);
    }
    checkChainValidity() {//验证区块链是否有效 即区块内容是否被篡改
        for (let i = 1; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const precedingBlock = this.blockchain[i - 1];

            if (currentBlock.hash !== currentBlock.computeHash()) return false;//区块本身的hash对不上
            if (currentBlock.precedingHash !== precedingBlock.hash) return false;//区块的指向hash对不上
        }
        return true;
    }
}


//测试
let myCoin = new BlockChain();
myCoin.addNewBlock(new Block(1, "07/07/2021", {sender: "zero", recipient: "ac", quantity: 50}));
myCoin.addNewBlock(new Block(2, "09/09/2021", {sender: "zero", recipient: "ak", quantity: 100}) );
console.log(myCoin);


