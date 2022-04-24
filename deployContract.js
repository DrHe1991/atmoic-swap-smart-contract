
/**
 * this file is to demo the functionality in js, that could 
 **/

const Web3 = require('web3')
const keccak256 = require("keccak256");
const code = JSON.parse(require('fs').readFileSync('./build/contracts/AtomicTransfer.json').toString());
const erc20Code = JSON.parse(require('fs').readFileSync('./build/contracts/ERC20.json').toString());
console.log(Object.keys(code))
const web3 = new Web3("ws://localhost:8545");


main().catch(err => console.log(err)).then(() => process.exit());
async function main() {
    const networkId = await web3.eth.net.getId();

    // alice and bob accounts have been created by ganache
    const alice = {
        address: '0x7A629e15dB62Cb8d90028A7248f3217B151e04d0',
        privateKey: '0xbdaa3cfff08d5683e2f939d6ae518ea0798af4de1ee4501dd9078c798fa3921a'
    };
    const bob = {
        address: '0xa9dB9Eca27334d9f3b2AC5F9Bc3814415053f8FB',
        privateKey: '0xbe4bc9a820f0f56a1e63ca5ed47352f9b3a19312a206d1bd14e382fd86d1b7d2'
    };

    // just copy and assign the address and private key from a generated key into a new variable as you need.
    // this is needed for the address of a contract
    const randomAddress = web3.eth.accounts.create(Math.random().toString());
    console.log({ randomAddress });

    const tokenAccount = {
        address: '0x7995F7640f644720e6ECE02E746393bfc0844658',
        privateKey: '0xb7c58273ea8c3c57c5b6cfb97e76223973399cd19ae0d41b6668134cb92f111f',
    }

    await deployToken('Token A', 'TKNA', tokenAccount, alice);


    const contractAccount = {
        address: '0xae0782f442e3dE24851a1413e80F10bdA9E23194',
        privateKey: '0x0547655007895e9101330fc8b4ee430367799b6b9213b5bb88c05b9e326e21eb',
    };
    const { transaction, contract } = await deployContract(contractAccount, tokenAccount, alice, bob, 1, 'Hallo', timeout);


    // fund the contract
    var fundContract = new web3.eth.Contract(code.abi, contractAccount.address);
    await fundContract.methods.fund().send({ from: alice.address })
    console.log('funded');


    // withdraw the contract
    var withdrawContract = new web3.eth.Contract(code.abi, contractAccount.address);
    await withdrawContract.methods.withdraw(keccak256('Hello').toString('hex')).send({ from: bob.address })
    console.log('withdrawn');

}

async function deployContract(contractAccount, tokenAccount, senderAccount, receiverAccount, amount = 1, secret = "Hallo", timeout = 10000) {
    const secretHash = keccak256(secret).toString('hex');
    var contract = new web3.eth.Contract(code.abi, contractAccount.address, { gas: 1500000, gasPrice: 1172098, from: senderAccount.address });
    console.log();
    const transaction = await contract.deploy({
        data: code.bytecode,
        arguments: [receiverAccount.address, tokenAccount.address, amount, secretHash, timeout],
    });
    await transaction.send();
    return { transaction, contract };
}

async function deployToken(name, key, tokenAccount, deployerUserAccount) {
    var tokenContract = new web3.eth.Contract(erc20Code.abi, tokenAccount.address, { gas: 1500000, gasPrice: 1172098, from: deployerUserAccount.address });
    const tokenContractTransaction = await tokenContract.deploy({
        data: erc20Code.bytecode,
        arguments: [name, key],
    });
    await tokenContractTransaction.send();
    console.log('tokenDeployed');
}
