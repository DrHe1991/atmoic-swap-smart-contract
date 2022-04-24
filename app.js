const express = require('express')
const Web3 = require('web3')
const TokenContract = require('./build/contracts/Token.json')
const AtomicTransferContract = require('./build/contracts/AtomicTransfer.json')
const config = require("./config")
const app = express()

// user config
const [bob1, bob2] = config.bob
const [alice1, alice2] = config.alice

// connect to two block chains
let TokenContract1;
let TokenContract2;
let AtomicTransferContract1;
let AtomicTransferContract2;
let TokenContract1Address;
let TokenContract2Address;
let AtomicTransferContract1Address;
let AtomicTransferContract2Address;

const init = async () => {
    const web31 = new Web3("ws://localhost:7545");
    const web32 = new Web3("ws://localhost:8545");
    const networkId1 = await web31.eth.net.getId();
    const networkId2 = await web32.eth.net.getId();
    TokenContract1Address = TokenContract.networks[networkId1].address
    TokenContract2Address = TokenContract.networks[networkId2].address
    AtomicTransferContract1Address = AtomicTransferContract.networks[networkId1].address
    AtomicTransferContract2Address = AtomicTransferContract.networks[networkId2].address

    TokenContract1 = new web31.eth.Contract(
        TokenContract.abi,
        TokenContract1Address
    )
    TokenContract2 = new web32.eth.Contract(
        TokenContract.abi,
        TokenContract2Address
    )
    AtomicTransferContract1 = new web31.eth.Contract(
        AtomicTransferContract.abi,
        AtomicTransferContract1Address
    )
    AtomicTransferContract2 = new web32.eth.Contract(
        AtomicTransferContract.abi,
        AtomicTransferContract2Address
    )
}

init()

// start server
app.listen(3000, () => {
    console.log('server start at http://localhost:3000');
});

app.use(express.json());
app.use(express.static('./public'))

// router
app.get('/showBalance', async (req, res) => {
    let result
    try {
        result = await showBalance()
    } catch (err) {
        return res.status(500).send('showBalance failed')
    }
    res.status(200).send(result)
})

app.post('/withdraw', async (req, res) => {
    const { chain, token, address } = req.body
    try {
        if (chain == '1') {
            result = await AtomicTransferContract1.methods.withdraw(token).send({ from: address })
        } else {
            result = await AtomicTransferContract2.methods.withdraw(token).send({ from: address })
        }
    } catch (err) {
        return res.status(500).send('withdraw failed')
    }
    res.status(200).send('withdraw success')
});

app.get('/revealSecret', async (req, res) => {
    try {
        result = await AtomicTransferContract2.methods.secret().call()
    } catch (err) {
        return res.status(500).send('reveal secret failed')
    }
    res.status(200).send(result)
})

const showBalance = async () => {
    addressArray1 = [AtomicTransferContract1Address, bob1, alice1]
    addressArray2 = [AtomicTransferContract2Address, bob2, alice2]
    const [vAtomicTransferContract1Address, vbob1, valice1] = await Promise.all(addressArray1.map(async a => {
        console.log(a)
        return TokenContract1.methods.balanceOf(a).call()
    }))

    const [vAtomicTransferContract2Address, vbob2, valice2] = await Promise.all(addressArray2.map(async a => {
        return TokenContract2.methods.balanceOf(a).call()
    }))
    return {
        chain1: { contract: vAtomicTransferContract1Address, bob: vbob1, alice: valice1 },
        chain2: { contract: vAtomicTransferContract2Address, bob: vbob2, alice: valice2 }
    }
}

app.post('/all', () => {
})