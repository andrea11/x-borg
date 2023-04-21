import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import WalletProvider, { WalletContext } from "./wallet-context";
import Web3 from "web3";

const mockGetAccounts: jest.MockedFn<() => string[]> = jest.fn()
const mockRequestAccounts: jest.MockedFn<() => string[]> = jest.fn()

jest.mock("web3", () => {
  return jest.fn().mockImplementation(() => {
    return {
      utils: {
        sha3: jest.fn().mockImplementation((message: string) => `hashed_message=${message}`)
      },
      eth: {
        getAccounts: jest.fn().mockImplementation(() => mockGetAccounts()),
        requestAccounts: jest.fn().mockImplementation(() => mockRequestAccounts()),
        personal: {
          sign: jest.fn().mockImplementation((hash: string, accountId: string, password: string) => `signature=${hash}+${accountId}+${password}`)
        }
      }
    }
  })
});

describe("WalletProvider", () => {
  const TestComponent = () => {
    const { hasMetamask, isConnected, isSigned, connectWallet } = React.useContext(WalletContext);
    return (
      <>
        <div data-testid="hasMetamask">{hasMetamask.toString()}</div>
        <div data-testid="isConnected">{isConnected.toString()}</div>
        <div data-testid="isSigned">{isSigned.toString()}</div>
        <button data-testid="connect" onClick={connectWallet}>connect</button>
      </>
    );
  };

  it("renders without crashing", () => {
    render(
      <WalletProvider>
        <TestComponent/>
      </WalletProvider>
    );
    expect(screen.getByTestId("hasMetamask")).toBeInTheDocument();
    expect(screen.getByTestId("isConnected")).toBeInTheDocument();
    expect(screen.getByTestId("isSigned")).toBeInTheDocument();
  });

  it("sets hasMetamask to true if MetaMask is installed", async () => {
    // Set up the environment
    window.Web3 = {
      givenProvider: {},
    };

    // Render the component
    render(
      <WalletProvider>
        <TestComponent/>
      </WalletProvider>
    );

    // Expectation
    await waitFor(() => {
      expect(screen.getByTestId("hasMetamask")).toHaveTextContent("true");
    })
  });
})
