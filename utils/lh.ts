import axios from "axios";

import Wallet1 from "ethereumjs-wallet";

const lhApi = "https://api.lighthouse.storage";

import lighthouse from "@lighthouse-web3/sdk";
import { Wallet } from "ethers5";
import { ethers } from "ethers6";

// const wallet = new ethers.wallet();

// axios.get(`${lhApi}/api/auth/get_message?publicKey=`);

const genWallet = Wallet1.generate();

let privateKey = genWallet.getPrivateKeyString();

let publicKey = genWallet.getPublicKeyString();

const address = genWallet.getAddressString();

console.log(`privateKey: ${privateKey}, publicKey: ${publicKey}`);
console.log(`address: ${address}`);

// privateKey = "0x911f631b78802ceca32c168ec2fbd2ab9e70ffd80247a222aaaff06c21ff1d24";
const provider = new ethers.JsonRpcProvider("https://rpc.ftm.tools");
const wallet = new ethers.Wallet(privateKey, provider);

const { data } = await lighthouse.getAuthMessage(address);
let { message } = data;
console.log(data);
console.log(`message: ${message}`);
message = JSON.stringify(data);

const signedMessage = await wallet.signMessage(message || "");
console.log(`signed message: ${signedMessage}`);

// const { data: apiKeyData } = await lighthouse.getApiKey(publicKey, signedMessage);
const { data: apiKeyData } = await lighthouse.getApiKey(publicKey, signedMessage);
const apiKey = apiKeyData.apiKey;

console.log("apiKey: " + apiKey);
