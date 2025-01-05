// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(address _from, address _to, uint256 _id) external;
}

contract Escrow {
    address public nftAddress;
    uint256 public nftID;
    uint256 public purchasePrice;
    uint256 public escrowAmount;
    address payable public seller;
    address payable public buyer;
    address public inspector;
    address public lender;

    modifier onlyBuyer() {
        require(msg.sender == buyer, 'Only buyer can call this function');
        _; //return the function body
    }

    modifier onlyInspector() {
        require(msg.sender == inspector, 'Only inspector can call this function');
        _;
    }

    bool public inspectionPassed = false;

    mapping(address => bool) public approval;

    receive() external payable {}
    //this has to be included in the contract to be able to receive money

    constructor(
        address _nftAddress, 
        uint256 _nftID, 
        uint256 _purchasePrice,
        uint256 _escrowAmount,
        address payable _seller, 
        address payable _buyer,
        address _inspector,
        address _lender) {

        nftAddress = _nftAddress;
        nftID = _nftID;
        purchasePrice = _purchasePrice;
        escrowAmount = _escrowAmount;
        seller = _seller;
        buyer = _buyer;
        inspector = _inspector;
        lender = _lender;
    }

    //transfer property ownership
    function finalizeSale() public {
        require(inspectionPassed, 'must pass inspection');
        require(approval[buyer], 'Require approval from buyer');
        require(approval[seller], 'Require approval from seller');
        require(approval[lender], 'Require approval from lender');
        require(address(this).balance >= purchasePrice, 'must have enough ether for sale');
        
        (bool success, ) = payable(seller).call{value: address(this).balance}("");
        require(success);
        
        //transfer ownership of property
        IERC721(nftAddress).transferFrom(seller, buyer, nftID);

    }

    function approveSale() public {
        approval[msg.sender] = true;
    }

    function depositEarnest() public payable onlyBuyer {
        require(msg.value >= escrowAmount);
        //msg.value
    }

    function updateInspectionStatus(bool _passed) public onlyInspector {
        inspectionPassed = _passed;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}