import axios from "axios";

const lhApi = "https://api.lighthouse.storage";

import lighthouse from "@lighthouse-web3/sdk";
import { Wallet } from "ethers5";
import { ethers } from "ethers6";

// const wallet = new ethers.wallet();

// axios.get(`${lhApi}/api/auth/get_message?publicKey=`);

// privateKey = "0x911f631b78802ceca32c168ec2fbd2ab9e70ffd80247a222aaaff06c21ff1d24";
const wallet = ethers.Wallet.createRandom();

console.log("privateKey: " + wallet.privateKey);

// const { data } = await lighthouse.getAuthMessage(wallet.address);
// let { message } = data;
// console.log(data);
// console.log(`message: ${message}`);
// message = JSON.stringify(data);

const res = await axios.get(`${lhApi}/api/auth/get_message?publicKey=${wallet.address}`);
let message = res.data;

const signedMessage = await wallet.signMessage(message || "");
console.log(`signed message: ${signedMessage}`);

// const { data: apiKeyData } = await lighthouse.getApiKey(publicKey, signedMessage);
const { data: apiKeyData } = await lighthouse.getApiKey(wallet.address, signedMessage);
const apiKey = apiKeyData.apiKey;

// const res1 = await axios.post(`${lhApi}/api/auth/create_api_key`, {
// 	publicKey: publicKey,
// 	signedMessage: signedMessage
// });
// const apiKeyData = await res1.data;

console.log("apiKey: " + apiKey);
