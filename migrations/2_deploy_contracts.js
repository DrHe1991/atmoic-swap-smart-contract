const keccak256 = require("keccak256");
const config = require("../config")
const [bob1, bob2] = config.bob
const [alice1, alice2] = config.alice
const secretHash = keccak256(config.secretToken)

const Token = artifacts.require('Token.sol');
const AtomicTransfer = artifacts.require('AtomicTransfer.sol');

module.exports = async function (deployer, network) {
  if (network === 'development1') {
    await deployer.deploy(Token, 'Token A', 'TokenA', { from: bob1 });
    const tokenA = await Token.deployed();
    await deployer.deploy(AtomicTransfer, alice1, tokenA.address, 1, secretHash, 60 * 60 * 24, { from: bob1 });
    const atomicTransfer = await AtomicTransfer.deployed();
    await tokenA.approve(atomicTransfer.address, 1, { from: bob1 });
    await atomicTransfer.fund({ from: bob1 });
  }
  if (network === 'development2') {
    await deployer.deploy(Token, 'Token B', 'TokenB', { from: alice2 });
    const tokenB = await Token.deployed();
    await deployer.deploy(AtomicTransfer, bob2, tokenB.address, 1, secretHash, 60 * 60 * 6, { from: alice2 });
    const atomicTransfer = await AtomicTransfer.deployed();
    await tokenB.approve(atomicTransfer.address, 1, { from: alice2 });
    await atomicTransfer.fund({ from: alice2 });
  }
};
