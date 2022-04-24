const Token = artifacts.require('Token.sol');
const AtomicTransfer = artifacts.require('AtomicTransfer.sol');

contract('AtomicTransferContract', () => {
    it('should deploy Token Contract', async () => {
        const token = await Token.deployed();
        assert(token.address !== '')
    });
    it('should deploy Atomic Transfer Contract', async () => {
        const atomicTransferContract = await AtomicTransfer.deployed();
        assert(atomicTransferContract.address !== '')
    });
})