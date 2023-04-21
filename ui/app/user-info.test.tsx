import { render, screen } from "@testing-library/react";
import { WalletContext } from "~/wallet-context";
import UserInfo from "./user-info";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { client } from "~/query-client";

let mockHasMetamask: boolean
let mockIsConnected: boolean
let mockIsSigned: boolean
let mockIsInit: boolean

describe("UserInfo component", () => {
  beforeEach(() => {
    mockHasMetamask = false
    mockIsConnected = false
    mockIsSigned = false
    mockIsInit = false
  });

  it("renders loading spinner when user data is being fetched", () => {
    const setIsAuthenticated = jest.fn();
    render(
      <WalletContext.Provider value={{
        profile: {
          accountId: 'accountId',
          signature: 'signature',
        },
        hasMetamask: mockHasMetamask,
        isConnected: mockIsConnected,
        isSigned: mockIsSigned,
        isInit: mockIsInit,
        connectWallet: jest.fn(),
        signAuthMessage: jest.fn(),
      }}>
        <QueryClientProvider client={new QueryClient()}>
        <UserInfo isAuthenticated={true} setIsAuthenticated={setIsAuthenticated}/>
        </QueryClientProvider>
      </WalletContext.Provider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders user info when user data is fetched successfully", () => {
    const userResponse = { body: { signingAddress: "test-signing-address" } };
    const setIsAuthenticated = jest.fn();
    const useQueryMock = jest.fn().mockReturnValue({
      fetchStatus: "success",
      data: userResponse,
    });

    jest.spyOn(client.user.getUser, "useQuery").mockImplementation(useQueryMock);

    render(
      <WalletContext.Provider value={{
        profile: {
          accountId: 'accountId',
          signature: 'signature',
        },
        hasMetamask: mockHasMetamask,
        isConnected: mockIsConnected,
        isSigned: mockIsSigned,
        isInit: mockIsInit,
        connectWallet: jest.fn(),
        signAuthMessage: jest.fn(),
      }}>
        <UserInfo isAuthenticated={true} setIsAuthenticated={setIsAuthenticated}/>
      </WalletContext.Provider>
    );

    expect(useQueryMock).toHaveBeenCalledWith(
      ["getUser"],
      { params: { signingAddress: "accountId" } },
      expect.objectContaining({ enabled: true })
    );
    expect(screen.getByText(`Signing address: ${userResponse.body.signingAddress}`)).toBeInTheDocument();
  });
});
