// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Initializable} from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import {TuitionEscrow} from "./TuitionEscrow.sol";
import {ProxyAdmin} from "openzeppelin-contracts/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy} from
    "openzeppelin-contracts/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

/// @title TuitionEscrowFactory
/// @notice Factory contract for creating and managing tuition escrow contracts
/// @dev Uses transparent proxy pattern for upgradeable escrow contracts
contract TuitionEscrowFactory is Initializable {
    /// @notice Thrown when caller is not the owner
    error NotOwner();
    /// @notice Thrown when a zero address is provided where not allowed
    error ZeroAddress();

    /// @notice Structure to store escrow contract details
    /// @param payer Address of the payer (student/parent)
    /// @param university Address of the university
    /// @param tuitionEscrowAddress Address of the deployed escrow contract
    /// @param tokenPaymentAddress Address of the token used for payment
    /// @param invoiceRef Reference number for the invoice
    struct EscrowDetails {
        address payer;
        address university;
        address tuitionEscrowAddress;
        address tokenPaymentAddress;
        string invoiceRef;
    }

    /// @notice Address of the contract owner
    address public owner;

    /// @notice Mapping of escrow ID to escrow details
    mapping(uint256 => EscrowDetails) public escrows;

    /// @notice Counter for total number of escrows created
    uint256 public escrowCount;

    /// @notice Version of the contract
    uint256 public constant version = 1;

    /// @notice Event emitted when a new escrow is created
    event EscrowCreated(
        address indexed escrowAddress,
        address indexed university,
        string invoiceRef,
        address tokenPaymentAddress,
        address payer,
        address tuitionEscrowImplementation
    );

    /// @notice Event emitted when the ownership is transferred
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /// @notice Constructor that disables initializers
    constructor() {
        _disableInitializers();
    }

    /// @notice Initializes the contract with the owner address
    /// @param _owner Address of the contract owner
    function initialize(address _owner) public initializer {
        owner = _owner;
    }

    /// @notice Creates a new tuition escrow contract
    /// @dev Deploys a new TuitionEscrow contract behind a transparent proxy
    /// @param _university Address of the university
    /// @param _invoiceRef Reference number for the invoice
    /// @param _tokenPaymentAddress Address of the token used for payment
    function createEscrow(address _university, string calldata _invoiceRef, address _tokenPaymentAddress) public {
        if (_university == address(0)) revert ZeroAddress();
        if (_tokenPaymentAddress == address(0)) revert ZeroAddress();

        TuitionEscrow tuitionEscrowImplementation = new TuitionEscrow();
        TransparentUpgradeableProxy proxy = new TransparentUpgradeableProxy(
            address(tuitionEscrowImplementation),
            msg.sender,
            abi.encodeWithSelector(
                TuitionEscrow.initialize.selector,
                msg.sender,
                _university,
                _tokenPaymentAddress,
                address(this),
                _invoiceRef
            )
        );

        EscrowDetails memory escrowDetails = EscrowDetails({
            payer: msg.sender,
            university: _university,
            tuitionEscrowAddress: address(proxy),
            tokenPaymentAddress: _tokenPaymentAddress,
            invoiceRef: _invoiceRef
        });
        escrows[escrowCount] = escrowDetails;
        escrowCount++;

        emit EscrowCreated(
            address(proxy),
            _university,
            _invoiceRef,
            _tokenPaymentAddress,
            msg.sender,
            address(tuitionEscrowImplementation)
        );
    }

    /// @notice Transfers ownership of the contract to a new address
    /// @param _newOwner Address of the new owner
    function transferOwnership(address _newOwner) public {
        if (msg.sender != owner) revert NotOwner();
        if (_newOwner == address(0)) revert ZeroAddress();
        owner = _newOwner;

        emit OwnershipTransferred(msg.sender, _newOwner);
    }
}
