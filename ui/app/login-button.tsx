"use client"
import { useContext } from "react";
import { WalletContext } from "~/wallet-context";
import Image from "next/image";
import Loading from "~/loading";
import { client } from "~/query-client";

interface LoginButtonProps {
  isAuthenticated: boolean
  setIsAuthenticated: (isAuthenticated: boolean) => void
}

function getButtonClass() {
  return "inline-flex items-center rounded-full border-solid border-2 border-gray-700 dark:border-white p-1 focus:outline-none disabled:opacity-50"
}

function redirectToMetamask() {
  window.open("https://metamask.io/download.html", "_blank")
}

export default function LoginButton(props: LoginButtonProps) {
  const {
    profile,
    hasMetamask,
    isConnected,
    isSigned,
    isInit,
    connectWallet,
    signAuthMessage
  } = useContext(WalletContext)
  const { isAuthenticated, setIsAuthenticated } = props

  const { isLoading: isLoggingIn, mutate: login } = client.auth.login.useMutation({
    onSuccess: () => {
      setIsAuthenticated(true)
    },
    onError: (error) => {
      if (error.status === 401) {
        document.cookie = document.cookie.replace(/AUTH_TOKEN=[^;]+/, "")
        setIsAuthenticated(false)
      }
    },
  })

  async function connectToMetamask(): Promise<void> {
    await connectWallet()
    await signAuthMessage()
  }

  function authenticate(): void {
    if (isSigned) {
      login({ body: { signature: profile.signature } })
    }
  }

  if (!isInit || isLoggingIn) {
    return <Loading/>
  }

  if (!hasMetamask) {
    return <button
      className={getButtonClass()} onClick={redirectToMetamask}>
      <Image src={"/metamask-logo.svg"} width={32} height={32} alt={"Logo"}/>
      <span className="text-gray-900 dark:text-white">Click here to install metamask</span>
    </button>
  }

  if (!isConnected) {
    return <button
      className={getButtonClass()} onClick={connectToMetamask}>
      <Image src={"/metamask-logo.svg"} width={32} height={32} alt={"Logo"}/>
      <span className="text-gray-900 dark:text-white">Connect with Metamask</span>
    </button>
  }

  if (!isSigned) {
    return <button
      className={getButtonClass()} onClick={connectToMetamask}>
      <Image src={"/metamask-logo.svg"} width={32} height={32} alt={"Logo"}/>
      <span className="text-gray-900 dark:text-white"> </span>
      <span className="text-gray-900 dark:text-white">Sign in with Metamask</span>
    </button>
  }

  return <button
    className={getButtonClass()}
    disabled={isAuthenticated} onClick={authenticate}>
    <Image src={"/metamask-logo.svg"} width={32} height={32} alt={"Logo"}/>
    <span className="text-gray-900 dark:text-white">Login with Metamask</span>
  </button>
}