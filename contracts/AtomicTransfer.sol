pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract AtomicTransfer {
    IERC20 public token;
    uint256 public lockTime = 100000 seconds;
    bytes32 public timeHash;
    string public secret; //abracadabra
    bytes32 public secretHash;
    address public recipient;
    address public owner;
    uint256 public amount;

    constructor(
        address _recipient,
        address _token,
        uint256 _amount,
        bytes32 _secretHash,
        uint256 _lockTime
    ) {
        lockTime = _lockTime;
        recipient = _recipient;
        owner = msg.sender;
        amount = _amount;
        token = IERC20(_token);
        secretHash = _secretHash;
    }

    function fund() external {
        timeHash = calculateTimeHash(block.timestamp, lockTime);
        token.transferFrom(msg.sender, address(this), amount);
    }

    function withdraw(string memory _secret) external {
        require(
            keccak256(abi.encodePacked(_secret)) == secretHash,
            "Secret is Wrong, please provide the right secret"
        );
        secret = _secret;
        token.transfer(recipient, amount);
    }

    function refund() external {
        require(
            calculateTimeHash(block.timestamp, lockTime) != timeHash,
            "It is too early to get your refund"
        );
        token.transfer(owner, amount);
    }

    function calculateTimeHash(uint256 _now, uint256 framesize)
        internal
        pure
        returns (bytes32)
    {
        // time hash stay the same in a period of time
        uint256 end = _now + framesize;
        uint256 frame = end - (end % (framesize * 2));
        return keccak256(abi.encodePacked(Strings.toString(frame)));
    }
}
