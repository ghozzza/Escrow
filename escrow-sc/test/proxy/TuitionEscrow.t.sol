// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {TuitionEscrow} from "../../src/proxy/TuitionEscrow.sol";
import {TuitionEscrowFactory} from "../../src/proxy/TuitionEscrowFactory.sol";
import {ERC1967Proxy} from "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {MockUSDC} from "../../src/mocks/MockUSDC.sol";

contract TuitionEscrowTest is Test {
    TuitionEscrow tuitionEscrow;
    TuitionEscrowFactory tuitionEscrowFactory;
    MockUSDC usdc;

    address public university = makeAddr("university");
    address public payer = makeAddr("payer");
    string public invoiceRef = "1234567890";

    function setUp() public {
        usdc = new MockUSDC();

        address tuitionEscrowFactoryV1 = address(new TuitionEscrowFactory());
        address proxy = address(new ERC1967Proxy(tuitionEscrowFactoryV1, abi.encodeWithSignature("initialize(address)")));

        tuitionEscrowFactory = TuitionEscrowFactory(proxy);

        vm.startPrank(payer);
        tuitionEscrowFactory.createEscrow(university, invoiceRef, address(usdc));
        vm.stopPrank();
        
        (address escrowAddress, , , , ) = tuitionEscrowFactory.escrows(0);
        tuitionEscrow = TuitionEscrow(escrowAddress);
    }
}
