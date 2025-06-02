// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ReentrancyGuardUpgradeable} from
    "openzeppelin-contracts-upgradeable/contracts/utils/ReentrancyGuardUpgradeable.sol";
import {Initializable} from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

interface ITuitionEscrowFactory {
    function owner() external view returns (address);
}

contract TuitionEscrow is Initializable, ReentrancyGuardUpgradeable {
    using SafeERC20 for IERC20;

    error NotFactoryOwner();
    error InvalidAmount();

    event Deposit(address indexed payer, uint256 amount);
    event Release(address indexed university, uint256 amount);
    event Refund(address indexed payer, uint256 amount);

    address public payer;
    address public university;
    address public tokenPaymentAddress;
    address public escrowFactoryAddress;
    string public invoiceRef;

    uint256 public amount;

    uint256 public constant version = 1;

    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _payer,
        address _university,
        address _tokenPaymentAddress,
        address _escrowFactoryAddress,
        string memory _invoiceRef
    ) public initializer {
        payer = _payer;
        university = _university;
        tokenPaymentAddress = _tokenPaymentAddress;
        escrowFactoryAddress = _escrowFactoryAddress;
        invoiceRef = _invoiceRef;
    }

    function deposit(uint256 _amount) public nonReentrant {
        if (_amount == 0) revert InvalidAmount();
        IERC20(tokenPaymentAddress).safeTransferFrom(payer, address(this), _amount);
        amount += _amount;
        emit Deposit(payer, _amount);
    }

    function release() public nonReentrant {
        if (msg.sender != ITuitionEscrowFactory(escrowFactoryAddress).owner()) revert NotFactoryOwner();
        if (amount == 0) revert InvalidAmount();
        IERC20(tokenPaymentAddress).safeTransfer(university, amount);
        emit Release(university, amount);
    }

    function refund() public nonReentrant {
        if (msg.sender != ITuitionEscrowFactory(escrowFactoryAddress).owner()) revert NotFactoryOwner();
        if (amount == 0) revert InvalidAmount();
        IERC20(tokenPaymentAddress).safeTransfer(payer, amount);
        emit Refund(payer, amount);
    }
}
