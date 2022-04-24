# An atomic swap smart contract using hashed time lock

## Installation
1. install [node.js](https://nodejs.org/en/)
2. install Truffle globally
```
npm install -g truffle
```
3. install the dependancys
```
git clone {url}
cd ./{pathToDir}
npm install
```
4. congiure the network setting in  `truffle-config`, start the test blockchain server such as [ganache](https://trufflesuite.com/ganache/) if needed
5. input Alice and Bob public address and the secret in `config.js`
6. run the migration code to deploy the coin contract in `each` network to fulfill step 1&2 in the procedures
``` 
truffle migrate --network {networkName}
```
7. run test to see if the contract build and deployment is successful
``` 
truffle test --network {networkName}
```
8. start the web app
``` 
npm run start
```
9. open `localhost:3000` in broswer and follow step3 to finish the swap


## Procedures
### Prerequisite
1. deploy a tokenA smart contract on chain1 for Bob, given him one tokenA for swap
2. deploy a tokenB smart contract on chain2 for Alice, given her one tokenB for swap
### Smart contract deployment
3. Bob makes up a secret and hash it into a secret token and give Alice that token
4. Bob deploys an atomic swap smart contract on chain1 using the secret token
5. Alice deploys the same smart contract on chain2 using the same token
### Swap
6. Bob sends the tokenA to the contract
7. Alice sends the tokenB to the contract
8. Bob withdraws tokenB from the contract in chain2 by providing the serect
10. When smart contract releases the money to Bob, it make the secret public for Alice to know
11. Alice will be able to withdraw tokenA as she knows the secret now
12. Alice can always get the refund from the smart contract after a certain amount of time if Bob didn't withdraw and release the secret

>note: in step 4&5, Alice will always deploy the smart contract with much longer time frame than Bob, it will make Alice have enough time to withdraw money from the contract, even if Bob withdraws in the last minute in his time frame

## Todos
* Run this in a public chain such as Ropsten or Kovan
>note: current version code was tested and proven functional in a local environment only
* More test case for the smart contract
* Use a framework on frontend and beatify the UI
* Write test cases for the web server
