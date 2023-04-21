import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import LoginButton from './login-button';
import { client } from '~/query-client';
import { WalletContext } from '~/wallet-context';

let mockHasMetamask: boolean
let mockIsConnected: boolean
let mockIsSigned: boolean
let mockIsInit: boolean

jest.mock('~/query-client', () => ({
  client: {
    auth: {
      login: {
        useMutation: jest.fn().mockReturnValue({
          isLoading: false,
          mutate: jest.fn(),
        }),
      },
    },
  },
}));

describe('LoginButton', () => {
  const setIsAuthenticatedMock = jest.fn();

  beforeEach(() => {
    setIsAuthenticatedMock.mockClear();
    mockHasMetamask = false
    mockIsConnected = false
    mockIsSigned = false
    mockIsInit = false
  });

  const renderComponent = (isAuthenticated: boolean) => {
    return render(
      <WalletContext.Provider
        value={{
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
        }}
      >
        <LoginButton
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticatedMock}
        />
      </WalletContext.Provider>
    );
  };

  it('should render loading component if not initialized or logging in', () => {
    const { getByText } = renderComponent(false);
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('should render install metamask button if metamask is not installed', () => {
    mockIsInit = true
    const { getByText } = renderComponent(false);
    expect(getByText('Click here to install metamask')).toBeInTheDocument();
  });

  it('should render connect to metamask button if metamask is installed but not connected', () => {
    mockIsInit = true
    mockHasMetamask = true
    const { getByText } = renderComponent(false);
    expect(getByText('Connect with Metamask')).toBeInTheDocument();
  });

  it('should render sign in with metamask button if metamask is connected but not signed in', () => {
    mockIsInit = true
    mockHasMetamask = true
    mockIsConnected = true
    const { getByText } = renderComponent(false);
    expect(getByText('Sign in with Metamask')).toBeInTheDocument();
  });

  it('should render login with metamask button if metamask is connected and signed in', () => {
    mockIsInit = true
    mockHasMetamask = true
    mockIsConnected = true
    mockIsSigned = true
    const { getByText } = renderComponent(false);
    expect(getByText('Login with Metamask')).toBeInTheDocument();
  });

  it('should call signAuthMessage when sign in metamask button is clicked', () => {
    mockIsInit = true
    mockHasMetamask = true
    mockIsConnected = true
    const { getByText } = renderComponent(false);
    const button = getByText('Sign in with Metamask');
    jest.spyOn(client.auth.login, 'useMutation').mockReturnValue({
      isLoading: false,
      mutate: jest.fn(),
      isIdle: true,
      isSuccess: false,
      reset: jest.fn(),
      isPaused: false,
      isError: false,
      failureCount: 0,
      status: 'idle',
      error: null,
      variables: {
        body: {
          signature: "signature"
        }
      },
      context: {},
      mutateAsync: jest.fn(),
      data: undefined,
      failureReason: null,
    });
    act(() => {
      fireEvent.click(button);
    });
    expect(client.auth.login.useMutation).toHaveBeenCalled();
  });

  it('should set authenticated to true when login is successful', async () => {
    mockIsInit = true
    mockHasMetamask = true
    mockIsConnected = true
    mockIsSigned = true
    const mockMutate = jest.fn()
    jest.spyOn(client.auth.login, 'useMutation').mockImplementation((args) => {
      return {
        isLoading: false,
        mutate: mockMutate.mockImplementation(() => {
          args?.onSuccess?.({ body: {}, status: 200 }, { body: { signature: "signature" } }, undefined)
        }),
        isIdle: true,
        isSuccess: false,
        reset: jest.fn(),
        isPaused: false,
        isError: false,
        failureCount: 0,
        status: 'idle',
        error: null,
        variables: {
          body: {
            signature: "signature"
          }
        },
        context: {},
        mutateAsync: jest.fn(),
        data: undefined,
        failureReason: null,
      }
    });

    const { getByText } = renderComponent(false);
    const button = getByText('Login with Metamask');
    act(() => {
      fireEvent.click(button);
    })

    expect(client.auth.login.useMutation).toHaveBeenCalled();
    expect(mockMutate).toHaveBeenCalledWith({ body: { signature: "signature" } });
    await waitFor(() => {
      expect(setIsAuthenticatedMock).toHaveBeenCalledWith(true);
    })
  })
})