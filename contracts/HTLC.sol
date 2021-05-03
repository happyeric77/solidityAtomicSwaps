pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract HTLC {
    uint public startTime;
    uint public lockTime = 10000 seconds;
    // The Hash calc util tool: http://emn178.github.io/online-tools/keccak_256.html
    string public secret; // colorfulMyLife 
    bytes32 public hash = 0x6980c7da04154324dbf91e0c6f4d993a1db27786cdaf94cca88138aa640bbf9f;
    address public recipient;
    address public owner;
    uint public amount;
    IERC20 public token;
    
    constructor(address _recipient, address _token, uint _amount) {
        recipient = _recipient;
        owner = msg.sender;
        amount = _amount;
        token = IERC20(_token);
    }

    function fund() external {
        startTime = block.timestamp;
        token.transferFrom(msg.sender, address(this), amount);
    }

    function withdraw(string memory _secret) external {
        // TODO: Study keccak256 and abi package
        require(keccak256(abi.encodePacked(_secret)) == hash, "Wrong secret");
        secret = _secret;
        token.transfer(recipient, amount);
    }

    function refund() external {
        require(block.timestamp > startTime + lockTime, "Not reach the lock time");
        token.transfer(owner, amount);
    }
}