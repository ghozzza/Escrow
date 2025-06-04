// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ReentrancyGuardUpgradeable} from
    "openzeppelin-contracts-upgradeable/contracts/utils/ReentrancyGuardUpgradeable.sol";
import {Initializable} from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

/// @title TuitionEscrowFactory Interface
/// @notice Interface for the factory contract that creates tuition escrow instances
interface ITuitionEscrowFactory {
    function owner() external view returns (address);
}

/// @title TuitionEscrow
/// @notice A contract that manages escrow for tuition payments between students and universities
/// @dev This contract is upgradeable and uses OpenZeppelin's ReentrancyGuard for security
contract TuitionEscrow is Initializable, ReentrancyGuardUpgradeable {
    using SafeERC20 for IERC20;

    error NotFactoryOwner();
    error InvalidAmount();
    error ZeroAddress();
    error ZeroBalance();
    error NotPayer();

    /// @notice Emitted when a payment is deposited into the escrow
    /// @param payer The address of the student making the payment
    /// @param amount The amount of tokens deposited
    event Deposited(address indexed payer, uint256 amount);

    /// @notice Emitted when funds are released to the university
    /// @param university The address of the university receiving the payment
    /// @param amount The amount of tokens released
    event Released(address indexed university, uint256 amount);

    /// @notice Emitted when funds are refunded to the student
    /// @param payer The address of the student receiving the refund
    /// @param amount The amount of tokens refunded
    event Refunded(address indexed payer, uint256 amount);

    /// @notice The address of the student making the payment
    address public payer;
    
    /// @notice The address of the university receiving the payment
    address public university;
    
    /// @notice The address of the ERC20 token used for payment
    address public tokenPaymentAddress;
    
    /// @notice The address of the factory contract that created this escrow
    address public escrowFactoryAddress;
    
    /// @notice Reference number for the tuition invoice
    string public invoiceRef;

    /// @notice The total amount of tokens held in escrow
    uint256 public amount;

    /// @notice The version of the contract
    uint256 public constant version = 1;

    /// @notice Constructor that disables initializers
    constructor() {
        _disableInitializers();
    }

    /// @notice Initializes the escrow contract with the required parameters
    /// @param _payer The address of the student
    /// @param _university The address of the university
    /// @param _tokenPaymentAddress The address of the payment token
    /// @param _escrowFactoryAddress The address of the factory contract
    /// @param _invoiceRef The reference number for the tuition invoice
    function initialize(
        address _payer,
        address _university,
        address _tokenPaymentAddress,
        address _escrowFactoryAddress,
        string memory _invoiceRef
    ) public initializer {
        if (_payer == address(0)) revert ZeroAddress();
        if (_university == address(0)) revert ZeroAddress();
        if (_tokenPaymentAddress == address(0)) revert ZeroAddress();
        if (_escrowFactoryAddress == address(0)) revert ZeroAddress();
        
        payer = _payer;
        university = _university;
        tokenPaymentAddress = _tokenPaymentAddress;
        escrowFactoryAddress = _escrowFactoryAddress;
        invoiceRef = _invoiceRef;
    }

    /// @notice Allows the student to deposit payment tokens into the escrow
    /// @param _amount The amount of tokens to deposit
    /// @dev Requires the student to have approved the contract to spend their tokens
    function deposit(uint256 _amount) public nonReentrant {
        if (msg.sender != payer) revert NotPayer();
        if (_amount == 0) revert InvalidAmount();
        IERC20(tokenPaymentAddress).safeTransferFrom(payer, address(this), _amount);
        amount += _amount;
        emit Deposited(payer, _amount);
    }

    /// @notice Allows the factory owner to release funds to the university
    /// @dev Only callable by the factory owner
    function release() public nonReentrant {
        if (msg.sender != ITuitionEscrowFactory(escrowFactoryAddress).owner()) revert NotFactoryOwner();
        if (amount == 0) revert ZeroBalance();
        uint256 _amount = amount;
        amount = 0;
        IERC20(tokenPaymentAddress).safeTransfer(university, _amount);
        emit Released(university, amount);
    }

    /// @notice Allows the factory owner to refund funds to the student
    /// @dev Only callable by the factory owner
    function refund() public nonReentrant {
        if (msg.sender != ITuitionEscrowFactory(escrowFactoryAddress).owner()) revert NotFactoryOwner();
        if (amount == 0) revert ZeroBalance();
        uint256 _amount = amount;
        amount = 0;
        IERC20(tokenPaymentAddress).safeTransfer(payer, _amount);
        emit Refunded(payer, _amount);
    }

    /// @notice Returns the owner of the escrow factory
    /// @return The address of the factory owner
    function getOwner() public view returns (address) {
        return ITuitionEscrowFactory(escrowFactoryAddress).owner();
    }
}
