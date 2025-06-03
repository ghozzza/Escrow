// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {TuitionEscrow} from "../src/proxy/TuitionEscrow.sol";
import {TuitionEscrowFactory} from "../src/proxy/TuitionEscrowFactory.sol";
import {ERC1967Proxy} from "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {ProxyAdmin} from "openzeppelin-contracts/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy} from
    "openzeppelin-contracts/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {MockUSDC} from "../src/mocks/MockUSDC.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract TuitionEscrowTest is Test {
    ProxyAdmin proxyAdmin;
    TuitionEscrow tuitionEscrow;
    TuitionEscrowFactory tuitionEscrowFactory;
    MockUSDC usdc;

    address public university = makeAddr("university");
    address public payer = makeAddr("payer");
    address public ownerAddress = makeAddr("ownerAddress");
    string public invoiceRef = "Student Loan";

    function setUp() public {
        vm.startPrank(ownerAddress);
        usdc = new MockUSDC();

        tuitionEscrowFactory = new TuitionEscrowFactory();
        proxyAdmin = new ProxyAdmin(ownerAddress);
        TransparentUpgradeableProxy proxy = new TransparentUpgradeableProxy(
            address(tuitionEscrowFactory),
            address(proxyAdmin),
            abi.encodeWithSelector(TuitionEscrowFactory.initialize.selector, ownerAddress)
        );

        tuitionEscrowFactory = TuitionEscrowFactory(address(proxy));
        vm.stopPrank();
    }

    function helper_createEscrow() public {
        vm.startPrank(payer);
        tuitionEscrowFactory.createEscrow(address(university), invoiceRef, address(usdc));
        vm.stopPrank();

        (,, address escrowAddress,,) = tuitionEscrowFactory.escrows(0);
        tuitionEscrow = TuitionEscrow(escrowAddress);
    }

    function helper_deposit() public {
        vm.startPrank(payer);
        usdc.mint(payer, 100e6);
        IERC20(address(usdc)).approve(address(tuitionEscrow), 100e6);
        tuitionEscrow.deposit(100e6);
        vm.stopPrank();
    }

    function test_createEscrow() public {
        helper_createEscrow();
        console.log("--------------------------------");
        console.log("Escrow Address:", address(tuitionEscrow));
        console.log("--------------------------------");

        assertEq(tuitionEscrow.payer(), payer);
        assertEq(tuitionEscrow.university(), university);
        assertEq(tuitionEscrow.tokenPaymentAddress(), address(usdc));
        assertEq(tuitionEscrow.invoiceRef(), invoiceRef);
    }

    function test_deposit() public {
        helper_createEscrow();

        vm.startPrank(payer);
        usdc.mint(payer, 100e6);
        IERC20(address(usdc)).approve(address(tuitionEscrow), 100e6);
        tuitionEscrow.deposit(100e6);
        vm.stopPrank();
    }

    function test_deposit_revert_invalidAmount() public {
        helper_createEscrow();
        vm.startPrank(payer);
        vm.expectRevert(TuitionEscrow.InvalidAmount.selector);
        tuitionEscrow.deposit(0);
        vm.stopPrank();
    }

    function test_release() public {
        helper_createEscrow();
        helper_deposit();

        vm.startPrank(ownerAddress);
        tuitionEscrow.release();
        vm.stopPrank();

        assertEq(IERC20(address(usdc)).balanceOf(address(tuitionEscrow)), 0);
        assertEq(IERC20(address(usdc)).balanceOf(address(university)), 100e6);
    }

    function test_release_revert_notFactoryOwner() public {
        helper_createEscrow();
        helper_deposit();

        vm.startPrank(payer);
        vm.expectRevert(TuitionEscrow.NotFactoryOwner.selector);
        tuitionEscrow.release();
        vm.stopPrank();
    }

    function test_release_revert_zeroBalance() public {
        helper_createEscrow();

        vm.startPrank(ownerAddress);
        vm.expectRevert(TuitionEscrow.ZeroBalance.selector);
        tuitionEscrow.release();
        vm.stopPrank();
    }
    function test_refund() public {
        helper_createEscrow();
        helper_deposit();

        vm.startPrank(ownerAddress);
        tuitionEscrow.refund();
        vm.stopPrank();

        assertEq(IERC20(address(usdc)).balanceOf(address(payer)), 100e6);
        assertEq(IERC20(address(usdc)).balanceOf(address(tuitionEscrow)), 0);
    }

    function test_refund_revert_notFactoryOwner() public {
        helper_createEscrow();
        helper_deposit();

        vm.startPrank(payer);
        vm.expectRevert(TuitionEscrow.NotFactoryOwner.selector);
        tuitionEscrow.refund();
    }

    function test_refund_revert_zeroBalance() public {
        helper_createEscrow();

        vm.startPrank(ownerAddress);
        vm.expectRevert(TuitionEscrow.ZeroBalance.selector);
        tuitionEscrow.refund();
        vm.stopPrank();
    }
}
