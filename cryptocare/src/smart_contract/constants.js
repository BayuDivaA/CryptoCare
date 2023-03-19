import compileFactory from "./CryptoCareFactory.json";
import compileCampaign from "./Campaign.json";
import { Contract } from "@ethersproject/contracts";

// third : 0x7077EF00e6F06870c69b017653287CdD534f86E7
// forth : 0xF206efD767eFC93E80af63631F56470EaA94BD9f
// fifth : 0x77B8a173992C1504db4D2662121c9071BbfDC171
// sixth : 0xEf09f9D9CC98052f3986177394e2D1b303783413
//seventh: 0xED9296c5E21D2392BF99678296f728B569749068
// ninth : 0xd9a80779E099EACD40184eFF6BeD82cBe04c35eB
// tenth : 0xe110b6514Eea9c76b8Aa6b6Ab171c0b95284e894

// CryptoCare SmartContract
export const contractAddress = "0xe110b6514Eea9c76b8Aa6b6Ab171c0b95284e894";
export const contractABI = compileFactory.abi;
export const contractBytecode = compileFactory.bytecode;

export const myContract = new Contract(contractAddress, contractABI);

// CAMPAIGN SMART CONTRACT
export const contractABICampaign = compileCampaign.abi;
export const contractBytecodeCampaign = compileCampaign.bytecode;
