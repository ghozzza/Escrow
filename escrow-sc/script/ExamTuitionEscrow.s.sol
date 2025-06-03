// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MockUSDC} from "../src/mocks/MockUSDC.sol";
import {TuitionEscrow} from "../src/proxy/TuitionEscrow.sol";
import {TuitionEscrowFactory} from "../src/proxy/TuitionEscrowFactory.sol";

contract ExamTuitionEscrowScript is Script {
    TuitionEscrowFactory public tuitionEscrowFactory;
    TuitionEscrow public tuitionEscrow;
    MockUSDC public mockUSDC;

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("arb_sepolia"));
    }

    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        mockUSDC = new MockUSDC();
        tuitionEscrowFactory = new TuitionEscrowFactory();
        tuitionEscrow =
            new TuitionEscrow();
        vm.stopBroadcast();

        console.log("export const usdcAddress = ", address(mockUSDC));
        console.log("export const tuitionEscrowFactoryAddress = ", address(tuitionEscrowFactory));
        console.log("export const tuitionEscrowAddress = ", address(tuitionEscrow));
    }
}
