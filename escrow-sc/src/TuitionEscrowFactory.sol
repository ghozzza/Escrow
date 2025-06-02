// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract TuitionEscrowFactory {
    error NotOwner();

    struct EscrowDetails {
        address payer;
        address university;
        address escrowAddress;
        address tokenPaymentAddress;
        string invoiceRef;
    }

    address public owner;
    mapping(uint256 => EscrowDetails) public escrows;

    uint256 public escrowCount;

    constructor() {
        owner = msg.sender;
    }

    function initialize(address _university, string calldata _invoiceRef, address _tokenPaymentAddress) public {
        EscrowDetails memory escrow = EscrowDetails({
            payer: msg.sender,
            university: _university,
            escrowAddress: address(0), // deployment address when tuition escrow is created
            tokenPaymentAddress: _tokenPaymentAddress,
            invoiceRef: _invoiceRef
        });
        escrows[escrowCount] = escrow;
        escrowCount++;
    }

    /// @notice Transfers ownership of the contract to a new address. Only the contract owner can call this function.
    function transferOwnership(address _newOwner) public {
        if(msg.sender != owner) revert NotOwner();
        owner = _newOwner;
    }
}