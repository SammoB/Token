pragma solidity ^0.5.16;

contract PeeToken {
	//Name
	string public name = "Pee Token";
	//Symbol
	string public symbol = "PEE";
	string public standard = "Pee Token v1.0";
	uint256 public totalSupply;

	event Transfer(
		address indexed _from,
		address indexed _to,
		uint256 _value
	);

	// transfer event
	// approve
	event Approval(
		address indexed _owner,
		address indexed _spender,
		uint256 _value
	);

	mapping(address => uint256) public balanceOf;
	// allowance
	mapping(address => mapping(address => uint256)) public allowance;

	
	constructor(uint256 _initialSupply) public {
		balanceOf[msg.sender] = _initialSupply;
		totalSupply = _initialSupply;
		// allocate the initial supply
	}

	// Transfer
	
	function transfer(address _to, uint256 _value) public returns (bool success) {
		// Exception if account doesn't have enough
		require(balanceOf[msg.sender] >= _value, "Insufficient sender balance");
		// Transfer the balance
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;
		// Tansfer Event
		emit Transfer(msg.sender, _to, _value);
		// Return a boolean
		return true;
	}

	// Delegated Transfers
	// approve
	function approve (address _spender, uint256 _value) public returns (bool success) {
		// allowance
		allowance[msg.sender][_spender] = _value;

		// approve event
		emit Approval(msg.sender, _spender, _value);


		return true;
	}

	// transfer from
	function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {

		// Require _from has enough tokens
		require(_value <= balanceOf[_from]);
		// Require allowance is big enough
		require(_value <= allowance[_from][msg.sender]);
		// Change the balance
		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;
		// Update the allowance
		allowance[_from][msg.sender] -= _value;
		// Transfer event
		emit Transfer(_from, _to, _value);
		// return a boolean
		return true;

	}






}