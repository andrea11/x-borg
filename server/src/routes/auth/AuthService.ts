import { env } from "@/env.mjs";
import Web3 from "web3";

const web3 = new Web3(env.INFURA_URL);
export const authService = {
  login: (signature: string): string | undefined => {
    const hash = web3.utils.sha3("Auth message")!

    try {
      return web3.eth.accounts.recover(hash, signature)
    } catch (e) {
      console.warn("Error validating the signature", e);
    }
  }
};