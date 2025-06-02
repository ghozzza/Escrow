// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

interface ITuitionEscrowFactory {
    function owner() external view returns (address);
}

contract TuitionEscrow is ReentrancyGuard {
    using SafeERC20 for IERC20;

    error NotFactoryOwner();
    error InvalidAmount();

    address public payer;
    address public university;
    address public tokenPaymentAddress;
    address public escrowFactoryAddress;
    string public invoiceRef;

    uint256 public amount;

    event Deposit(address indexed payer, uint256 amount);
    event Release(address indexed university, uint256 amount);
    event Refund(address indexed payer, uint256 amount);

    constructor(
        address _payer,
        address _university,
        address _tokenPaymentAddress,
        address _escrowFactoryAddress,
        string memory _invoiceRef
    ) {
        payer = _payer;
        university = _university;
        tokenPaymentAddress = _tokenPaymentAddress;
        escrowFactoryAddress = _escrowFactoryAddress;
        invoiceRef = _invoiceRef;
    }

    function deposit(uint256 _amount) public nonReentrant {
        if(_amount == 0) revert InvalidAmount();
        IERC20(tokenPaymentAddress).safeTransferFrom(payer, address(this), _amount);
        amount += _amount;
        emit Deposit(payer, _amount);
    }

    function release() public nonReentrant {
        if(msg.sender != ITuitionEscrowFactory(escrowFactoryAddress).owner()) revert NotFactoryOwner();
        if(amount == 0) revert InvalidAmount();
        IERC20(tokenPaymentAddress).safeTransfer(university, amount);
        emit Release(university, amount);
    }

    function refund() public nonReentrant {
        if(msg.sender != ITuitionEscrowFactory(escrowFactoryAddress).owner()) revert NotFactoryOwner();
        if(amount == 0) revert InvalidAmount();
        IERC20(tokenPaymentAddress).safeTransfer(payer, amount);
        emit Refund(payer, amount);
    }
}
