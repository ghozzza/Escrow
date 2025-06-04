// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MockUSDC} from "../src/mocks/MockUSDC.sol";
import {TuitionEscrow} from "../src/proxy/TuitionEscrow.sol";
import {TuitionEscrowFactory} from "../src/proxy/TuitionEscrowFactory.sol";
import {ProxyAdmin} from "openzeppelin-contracts/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy} from
    "openzeppelin-contracts/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract ExamTuitionEscrowScript is Script {
    TuitionEscrowFactory public tuitionEscrowFactory;
    TuitionEscrow public tuitionEscrow;
    MockUSDC public mockUSDC;
    ProxyAdmin public proxyAdmin;
    TransparentUpgradeableProxy public proxy;

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("arb_sepolia"));
    }

    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address ownerAddress = vm.envAddress("ADDRESS");
        vm.startBroadcast(privateKey);

        mockUSDC = new MockUSDC();
        tuitionEscrowFactory = new TuitionEscrowFactory();
        proxyAdmin = new ProxyAdmin(ownerAddress);
        proxy = new TransparentUpgradeableProxy(
            address(tuitionEscrowFactory),
            address(proxyAdmin),
            abi.encodeWithSelector(TuitionEscrowFactory.initialize.selector, ownerAddress)
        );

        tuitionEscrow = new TuitionEscrow();
        vm.stopBroadcast();

        console.log("export const usdcAddress = ", address(mockUSDC));
        console.log("export const tuitionEscrowFactoryAddress = ", address(proxy));
        console.log("export const tuitionEscrowAddress = ", address(tuitionEscrow));
    }
}
