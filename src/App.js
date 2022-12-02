import './App.css';
import { useEffect, useState } from 'react';
// import Web3 from 'web3';
import { io, Socket } from 'socket.io-client';
// import AuthClient from "@walletconnect/auth-client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from 'web3';

const ethereum = window.ethereum;

function App() {
  const [wallets, setWallets] = useState(null);
  const [provider, setProvider] = useState(null);
  const [socket, setSocket] = useState(null);
  const [minted, setMinted] = useState(false);
  // const [wallectConnectClient, setWalletConnectClient] = useState(null);

  const connectMetamask = async () => {
    const p = ethereum.providers?.find(e => e.isMetaMask) ?? ethereum;
    connect(p);
    localStorage.setItem('mounir&sohaib_provider', 'metamask');
  }

  const connectTrust = async () => {
    const p = ethereum.providers?.find(e => e.isTrustWallet);
    connect(p);
    localStorage.setItem('mounir&sohaib_provider', 'trust');
  }

  const connectCoinbase = async () => {
    const p = ethereum.providers?.find(e => e.isCoinbaseWallet);
    connect(p);
    localStorage.setItem('mounir&sohaib_provider', 'coinbase');
  }

  const connectWalletConnect = async () => {
    const p = new WalletConnectProvider({
      bridge: 'https://bridge.walletconnect.org',
      qrcodeModal: QRCodeModal,
      rpc: {
        '137': 'https://rpc.ankr.com/eth',
      },
    });
    connect(p);
    localStorage.setItem('mounir&sohaib_provider', 'walletconnect');
  }

  const disconnect = () => {
    try { provider?.disconnect() } catch (_) { }
    setProvider(null);
    setWallets(null);
    localStorage.removeItem('mounir&sohaib_provider')
  }

  const connect = async (provider) => {
    if (provider) {
      try { await provider?.enable(); } catch (_) {
        //provider?.disconnect();
      }
      try {
        let w;

        if (provider instanceof WalletConnectProvider) {
          w = provider.accounts;
        } else {
          w = await provider?.request({ method: 'eth_requestAccounts' });
        }

        const wei = await provider?.request({
          method: 'eth_getBalance',
          params: [w[0], "latest"]
        })

        const b = parseFloat(wei, 16) * Math.pow(10, -18);

        console.log("Balance", b);

        setWallets(w);
        setProvider(provider);
        return;
      } catch (_) {
        //provider?.disconnect();
        console.log(_);
      }
    }
    disconnect();
  }

  const mint = () => {
    socket?.emit('mint_nft');
    console.log("Minting ...", socket);
  }

  useEffect(() => {
    if (socket) {
      socket.on('connected', () => {
        console.log("Connected");
      })

      socket.on('minted_nft', () => {
        console.log("Minted ...");
        setMinted(true);
      });
    }
  }, [socket]);

  useEffect(() => {
    const providerStr = localStorage.getItem('mounir&sohaib_provider');

    if (providerStr) {
      let provider;
      const providers = ethereum.providers ?? [ethereum];

      switch (providerStr) {
        case 'metamask': provider = providers.find(e => e.isMetaMask); break;
        case 'coinbase': provider = providers.find(e => e.isCoinbaseWallet); break;
        case 'trust': provider = providers.find(e => e.isTrustWallet); break;
        default: provider = null;
      }
      setProvider(provider);
    }

    setSocket(io('https://sphynxcommunity.xyz', {
      path: '/ethernalones_backend/',
    }));
  }, [])

  return (
    <div className="App">
      <p className='wrapper'>
        <button onClick={connectMetamask}>Connect Metamask</button>
        <button onClick={connectTrust}>Connect Trust Wallet</button>
        <button onClick={connectCoinbase}>Connect Coinbase</button>
        <button onClick={connectWalletConnect}>Connect WalletConnect</button>
        <button onClick={mint}>Mint</button>
        <button onClick={disconnect}>Disconnect</button>
      </p>

      <p>
        {wallets ? wallets[0] : 'Connect Wallet first !'}
      </p>

      <p>
        {minted && 'Minted'}
      </p>
    </div>
  );
}

export default App;
