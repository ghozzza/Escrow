// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Initializable} from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import {TuitionEscrow} from "./TuitionEscrow.sol";

contract TuitionEscrowFactory is Initializable {
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

    uint256 public constant version = 1;

    constructor() {
        _disableInitializers();
    }

    function initialize(address _owner) public initializer {
        owner = _owner;
    }

    function createEscrow(address _university, string calldata _invoiceRef, address _tokenPaymentAddress) public {
        TuitionEscrow tuitionEscrow = new TuitionEscrow();
        tuitionEscrow.initialize(msg.sender, _university, _tokenPaymentAddress, address(this), _invoiceRef);
        EscrowDetails memory escrowDetails = EscrowDetails({
            payer: msg.sender,
            university: _university,
            escrowAddress: address(tuitionEscrow),
            tokenPaymentAddress: _tokenPaymentAddress,
            invoiceRef: _invoiceRef
        });
        escrows[escrowCount] = escrowDetails;
        escrowCount++;
    }

    /// @notice Transfers ownership of the contract to a new address. Only the contract owner can call this function.
    function transferOwnership(address _newOwner) public {
        if(msg.sender != owner) revert NotOwner();
        owner = _newOwner;
    }
}