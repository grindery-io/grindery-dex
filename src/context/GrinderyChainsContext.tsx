import React, { createContext, useEffect, useState } from 'react';
import { Chain } from '../types/Chain';

// Context props
type ContextProps = {
  isLoading: boolean;
  chains: Chain[];
};

// Context provider props
type GrinderyChainsContextProps = {
  children: React.ReactNode;
};

// Init context
export const GrinderyChainsContext = createContext<ContextProps>({
  isLoading: true,
  chains: [],
});

export const GrinderyChainsContextProvider = ({
  children,
}: GrinderyChainsContextProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [chains, setChains] = useState<Chain[]>([]);

  const getChains = async () => {
    setChains([
      {
        value: 'eip155:97',
        label: 'BSCTestnet',
        icon: 'data:image/png;base64,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',
        token: 'BNB',
        rpc: [
          'https://bsc-testnet.public.blastapi.io',
          'https://data-seed-prebsc-1-s3.binance.org:8545',
          'https://bsctestapi.terminet.io/rpc',
          'https://data-seed-prebsc-1-s1.binance.org:8545',
          'https://data-seed-prebsc-2-s1.binance.org:8545',
          'https://data-seed-prebsc-1-s2.binance.org:8545',
          'https://data-seed-prebsc-2-s2.binance.org:8545',
        ],
        tokens: [
          {
            id: '1',
            address: '0x0',
            symbol: 'BNB',

            icon: 'https://bscscan.com/token/images/binance_32.png',
          },
          {
            id: '2',
            address: '0x8965349fb649A33a30cbFDa057D8eC2C48AbE2A2',
            symbol: 'USDC',

            icon: 'https://bscscan.com/token/images/usdcgno_32.png',
          },
          {
            id: '3',
            address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
            symbol: 'ETH',
            icon: 'https://bscscan.com/token/images/ethereum_32.png',
          },
        ],
      },
      {
        value: 'eip155:5',
        label: 'Goerli',
        icon: 'data:image/png;base64,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',
        token: 'GTH',
        rpc: [
          'https://goerli.blockpi.network/v1/rpc/public',
          'https://rpc.ankr.com/eth_goerli',
          'https://eth-goerli.public.blastapi.io',
          'https://eth-goerli.api.onfinality.io/public',
          'https://rpc.goerli.mudit.blog',
          'https://endpoints.omniatech.io/v1/eth/goerli/public',
        ],
        tokens: [
          {
            id: '4',
            address: '0x0',
            symbol: 'GTH',
            icon: 'https://explorer.bitquery.io/packs/media/icon/eth-093b3f87.svg',
          },
          {
            id: '5',
            address: '0xFfb99f4A02712C909d8F7cC44e67C87Ea1E71E83',
            symbol: 'ETH',
            icon: 'https://bscscan.com/token/images/ethereum_32.png',
          },
          {
            id: '6',
            address: '0xfb501A48aFFC39aa4b4C83A025D4F0b5C1ca4A6C',
            symbol: 'BNB',
            icon: 'https://bscscan.com/token/images/binance_32.png',
          },
        ],
      },
      {
        value: 'eip155:338',
        label: 'Cronos Testnet',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAVFSURBVHgBxVhLbBtVFD3zSeqiNJhSiFV+TkRFC3GULPgUgeSs6IJFkBBUYkHMCla2i7NEtVcIKWmcHRuUdAMVAtXsYJWphEJ3SUlAUQXKSHyatBWYEmiaeOb1vvFvPm/GYztVj/I08bzfmXvvu58H7BeiySgOPj+Lofc2kPhwAvsEBfuBgyfTMM0SZDmJ/lgUPZHTGDgZx+EXr+Dm5TK6gIRu0PdKEnLPZ2CVoca72Akg0m/fIQ+5MoeVYkdEOyMYTcbBME8t6ekbeIYIHnJvowNGAavnFtAm2iPI7QxqmlT5EUxDbB6PHgMO9PksQET39saxXtSx7wQPv5YGWJ7TDBx3ZCiAYB1sAXsk0RBEWx+SI6eSeODYPCTpfUhyhBqEDbIOWXoDD8cKYNJD9HLUf1HqU+RJxF6OYGvpUtD2/hKMnSI7i3xCB+Ct5jBWm2J7MqkMxubw+NNFx0EYzcRhKIs0Lo5ABNunl2B0IooI0rR3hnqD1SkrC/jfyKJc8j+hiTOTtM3Z1kShYa+ScqvdSfCJt0/D2PvYuRiDR4KMFmP01ZslDWEwmomiovIPPtt6sNM+nTbY/9wq2VPUZlf0V3tW3+lQerP448ssttd1z9pxInL01eO4sbTpeL95eQfXlzQcfeF8KPuU5X+s8dWd7X2Ks8n1p1omcgX07I7ht88XhOuOTKVxSN2AwpYp1M3jONmgGyskldWZSdLAOElKRwg4CcqKtylqCYo5ht8v5KELbG04l8Tw1DIdlCIaLkiaRA+RHcmJVbo2rRHRQcBMtSLqIqh6m9SbgX7BuwiXUCK3SHZFjYlVxijMJaY2qgdFgOrJvdQGwbrk5Ob/bnA745LpUZfpV9LFSKd23vUuTgvNW1IWqb0FfAiqNoIR54w+ddGSjCOiMPKFKEAxxiwbUyqDHtVxKavqvHWi24DqJGj/ycQzJCnq6GPSHNRK3uGkVywXMdjwgdyZA1nL9tqEi6CCWnRoBoyI6T+bR5C16Yxvf9XGFtAFnASlms3V/bLEyfYGTJe6SkbDQCBBO4iggfsKlwTdobmu53sI0xTs24SK+w3TEBBsCqU7ghJ7quWYZzOjMFH2TU6ZYeNT11iToIyuQCHNihSCMrPq0GcpVC4Hhj0uQa5mq9n+75ggM79xvYgT0YuOBKGeOPCcsjGMnPsIRRO3o2YVImRvRvXZMcG1mYw4yNcShETub2fi0CBYgEwFk7v8rBg1UkaTnE2Cndlg3QGPnMmQU0+7smU3MY0iTaoWXbxg5oOOnNh6144NqrLmm438eK5I8XfcmyBYu+hW3rc2PS4kx0uLJ9+h2tqYsA6KjwSd5zuRC3B6Uolq2qzvaeRFUkW9SCc7DlMq4KfponAcJ9YXSZNr4fYpThwYK1j5Z3sEG7ODa1p+CPyuOWJv0lUJpV4S4giESWXFV9YHOmNb2JpBUSYw8BLVDT+seLp5/eHGYxOj6DvxhXVPAzNKdgdhg1km9X6Aa19/2thNyCF0qchrWvra1ZmSsJtflRzo5+tkgtchRy5R2raDoruEDb76CE1UoPZHXqfT7U5shdDImaeohNVFna3vZqo3BHka+m7LsVyFm79cgbEz2/KjJJB5sCxufqsFDwuLKlG+cfDt6Y1fgd3//PuZpc4C/vquiBBo/36wldqvXwXubPtMJjuDkUdZC53odn7DOpzLk8/jUcRpY1vrwM6/7l003JFS2NF0tInuroBF9nntZyJ4q7Y6nXLGUtj+XkOH6I5gHfartj9Xgdu3ypY6e3uL7agT94xgHdw+t67GsbvdNbE67gLGASCUUYAwaQAAAABJRU5ErkJggg==',
        token: 'TCRO',
        rpc: ['https://evm-t3.cronos.org'],
        tokens: [
          {
            id: '7',
            address: '0x0',
            symbol: 'TCRO',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAVFSURBVHgBxVhLbBtVFD3zSeqiNJhSiFV+TkRFC3GULPgUgeSs6IJFkBBUYkHMCla2i7NEtVcIKWmcHRuUdAMVAtXsYJWphEJ3SUlAUQXKSHyatBWYEmiaeOb1vvFvPm/GYztVj/I08bzfmXvvu58H7BeiySgOPj+Lofc2kPhwAvsEBfuBgyfTMM0SZDmJ/lgUPZHTGDgZx+EXr+Dm5TK6gIRu0PdKEnLPZ2CVoca72Akg0m/fIQ+5MoeVYkdEOyMYTcbBME8t6ekbeIYIHnJvowNGAavnFtAm2iPI7QxqmlT5EUxDbB6PHgMO9PksQET39saxXtSx7wQPv5YGWJ7TDBx3ZCiAYB1sAXsk0RBEWx+SI6eSeODYPCTpfUhyhBqEDbIOWXoDD8cKYNJD9HLUf1HqU+RJxF6OYGvpUtD2/hKMnSI7i3xCB+Ct5jBWm2J7MqkMxubw+NNFx0EYzcRhKIs0Lo5ABNunl2B0IooI0rR3hnqD1SkrC/jfyKJc8j+hiTOTtM3Z1kShYa+ScqvdSfCJt0/D2PvYuRiDR4KMFmP01ZslDWEwmomiovIPPtt6sNM+nTbY/9wq2VPUZlf0V3tW3+lQerP448ssttd1z9pxInL01eO4sbTpeL95eQfXlzQcfeF8KPuU5X+s8dWd7X2Ks8n1p1omcgX07I7ht88XhOuOTKVxSN2AwpYp1M3jONmgGyskldWZSdLAOElKRwg4CcqKtylqCYo5ht8v5KELbG04l8Tw1DIdlCIaLkiaRA+RHcmJVbo2rRHRQcBMtSLqIqh6m9SbgX7BuwiXUCK3SHZFjYlVxijMJaY2qgdFgOrJvdQGwbrk5Ob/bnA745LpUZfpV9LFSKd23vUuTgvNW1IWqb0FfAiqNoIR54w+ddGSjCOiMPKFKEAxxiwbUyqDHtVxKavqvHWi24DqJGj/ycQzJCnq6GPSHNRK3uGkVywXMdjwgdyZA1nL9tqEi6CCWnRoBoyI6T+bR5C16Yxvf9XGFtAFnASlms3V/bLEyfYGTJe6SkbDQCBBO4iggfsKlwTdobmu53sI0xTs24SK+w3TEBBsCqU7ghJ7quWYZzOjMFH2TU6ZYeNT11iToIyuQCHNihSCMrPq0GcpVC4Hhj0uQa5mq9n+75ggM79xvYgT0YuOBKGeOPCcsjGMnPsIRRO3o2YVImRvRvXZMcG1mYw4yNcShETub2fi0CBYgEwFk7v8rBg1UkaTnE2Cndlg3QGPnMmQU0+7smU3MY0iTaoWXbxg5oOOnNh6144NqrLmm438eK5I8XfcmyBYu+hW3rc2PS4kx0uLJ9+h2tqYsA6KjwSd5zuRC3B6Uolq2qzvaeRFUkW9SCc7DlMq4KfponAcJ9YXSZNr4fYpThwYK1j5Z3sEG7ODa1p+CPyuOWJv0lUJpV4S4giESWXFV9YHOmNb2JpBUSYw8BLVDT+seLp5/eHGYxOj6DvxhXVPAzNKdgdhg1km9X6Aa19/2thNyCF0qchrWvra1ZmSsJtflRzo5+tkgtchRy5R2raDoruEDb76CE1UoPZHXqfT7U5shdDImaeohNVFna3vZqo3BHka+m7LsVyFm79cgbEz2/KjJJB5sCxufqsFDwuLKlG+cfDt6Y1fgd3//PuZpc4C/vquiBBo/36wldqvXwXubPtMJjuDkUdZC53odn7DOpzLk8/jUcRpY1vrwM6/7l003JFS2NF0tInuroBF9nntZyJ4q7Y6nXLGUtj+XkOH6I5gHfartj9Xgdu3ypY6e3uL7agT94xgHdw+t67GsbvdNbE67gLGASCUUYAwaQAAAABJRU5ErkJggg==',
          },
          {
            id: '8',
            address: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59',
            symbol: 'USDC',
            icon: 'https://bscscan.com/token/images/usdcgno_32.png',
          },
          {
            id: '9',
            address: '0xF2001B145b43032AAF5Ee2884e456CCd805F677D',
            symbol: 'DAI',
            icon: 'https://cronoscan.com/token/images/MCDDai_32.png',
          },
        ],
      },
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    getChains();
  }, []);

  return (
    <GrinderyChainsContext.Provider
      value={{
        isLoading,
        chains,
      }}
    >
      {children}
    </GrinderyChainsContext.Provider>
  );
};

export default GrinderyChainsContextProvider;
