"use client"
import { useContext, useState } from "react";
import { WalletContext } from "~/wallet-context";
import Loading from "~/loading";
import { client } from "~/query-client";
import { ClientInferResponseBody } from "@ts-rest/core";
import { api } from "@/contracts";

type UserInfoProps = {
  isAuthenticated: boolean
  setIsAuthenticated: (isAuthenticated: boolean) => void
}

export default function UserInfo(props: UserInfoProps) {
  const { profile } = useContext(WalletContext)
  const { isAuthenticated, setIsAuthenticated } = props
  const [errors, setErrors] = useState<ClientInferResponseBody<typeof api["user"]["getUser"], 401 | 404>["errors"]>([])

  const {
    fetchStatus: userFetchStatus,
    data: userResponse
  } = client.user.getUser.useQuery(["getUser"], {
    params: {
      signingAddress: profile.accountId
    }
  }, {
    onSuccess: () => {
      setErrors([])
    },
    staleTime: Infinity,
    enabled: isAuthenticated && profile.accountId.length > 0,
    onError: (error) => {
      if (error.status === 401) {
        setErrors(error.body.errors)
        handleAuthenticationErrorResponse()
      }
      if (error.status === 404) {
        setErrors(error.body.errors)
      }
    },
    retry: (failureCount, error) => {
      if (error.status === 401) {
        return false
      }
      return failureCount < 3
    }
  })

  function handleAuthenticationErrorResponse() {
    document.cookie = document.cookie.replace(/AUTH_TOKEN=[^;]+/, "")
    setIsAuthenticated(false)
  }

  if (userFetchStatus === "fetching") {
    return <Loading/>
  }

  if (userResponse) {
    return <div
      className="flex flex-col p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <h5
        className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Signing
        address: {userResponse.body.signingAddress}</h5>
    </div>
  }

  if (errors.length > 0) {
    return <div
      className="flex flex-col p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <h5
        className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white self-center">
        <span>&#9888;</span> Error{errors.length > 1 ? "s" : ""}</h5>
      <p
        className="mb-3 font-normal text-gray-700 dark:text-gray-400 self-center">{errors.map(error => error.message)}</p>
    </div>

  }

  return null
}