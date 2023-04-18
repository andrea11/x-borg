"use client"
import React, { createContext, useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import type { MetaMaskInpageProvider } from "@metamask/providers";
import { provider } from "web3-core";

interface Context {
  readonly connectWallet: () => Promise<void>;
  readonly hasMetamask: boolean;
  readonly isConnected: boolean;
  readonly isSigned: boolean;
  readonly isInit: boolean;
  readonly profile: {
    accountId: string;
    signature: string;
  };
  readonly signAuthMessage: () => Promise<string>;
}

export const WalletContext = createContext<Context>({
  connectWallet: () => Promise.resolve(),
  signAuthMessage: () => Promise.resolve(""),
  isInit: false,
  hasMetamask: false,
  isConnected: false,
  isSigned: false,
  profile: {
    accountId: "",
    signature: ""
  }
});

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isInit, setIsInit] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [profile, setProfile] = useState({
    accountId: "",
    signature: ""
  });
  const [web3, setWeb3] = useState<Web3>();

  function checkMetamaskExists() {
    if (!Web3.givenProvider) {
      console.error("Please Install MetaMask.");
      setIsInit(true)
      setHasMetamask(false)
      return false;
    }
    setHasMetamask(true)
    return true;
  }

  const getConnectedAccount = async (): Promise<void> => {
    try {
      const accountId = (await web3?.eth.getAccounts())?.[0]
      if (!accountId) {
        console.error("Please connect to MetaMask.");
        return
      }
      console.log(accountId);
      setProfile({ ...profile, accountId })
    } catch (err) {
      console.error(err);
    } finally {
      setIsInit(true)
    }
  }

  async function connect(): Promise<void> {
    try {
      const accountId = (await web3?.eth.requestAccounts())?.[0]
      if (!accountId) {
        console.error("Please connect to MetaMask.");
        return
      }
      console.log("accountId", accountId);
      setIsConnected(true);
      setProfile({ ...profile, accountId })
    } catch (err) {
      console.error(err);
    } finally {
      setIsInit(true)
    }
  }

  const sign = async (message: string) => {
    if (!hasMetamask || !isConnected) {
      console.log("Please connect to MetaMask.", { hasMetamask, isConnected });
      return ""
    }

    const hash = web3!.utils.sha3(message)
    if (!hash) {
      console.error("Hash is undefined")
      return ""
    }
    try {
      const signature = await web3!.eth.personal.sign(hash, profile.accountId, "")
      setProfile({ ...profile, signature })
    } catch (e) {
      console.error(e)
      return ""
    }
    return profile.signature
  }

  const signAuthMessage = useCallback(() => sign("Auth message"), [web3, hasMetamask, isConnected])

  const connectWallet = useCallback(connect, [web3])

  useEffect(() => {
    (web3?.givenProvider as MetaMaskInpageProvider)?.on("accountsChanged", getConnectedAccount);
    return () => {
      (web3?.currentProvider as MetaMaskInpageProvider)?.removeListener("accountsChanged", getConnectedAccount);
    };
  }, [web3]);

  useEffect(() => {
    void connect()
  }, [web3])

  useEffect(() => {
    if (checkMetamaskExists()) {
      setWeb3(new Web3(Web3.givenProvider as provider))
    }
  }, [])

  useEffect(() => {
    setIsSigned(profile.signature.length > 0)
  }, [profile.signature])

  useEffect(() => {
    const authToken = document.cookie.match(/AUTH_TOKEN=([^;]+)/)?.[1]
    if (authToken) {
      setProfile({ ...profile, signature: authToken })
      return
    }
  }, [])

  return (
    <WalletContext.Provider
      value={{
        hasMetamask,
        isConnected,
        isSigned,
        connectWallet,
        signAuthMessage,
        profile,
        isInit
      }}>
      {children}
    </WalletContext.Provider>
  )
}