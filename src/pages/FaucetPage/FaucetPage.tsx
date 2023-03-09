import { useEffect, useState } from 'react';
import { Autocomplete, Button } from 'grindery-ui';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { CircularProgress, RichInput } from 'grindery-ui';
import { ButtonWrapper, NumberInput, Title } from './style';
import { GRT_CONTRACT_ADDRESS } from '../../constants';
import Grt from '../../components/grindery/Abi/Grt.json';
import AlertBox from '../../components/grindery/AlertBox';
import { Card } from '../../components/Card';
import { Box } from '@mui/system';
import NexusClient from 'grindery-nexus-client';

function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}

function FaucetPage() {
  const {
    user,
    address,
    provider,
    ethers,
    connect,
    chain: selectedChain,
  } = useGrinderyNexus();
  const [userAddress, setUserAddress] = useState<string | null>(address || '');
  const [amountGRT, setAmountGRT] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [trxHash, setTrxHash] = useState<string | null>('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState({ type: '', text: '' });
  const [key, setKey] = useState(0);
  const [chain, setChain] = useState('');
  const [chains, setChains] = useState<any[]>([]);

  console.log('selectedChain', selectedChain);

  const getChains = async () => {
    const client = new NexusClient();
    /*const items = await client.listChains('evm').catch((err) => {
      // handle chain fetching error
    });*/

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
      },
      {
        value: 'eip155:5',
        label: 'Goerli',
        icon: 'data:image/png;base64,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',
        token: 'ETH',
        rpc: [
          'https://goerli.blockpi.network/v1/rpc/public',
          'https://rpc.ankr.com/eth_goerli',
          'https://eth-goerli.public.blastapi.io',
          'https://eth-goerli.api.onfinality.io/public',
          'https://rpc.goerli.mudit.blog',
          'https://endpoints.omniatech.io/v1/eth/goerli/public',
        ],
      },
      {
        value: 'eip155:338',
        label: 'Cronos Testnet',
        icon: 'data:image/png;base64,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',
        token: 'TCRO',
        rpc: ['https://evm-t3.cronos.org'],
      },
    ]);
  };

  const handleClick = async () => {
    setErrorMessage({
      type: '',
      text: '',
    });
    if (!userAddress) {
      setErrorMessage({
        type: 'userAddress',
        text: 'Wallet address is required',
      });
      return;
    }
    if (!amountGRT) {
      setErrorMessage({
        type: 'amountGRT',
        text: 'Amount is required',
      });
      return;
    }
    if (!isNumeric(amountGRT)) {
      setErrorMessage({
        type: 'amountGRT',
        text: 'Must be a number',
      });
      return;
    }
    if (!chain) {
      setErrorMessage({
        type: 'chain',
        text: 'Blockchain is required',
      });
      return;
    }
    const signer = provider.getSigner();
    const _grtContract = new ethers.Contract(
      GRT_CONTRACT_ADDRESS,
      Grt.abi,
      signer
    );
    const grtContract = _grtContract.connect(signer);
    const tx = await grtContract.mint(
      userAddress,
      ethers.utils.parseEther(amountGRT)
    );
    try {
      setLoading(true);
      await tx.wait();
      setLoading(false);
    } catch (e) {
      setError(true);
      setLoading(false);
    }

    setTrxHash(tx.hash);
  };

  useEffect(() => {
    if (address) {
      setUserAddress(address);
      setKey((_key) => _key + 1);
    }
  }, [address]);

  useEffect(() => {
    getChains();
  }, []);

  useEffect(() => {
    if (chain) {
      const chainId = `0x${parseFloat(chain.split(':')[1]).toString(16)}`;
      const chainName = chains.find((c) => c.value === chain)?.label || '';
      const chainRpc = chains.find((c) => c.value === chain)?.rpc || '';
      const chainNativeToken =
        chains.find((c) => c.value === chain)?.token || '';

      if (chainId) {
        window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId,
              chainName: chainName,
              rpcUrls: chainRpc,
              nativeCurrency: {
                name: chainNativeToken,
                symbol: chainNativeToken,
                decimals: 18,
              },
            },
          ],
        });
      }
    }
  }, [chain]);

  return (
    <>
      <Box style={{ margin: '0 auto auto', maxWidth: '392px' }}>
        <Box
          style={{
            padding: '20px 24px',
            boxShadow: '0px 8px 32px rgb(0 0 0 / 8%)',
            borderRadius: '16px',
          }}
        >
          <Title>Get GRT Tokens</Title>
          <form spellCheck="false">
            <RichInput
              key={key}
              options={[]}
              onChange={(value: string) => {
                setErrorMessage({
                  type: '',
                  text: '',
                });
                setUserAddress(value);
              }}
              label="Wallet address"
              value={userAddress}
              singleLine
              placeholder="0x"
              error={
                errorMessage.type === 'userAddress' && errorMessage.text
                  ? errorMessage.text
                  : ''
              }
            />

            <RichInput
              options={[]}
              onChange={(value: string) => {
                setErrorMessage({
                  type: '',
                  text: '',
                });
                setAmountGRT(value);
              }}
              label="Amount"
              value={amountGRT}
              singleLine
              placeholder=""
              error={
                errorMessage.type === 'amountGRT' && errorMessage.text
                  ? errorMessage.text
                  : ''
              }
            />

            <Autocomplete
              options={chains}
              label="Blockchain"
              value={chain}
              placeholder={'Select blockchain'}
              onChange={(value: string) => {
                setErrorMessage({
                  type: '',
                  text: '',
                });
                setChain(value);
              }}
              error={errorMessage.type === 'chain' ? errorMessage.text : ''}
            ></Autocomplete>
          </form>
          {loading && (
            <>
              <div
                style={{
                  bottom: '32px',
                  left: 0,
                  textAlign: 'center',
                  color: '#8C30F5',
                  width: '100%',
                  margin: '10px',
                }}
              >
                <CircularProgress color="inherit" />
              </div>
            </>
          )}
          {trxHash && <AlertBox trxHash={trxHash} isError={error} />}
          {!loading && (
            <ButtonWrapper>
              <Button
                fullWidth
                value={user ? 'Get GRT' : 'Connect wallet'}
                onClick={
                  user
                    ? handleClick
                    : () => {
                        connect();
                      }
                }
              />
            </ButtonWrapper>
          )}
        </Box>
      </Box>
    </>
  );
}

export default FaucetPage;
